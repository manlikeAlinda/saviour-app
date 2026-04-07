"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/cart";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number | null;
  priceVisibilityMode: string;
  imageUrl: string | null;
  stockStatus: string;
  minimumOrderQuantity: number;
  unitOfMeasure: string;
}

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(product.minimumOrderQuantity);
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stockStatus === "out_of_stock";

  const handleAdd = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      priceVisibilityMode: product.priceVisibilityMode,
      imageUrl: product.imageUrl,
      stockStatus: product.stockStatus,
      minOrderQuantity: product.minimumOrderQuantity,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-gray-400">Qty</span>
        <div className="flex items-center border border-gray-200">
          <button
            className="px-3 py-2 text-gray-500 hover:bg-gray-50 font-mono transition-colors disabled:opacity-30"
            onClick={() => setQty(Math.max(product.minimumOrderQuantity, qty - 1))}
            disabled={qty <= product.minimumOrderQuantity}
          >
            −
          </button>
          <span className="px-4 py-2 text-sm font-mono font-bold text-black min-w-10 text-center border-x border-gray-200">
            {qty}
          </span>
          <button
            className="px-3 py-2 text-gray-500 hover:bg-gray-50 font-mono transition-colors"
            onClick={() => setQty(qty + 1)}
          >
            +
          </button>
        </div>
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{product.unitOfMeasure}</span>
      </div>

      <button
        onClick={handleAdd}
        disabled={isOutOfStock}
        className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 font-mono font-bold text-sm bg-black text-green-400 hover:bg-green-700 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </>
        )}
      </button>
    </div>
  );
}
