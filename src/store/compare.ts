"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CompareProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  imageUrl: string | null;
  price: number | null;
  priceVisibilityMode: string;
  stockStatus: string;
  category: { name: string; slug: string } | null;
  specifications?: { specName: string; specValue: string; specUnit: string | null }[];
}

const MAX_COMPARE = 4;

interface CompareStore {
  items: CompareProduct[];
  addToCompare: (product: CompareProduct) => boolean; // returns false if full
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
  isInCompare: (id: number) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCompare: (product) => {
        const current = get().items;
        if (current.length >= MAX_COMPARE) return false;
        if (current.some((p) => p.id === product.id)) return true;
        set({ items: [...current, product] });
        return true;
      },
      removeFromCompare: (id) =>
        set((state) => ({ items: state.items.filter((p) => p.id !== id) })),
      clearCompare: () => set({ items: [] }),
      isInCompare: (id) => get().items.some((p) => p.id === id),
    }),
    { name: "saviour-compare" }
  )
);
