"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChevronRight, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Inquiry {
  id: number;
  inquiryReference: string;
  status: string;
  createdAt: string;
  totalEstimate: number | null;
  subtotalAmount: number | null;
  items: { productNameSnapshot: string; quantity: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/account/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/v1/account/orders")
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-gray-400">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-black font-bold">My Orders</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-black tracking-tighter">My Orders</h1>
          <span className="text-sm text-gray-400">Signed in as {session?.user?.email}</span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-12 w-12 mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 mb-6">No orders yet. Orders are matched by your email address.</p>
            <Link href="/products" className="px-6 py-3 bg-black text-white font-bold text-sm hover:bg-gray-900 transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-mono font-bold text-black">{order.inquiryReference}</span>
                    <span className="text-gray-400 text-sm ml-4">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {order.totalEstimate != null && (
                      <span className="font-bold text-green-700">{formatPrice(order.totalEstimate)}</span>
                    )}
                    <span className={`text-xs font-bold px-2 py-1 rounded-sm capitalize ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {order.items.slice(0, 3).map((item, i) => (
                    <span key={i}>{item.productNameSnapshot} ×{item.quantity}{i < Math.min(order.items.length, 3) - 1 ? ", " : ""}</span>
                  ))}
                  {order.items.length > 3 && <span className="text-gray-400"> +{order.items.length - 3} more</span>}
                </div>
                <div className="mt-3">
                  <Link
                    href={`/track?reference=${order.inquiryReference}`}
                    className="text-xs text-green-700 font-bold hover:underline"
                  >
                    Track this order →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
