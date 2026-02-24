import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiService } from '../services/api';

interface UserState {
    user: any | null;
    username: string;
    setUser: (user: any) => void;
    logout: () => void;
}

interface CartItem {
    id: string;
    name: string;
    price: string;
    image: string;
    quantity: number;
    category?: string;
}

interface CartState {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    cartTotal: () => number;
}

interface Address {
    id: string;
    label: string; // e.g. Home, Work
    details: string; // Full address string
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

interface AddressState {
    addresses: Address[];
    addAddress: (address: Address) => void;
    removeAddress: (id: string) => void;
}

export const useStore = create<UserState & CartState & AddressState>()(
    persist(
        (set, get) => ({
            // User State
            user: null,
            username: 'Guest',
            setUser: (user) => set({ user, username: user?.username || 'Guest' }),
            logout: () => set({ user: null, username: 'Guest', cart: [] }), // Clear cart on logout?

            // Cart State
            cart: [],
            addToCart: async (item) => {
                try {
                    await ApiService.addToCart(parseInt(item.id), item.quantity || 1);
                    set((state) => {
                        const existing = state.cart.find((c) => c.id === item.id);
                        if (existing) {
                            return {
                                cart: state.cart.map((c) =>
                                    c.id === item.id ? { ...c, quantity: c.quantity + (item.quantity || 1) } : c
                                ),
                            };
                        }
                        return { cart: [...state.cart, { ...item, quantity: item.quantity || 1 }] };
                    });
                } catch (error) {
                    console.error("Cart Add Error", error);
                }
            },
            removeFromCart: async (id) => {
                try {
                    await ApiService.removeFromCart(parseInt(id));
                    set((state) => ({
                        cart: state.cart.filter((c) => c.id !== id),
                    }));
                } catch (error) {
                    console.error("Cart Remove Error", error);
                }
            },
            updateQuantity: async (id, delta) => {
                const item = get().cart.find(c => c.id === id);
                if (item) {
                    const newQty = Math.max(0, item.quantity + delta);
                    try {
                        if (newQty === 0) {
                            await ApiService.removeFromCart(parseInt(id));
                        } else {
                            await ApiService.updateCart(parseInt(id), newQty);
                        }
                        set((state) => ({
                            cart: state.cart.map((c) => {
                                if (c.id === id) {
                                    return { ...c, quantity: newQty };
                                }
                                return c;
                            }).filter((c) => c.quantity > 0)
                        }));
                    } catch (error) {
                        console.error("Cart Update Error", error);
                    }
                }
            },
            clearCart: () => set({ cart: [] }),
            cartTotal: () => {
                const cart = get().cart;
                return cart.reduce((total, item) => {
                    // Price might be string like "₹20.00"
                    const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
                    return total + (price * item.quantity);
                }, 0);
            },

            // Address State
            addresses: [],
            addAddress: (address) => set((state) => ({ addresses: [...state.addresses, address] })),
            removeAddress: (id) => set((state) => ({ addresses: state.addresses.filter((a) => a.id !== id) })),
        }),
        {
            name: 'app-storage', // unique name
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
