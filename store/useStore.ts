import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const useStore = create<UserState & CartState>()(
    persist(
        (set, get) => ({
            // User State
            user: null,
            username: 'Guest',
            setUser: (user) => set({ user, username: user?.username || 'Guest' }),
            logout: () => set({ user: null, username: 'Guest', cart: [] }), // Clear cart on logout?

            // Cart State
            cart: [],
            addToCart: (item) => set((state) => {
                const existing = state.cart.find((c) => c.id === item.id);
                if (existing) {
                    return {
                        cart: state.cart.map((c) =>
                            c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
                        ),
                    };
                }
                return { cart: [...state.cart, { ...item, quantity: 1 }] };
            }),
            removeFromCart: (id) => set((state) => ({
                cart: state.cart.filter((c) => c.id !== id),
            })),
            updateQuantity: (id, delta) => set((state) => ({
                cart: state.cart.map((c) => {
                    if (c.id === id) {
                        const newQuantity = Math.max(0, c.quantity + delta);
                        return { ...c, quantity: newQuantity };
                    }
                    return c;
                }).filter((c) => c.quantity > 0)
            })),
            clearCart: () => set({ cart: [] }),
            cartTotal: () => {
                const cart = get().cart;
                return cart.reduce((total, item) => {
                    // Price might be string like "₹20.00"
                    const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
                    return total + (price * item.quantity);
                }, 0);
            },
        }),
        {
            name: 'app-storage', // unique name
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
