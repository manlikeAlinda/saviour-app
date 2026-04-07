"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart, Trash2, ChevronRight, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { PriceDisplay } from "@/components/catalog/PriceDisplay";
import { StockBadge } from "@/components/catalog/StockBadge";

interface WishlistProduct {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: number | null;
  priceVisibilityMode: string;
  stockStatus: string;
  sku: string;
}

interface WishlistItem {
  id: number;
  productId: number;
  product: WishlistProduct;
}

export default function WishlistPage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/account/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/v1/account/wishlist")
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, [status]);

  async function removeFromWishlist(productId: number) {
    await fetch(`/api/v1/account/wishlist?productId=${productId}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-gray-400">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-black font-bold">Wishlist</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-6 w-6 text-green-600" />
          <h1 className="text-3xl font-bold text-black tracking-tighter">My Wishlist</h1>
          <span className="text-gray-400 text-sm">({items.length} items)</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-12 w-12 mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 mb-6">Your wishlist is empty.</p>
            <Link href="/products" className="px-6 py-3 bg-black text-white font-bold text-sm hover:bg-gray-900 transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map(({ id, product }) => (
              <div key={id} className="border border-gray-200 hover:border-green-500 transition-colors group">
                <Link href={`/product/${product.slug}`} className="block aspect-square bg-gray-50 relative overflow-hidden border-b border-gray-100">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-200">
                      <Heart className="h-10 w-10" />
                    </div>
                  )}
                </Link>
                <div className="p-4 space-y-2">
                  <Link href={`/product/${product.slug}`} className="font-bold text-sm text-black hover:text-green-700 transition-colors block line-clamp-2">
                    {product.name}
                  </Link>
                  <p className="text-xs text-gray-400 font-mono">{product.sku}</p>
                  <div className="flex items-center justify-between">
                    <StockBadge status={product.stockStatus} />
                    <PriceDisplay price={product.price} priceVisibilityMode={product.priceVisibilityMode} className="text-sm" />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => addItem({ productId: product.id, name: product.name, sku: product.sku, price: product.price, priceVisibilityMode: product.priceVisibilityMode, imageUrl: product.imageUrl, stockStatus: product.stockStatus, minOrderQuantity: 1 })}
                      disabled={product.stockStatus === "out_of_stock"}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-mono bg-black text-green-400 hover:bg-green-700 hover:text-white transition-colors disabled:opacity-40"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="px-3 py-2 border border-gray-200 text-red-400 hover:border-red-300 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
