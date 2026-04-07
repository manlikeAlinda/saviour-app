"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: number;
  name: string;
  sku: string;
  price: number | null;
  priceVisibilityMode: string;
  quantity: number;
  imageUrl: string | null;
  stockStatus: string;
  minOrderQuantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (incoming) => {
        const qty = incoming.quantity ?? incoming.minOrderQuantity ?? 1;
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === incoming.productId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === incoming.productId
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: incoming.productId,
                name: incoming.name,
                sku: incoming.sku,
                price: incoming.price,
                priceVisibilityMode: incoming.priceVisibilityMode,
                quantity: qty,
                imageUrl: incoming.imageUrl,
                stockStatus: incoming.stockStatus,
                minOrderQuantity: incoming.minOrderQuantity,
              },
            ],
          };
        });
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.productId !== productId) };
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i
            ),
          };
        }),
      clearCart: () => set({ items: [] }),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => {
          if (i.price && i.priceVisibilityMode === "show_exact_price") {
            return sum + i.price * i.quantity;
          }
          return sum;
        }, 0),
    }),
    {
      name: "saviour-cart",
    }
  )
);
