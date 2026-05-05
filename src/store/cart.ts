import { create } from "zustand";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type CartState = {
  cart: Product[];
  addToCart: (item: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>((set) => ({
  cart: [],

  addToCart: (item) =>
    set((state) => ({
      cart: [...state.cart, item],
    })),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((p) => p.id !== id),
    })),

  clearCart: () => set({ cart: [] }),
}));