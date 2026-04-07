"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, X, ShoppingCart } from "lucide-react";
import { useCompareStore } from "@/store/compare";
import { useCartStore } from "@/store/cart";
import { PriceDisplay } from "@/components/catalog/PriceDisplay";
import { StockBadge } from "@/components/catalog/StockBadge";

export default function ComparePage() {
  const { items, removeFromCompare, clearCompare } = useCompareStore();
  const addItem = useCartStore((s) => s.addItem);

  // Collect all unique spec names across all products
  const allSpecNames = Array.from(
    new Set(
      items.flatMap((p) => (p.specifications ?? []).map((s) => s.specName))
    )
  );

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
        <p className="text-gray-400 text-lg mb-4">No products selected for comparison.</p>
        <Link href="/products" className="px-6 py-3 bg-black text-white font-bold text-sm hover:bg-gray-900 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-gray-400">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-green-600 transition-colors">Products</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-black font-bold">Compare</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-black tracking-tighter">Compare Products</h1>
          <button onClick={clearCompare} className="text-sm text-gray-400 hover:text-red-500 font-mono transition-colors">
            Clear all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr>
                <td className="w-40 border border-gray-200 p-4 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</td>
                {items.map((product) => (
                  <td key={product.id} className="border border-gray-200 p-4 align-top">
                    <div className="relative">
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="absolute -top-2 -right-2 p-1 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>

                      <div className="aspect-square w-full max-w-[140px] mx-auto bg-gray-50 mb-3 flex items-center justify-center">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} width={140} height={140} className="object-contain" />
                        ) : (
                          <div className="text-gray-200 text-xs">No image</div>
                        )}
                      </div>

                      <Link href={`/product/${product.slug}`} className="font-bold text-sm text-black hover:text-green-700 transition-colors block mb-1">
                        {product.name}
                      </Link>
                      <p className="text-xs text-gray-400 font-mono mb-3">{product.sku}</p>

                      <button
                        onClick={() => addItem({ productId: product.id, name: product.name, sku: product.sku, price: product.price, priceVisibilityMode: product.priceVisibilityMode, imageUrl: product.imageUrl, stockStatus: product.stockStatus, minOrderQuantity: 1 })}
                        disabled={product.stockStatus === "out_of_stock"}
                        className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-mono bg-black text-green-400 hover:bg-green-700 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Add to Cart
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Price */}
              <tr>
                <td className="border border-gray-200 p-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-widest">Price</td>
                {items.map((p) => (
                  <td key={p.id} className="border border-gray-200 p-4">
                    <PriceDisplay price={p.price} priceVisibilityMode={p.priceVisibilityMode} className="text-sm font-bold" />
                  </td>
                ))}
              </tr>

              {/* Stock */}
              <tr>
                <td className="border border-gray-200 p-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-widest">Availability</td>
                {items.map((p) => (
                  <td key={p.id} className="border border-gray-200 p-4">
                    <StockBadge status={p.stockStatus} />
                  </td>
                ))}
              </tr>

              {/* Category */}
              <tr>
                <td className="border border-gray-200 p-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-widest">Category</td>
                {items.map((p) => (
                  <td key={p.id} className="border border-gray-200 p-4 text-sm text-gray-700">
                    {p.category?.name ?? "—"}
                  </td>
                ))}
              </tr>

              {/* Specs */}
              {allSpecNames.length > 0 && (
                <tr>
                  <td colSpan={items.length + 1} className="border border-gray-200 p-3 bg-black text-green-400 text-[10px] font-mono font-bold uppercase tracking-widest">
                    Specifications
                  </td>
                </tr>
              )}

              {allSpecNames.map((specName) => (
                <tr key={specName}>
                  <td className="border border-gray-200 p-4 bg-gray-50 text-xs font-medium text-gray-600">{specName}</td>
                  {items.map((p) => {
                    const spec = (p.specifications ?? []).find((s) => s.specName === specName);
                    return (
                      <td key={p.id} className="border border-gray-200 p-4 text-sm text-gray-700">
                        {spec ? `${spec.specValue}${spec.specUnit ? ` ${spec.specUnit}` : ""}` : <span className="text-gray-300">—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
