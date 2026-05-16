import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showAlert } from '../components/CustomAlert';

const BASE_URL = 'https://irhealthcareservice.com/app_api/v2/';
const DEFAULT_PINCODE = '721434';

// ── helpers ──────────────────────────────────────────────────────────────────

async function getToken(): Promise<string | null> {
    try {
        const raw = await AsyncStorage.getItem('ACCESS_TOKEN');
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return typeof parsed === 'string' ? parsed : null;
    } catch {
        return null;
    }
}

async function apiFetch(path: string, method: 'GET' | 'POST' = 'POST', body?: FormData): Promise<any> {
    const token = await getToken();
    const headers: Record<string, string> = { Accept: '*/*' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const url = `${BASE_URL}${path}`;
    try {
        const opts: RequestInit = { method, headers };
        if (method === 'POST' && body) opts.body = body;
        const response = await fetch(url, opts);
        const text = await response.text();
        try { return JSON.parse(text); } catch { return { status: 'error', message: 'Invalid JSON', raw: text }; }
    } catch (err: any) {
        throw err;
    }
}

function makeFormData(data: Record<string, string>): FormData {
    const fd = new FormData();
    for (const [key, val] of Object.entries(data)) fd.append(key, val);
    return fd;
}

// ── Cart API (bypasses axios — uses fetch directly) ─────────────────────────

const CartApi = {
    getCart: (pincode = DEFAULT_PINCODE) =>
        apiFetch(`cart/get_cart.php?pincode=${pincode}`, 'GET'),

    addToCart: (medID: number, qty: number, pincode = DEFAULT_PINCODE) =>
        apiFetch('cart/add_to_cart.php', 'POST',
            makeFormData({ medID: medID.toString(), qty: qty.toString(), pincode })),

    updateCart: (medID: number, qty: number) =>
        apiFetch('cart/update_cart.php', 'POST',
            makeFormData({ medID: medID.toString(), qty: qty.toString() })),

    removeFromCart: (medID: number) =>
        apiFetch('cart/remove_from_cart.php', 'POST',
            makeFormData({ medID: medID.toString() })),
};

// ── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
    id: string;       // medID as string
    name: string;
    price: string;    // numeric string e.g. "244.38"
    image: string;
    quantity: number;
    category?: string;
}

interface UserState {
    user: any | null;
    username: string;
    setUser: (user: any) => void;
    logout: () => void;
}

interface CartState {
    cart: CartItem[];
    cartLoading: boolean;
    addToCart: (item: CartItem) => Promise<void>;
    removeFromCart: (id: string) => Promise<void>;
    updateQuantity: (id: string, delta: number) => Promise<void>;
    clearCart: () => void;
    cartTotal: () => number;
    syncCartFromServer: () => Promise<void>;
}

interface Address {
    id: string;
    label: string;
    details: string;
    pname?: string;
    usermob?: string;
    coordinates?: { latitude: number; longitude: number };
}

