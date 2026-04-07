"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Search, Package, CheckCircle, Clock, XCircle, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

const STATUS_MAP: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  new: { label: "Received", icon: <Clock className="h-5 w-5" />, color: "text-blue-600" },
  processing: { label: "Processing", icon: <Package className="h-5 w-5" />, color: "text-yellow-600" },
  confirmed: { label: "Confirmed", icon: <CheckCircle className="h-5 w-5" />, color: "text-green-600" },
  dispatched: { label: "Dispatched", icon: <Truck className="h-5 w-5" />, color: "text-purple-600" },
  completed: { label: "Completed", icon: <CheckCircle className="h-5 w-5" />, color: "text-green-700" },
  cancelled: { label: "Cancelled", icon: <XCircle className="h-5 w-5" />, color: "text-red-600" },
};

interface OrderItem {
  productNameSnapshot: string;
  skuSnapshot: string;
  quantity: number;
  priceSnapshot: number | null;
}

interface OrderResult {
  inquiryReference: string;
  status: string;
  customerName: string;
  deliveryMethod: string;
  deliveryLocation: string;
  totalEstimate: number | null;
  subtotalAmount: number | null;
  discountAmount: number | null;
  couponCode: string | null;
  createdAt: string;
  items: OrderItem[];
}

export default function TrackPage() {
  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/v1/track?reference=${encodeURIComponent(reference)}&phone=${encodeURIComponent(phone)}`
      );
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Order not found. Check your reference number and phone.");
      } else {
        setOrder(await res.json());
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const statusInfo = order ? STATUS_MAP[order.status] ?? { label: order.status, icon: <Clock className="h-5 w-5" />, color: "text-gray-600" } : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-gray-400">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-black font-bold">Track Order</span>
          </nav>
        </div>
      </div>

      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-10 bg-green-600" />
          <span className="text-[11px] font-bold tracking-[0.3em] text-green-700 uppercase">Order status</span>
        </div>
        <h1 className="text-4xl font-bold text-black tracking-tighter mb-2">Track your order.</h1>
        <p className="text-gray-500 mb-10">Enter your inquiry reference number and the phone number you used when placing the order.</p>

        <form onSubmit={handleSearch} className="border border-gray-200 p-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="reference">Inquiry Reference</Label>
            <Input
              id="reference"
              placeholder="e.g. INQ-20260407-12345"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="e.g. 0755888945"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-black text-white hover:bg-gray-900 font-bold">
            {loading ? "Searching..." : (
              <span className="flex items-center gap-2 justify-center"><Search className="h-4 w-4" /> Track Order</span>
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-6 p-4 border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>
        )}

        {order && statusInfo && (
          <div className="mt-8 border border-gray-200">
            {/* Header */}
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-1">Reference</p>
                <p className="font-bold text-black">{order.inquiryReference}</p>
              </div>
              <div className={`flex items-center gap-2 font-bold ${statusInfo.color}`}>
                {statusInfo.icon}
                {statusInfo.label}
              </div>
            </div>

            {/* Details */}
            <div className="p-6 grid grid-cols-2 gap-4 text-sm border-b border-gray-200">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Customer</p>
                <p className="font-medium text-black">{order.customerName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Date</p>
                <p className="font-medium text-black">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Delivery</p>
                <p className="font-medium text-black capitalize">{order.deliveryMethod.replace(/_/g, " ")}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Location</p>
                <p className="font-medium text-black">{order.deliveryLocation}</p>
              </div>
            </div>

            {/* Items */}
            <div className="p-6 border-b border-gray-200">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Items</p>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-black">{item.productNameSnapshot}</p>
                      <p className="text-gray-400 font-mono text-xs">{item.skuSnapshot}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">×{item.quantity}</p>
                      {item.priceSnapshot && (
                        <p className="text-black font-bold">{formatPrice(item.priceSnapshot * item.quantity)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="p-6 text-sm space-y-2">
              {order.subtotalAmount != null && (
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotalAmount)}</span>
                </div>
              )}
              {order.couponCode && order.discountAmount != null && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({order.couponCode})</span>
                  <span>−{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              {order.totalEstimate != null && (
                <div className="flex justify-between font-bold text-black text-base border-t border-gray-200 pt-2 mt-2">
                  <span>Total Estimate</span>
                  <span>{formatPrice(order.totalEstimate)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
