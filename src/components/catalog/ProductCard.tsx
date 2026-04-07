"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye, BarChart2 } from "lucide-react";
import { StockBadge } from "./StockBadge";
import { PriceDisplay } from "./PriceDisplay";
import { useCartStore } from "@/store/cart";
import { useCompareStore } from "@/store/compare";
import { truncate } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    sku: string;
    shortDescription: string | null;
    price: number | null;
    priceVisibilityMode: string;
    stockStatus: string;
    imageUrl: string | null;
    minimumOrderQuantity: number;
    isFeatured: boolean;
    category?: { name: string; slug: string } | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { addToCompare, removeFromCompare, isInCompare } = useCompareStore();
  const inCompare = isInCompare(product.id);
  const isOutOfStock = product.stockStatus === "out_of_stock";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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
    });
  };

  return (
    <div className="group relative flex flex-col bg-white border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all duration-200">
      {product.isFeatured && (
        <div className="absolute top-0 left-0 z-10 bg-black text-green-400 text-[9px] font-mono font-bold px-2 py-1 tracking-widest uppercase">
          Featured
        </div>
      )}

      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-square bg-gray-50 overflow-hidden border-b border-gray-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-200">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 space-y-2">
        {product.category && (
          <Link
            href={`/category/${product.category.slug}`}
            className="text-[10px] font-mono font-bold tracking-widest uppercase text-green-700 hover:text-green-600 transition-colors"
          >
            {product.category.name}
          </Link>
        )}

        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-bold text-black leading-snug group-hover:text-green-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-[10px] font-mono text-gray-400 tracking-wider">SKU: {product.sku}</p>

        {product.shortDescription && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {truncate(product.shortDescription, 80)}
          </p>
        )}

        <div className="flex-1" />

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <StockBadge status={product.stockStatus} />
          <PriceDisplay
            price={product.price}
            priceVisibilityMode={product.priceVisibilityMode}
            className="text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link
            href={`/product/${product.slug}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-mono border border-gray-200 text-gray-600 hover:border-black hover:text-black transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            Details
          </Link>
          <button
            onClick={(e) => { e.preventDefault(); inCompare ? removeFromCompare(product.id) : addToCompare({ id: product.id, name: product.name, slug: product.slug, sku: product.sku, imageUrl: product.imageUrl, price: product.price, priceVisibilityMode: product.priceVisibilityMode, stockStatus: product.stockStatus, category: product.category ?? null }); }}
            title={inCompare ? "Remove from compare" : "Add to compare"}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-mono border transition-colors ${inCompare ? "border-green-600 text-green-700 bg-green-50" : "border-gray-200 text-gray-600 hover:border-green-600 hover:text-green-700"}`}
          >
            <BarChart2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-mono bg-black text-green-400 hover:bg-green-700 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {isOutOfStock ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