interface AddressState {
    addresses: Address[];
    selectedAddress: Address | null;
    setSelectedAddress: (address: Address | null) => void;
    addAddress: (address: Address) => Promise<void>;
    removeAddress: (id: string) => void;
    fetchAddresses: () => Promise<void>;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useStore = create<UserState & CartState & AddressState>()(
    persist(
        (set, get) => ({
            // ─── User ─────────────────────────────────────────────────────
            user: null,
            username: 'Guest',
            setUser: (user) => set({ user, username: user?.username || user?.name || 'Guest' }),
            logout: () => set({ user: null, username: 'Guest', cart: [] }),

            // ─── Cart ─────────────────────────────────────────────────────
            cart: [],
            cartLoading: false,

            addToCart: async (item) => {
                // Optimistic update first (instant UI feedback)
                set((state) => {
                    const existing = state.cart.find((c) => c.id === item.id);
                    if (existing) {
                        return {
                            cart: state.cart.map((c) =>
                                c.id === item.id
                                    ? { ...c, quantity: c.quantity + (item.quantity || 1) }
                                    : c
                            ),
                        };
                    }
                    return { cart: [...state.cart, { ...item, quantity: item.quantity || 1 }] };
                });

                // Sync to server
                try {
                    const result = await CartApi.addToCart(parseInt(item.id), item.quantity || 1);
                    if (result.status !== 'success') {
                        // Revert the optimistic update
                        set((state) => ({
                            cart: state.cart
                                .map((c) => c.id === item.id ? { ...c, quantity: c.quantity - (item.quantity || 1) } : c)
                                .filter((c) => c.quantity > 0),
                        }));
                        const msg = result.message || 'Could not add to cart';
                        showAlert({ type: 'error', title: 'Cannot Add to Cart', message: msg });
                        throw new Error(msg);
                    }
                } catch (err: any) {
                    if (!err?.message) throw err;  // propagate unexpected errors
                    throw err;
                }
            },

            removeFromCart: async (id) => {
                // Optimistic remove
                set((state) => ({ cart: state.cart.filter((c) => c.id !== id) }));
                try {
                    const result = await CartApi.removeFromCart(parseInt(id));
                } catch { }
            },

            updateQuantity: async (id, delta) => {
                const item = get().cart.find((c) => c.id === id);
                if (!item) return;

                const newQty = Math.max(0, item.quantity + delta);

                // Optimistic update
                if (newQty === 0) {
                    set((state) => ({ cart: state.cart.filter((c) => c.id !== id) }));
                } else {
                    set((state) => ({
                        cart: state.cart.map((c) => c.id === id ? { ...c, quantity: newQty } : c),
                    }));
                }

                // Sync to server
                try {
                    if (newQty === 0) {
                        await CartApi.removeFromCart(parseInt(id));
                    } else {
                        await CartApi.updateCart(parseInt(id), newQty);
                    }
                } catch { }
            },

            clearCart: () => set({ cart: [] }),

            cartTotal: () => {
                const { cart } = get();
                return cart.reduce((total, item) => {
                    const raw = item.price;
                    const priceStr = (raw === undefined || raw === null) ? '0' : String(raw);
                    const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
                    return total + price * (item.quantity || 1);
                }, 0);
            },

            syncCartFromServer: async () => {
                set({ cartLoading: true });
                try {
                    const response = await CartApi.getCart();
                    if (response?.status === 'success' && response?.data?.items) {
                        const seen = new Set<string>();
                        const serverCart: CartItem[] = [];

                        for (const item of response.data.items) {
                            const key = item.medID.toString();
                            if (seen.has(key)) continue;
                            if (item.available_qty === 0) continue; // skip fully OOS items
                            seen.add(key);

                            serverCart.push({
                                id: item.medID.toString(),
                                name: item.name,
                                price: item.price.toString(),
                                image: '',
                                quantity: item.cart_qty,
                                category: item.companyname || '',
                            });
                        }

                        // Preserve local images
                        const localCart = get().cart;
                        const merged = serverCart.map((si) => {
                            const local = localCart.find((l) => l.id === si.id);
                            return { ...si, image: local?.image || '' };
                        });

                        set({ cart: merged });
                    } else {
                        // no-op on error
                    }
                } catch { } finally {
                    set({ cartLoading: false });
                }
            },

            // ─── Addresses ────────────────────────────────────────────────
            addresses: [],
            selectedAddress: null,
            setSelectedAddress: (address) => set({ selectedAddress: address }),

            addAddress: async (address) => {
                // Optimistic local add
                set((state) => ({ addresses: [...state.addresses, address] }));

                // Sync to server
                try {
                    const fd = makeFormData({
                        pname: address.pname || address.label || 'Customer',
                        usermob: address.usermob || '',
                        address: address.details,
                        label: address.label || 'Home',
                        latitude: address.coordinates?.latitude?.toString() || '',
                        longitude: address.coordinates?.longitude?.toString() || '',
                    });
                    const result = await apiFetch('address/add_address.php', 'POST', fd);
                    if (result.status === 'success' && result.data?.id) {
                        // Update with server ID
                        set((state) => ({
                            addresses: state.addresses.map((a) =>
                                a.id === address.id ? { ...a, id: result.data.id.toString() } : a
                            ),
                        }));
                    }
                } catch (e) {
                    console.warn('Failed to save address to server:', e);
                }
            },

            removeAddress: (id) => {
                set((state) => ({
                    addresses: state.addresses.filter((a) => a.id !== id),
                }));
                // Sync delete to server
                apiFetch('address/delete_address.php', 'POST', makeFormData({ id })).catch(() => {});
            },

            fetchAddresses: async () => {
                try {
                    const result = await apiFetch('address/get_address.php', 'GET');
                    if (result.status === 'success' && Array.isArray(result.data)) {
                        const mapped: Address[] = result.data.map((item: any) => ({
                            id: (item.id || item.aid || Date.now()).toString(),
                            label: item.label || 'Home',
                            details: item.address || '',
                            pname: item.pname || '',
                            usermob: item.usermob || '',
                            coordinates: item.latitude && item.longitude
                                ? { latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude) }
                                : undefined,
                        }));
                        set({ addresses: mapped });
                    }
                } catch (e) {
                    console.warn('Failed to fetch addresses:', e);
                }
            },
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
