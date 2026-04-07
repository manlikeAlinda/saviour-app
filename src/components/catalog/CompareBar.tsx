"use client";

import Link from "next/link";
import { X, BarChart2 } from "lucide-react";
import { useCompareStore } from "@/store/compare";

export function CompareBar() {
  const { items, removeFromCompare, clearCompare } = useCompareStore();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-green-500/30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 text-green-400 shrink-0">
          <BarChart2 className="h-4 w-4" />
          <span className="text-xs font-mono font-bold tracking-widest uppercase">
            Compare ({items.length}/4)
          </span>
        </div>

        <div className="flex-1 flex items-center gap-3 overflow-x-auto">
          {items.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-2 bg-gray-900 border border-gray-700 px-3 py-1.5 shrink-0"
            >
              <span className="text-white text-xs font-medium truncate max-w-[120px]">{product.name}</span>
              <button
                onClick={() => removeFromCompare(product.id)}
                className="text-gray-400 hover:text-red-400 transition-colors shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs text-gray-400 hover:text-white font-mono transition-colors"
          >
            Clear
          </button>
          <Link
            href="/compare"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors"
          >
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  );
}
