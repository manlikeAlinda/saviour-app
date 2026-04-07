"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingCart, ArrowRight, AlertCircle, ChevronRight, FileDown, Tag, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { PriceDisplay } from "@/components/catalog/PriceDisplay";
import { StockBadge } from "@/components/catalog/StockBadge";

interface AppliedCoupon {
  code: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  // RFQ modal state
  const [rfqOpen, setRfqOpen] = useState(false);
  const [rfqData, setRfqData] = useState({ companyName: "", timeline: "", requirements: "" });
  const [rfqSubmitting, setRfqSubmitting] = useState(false);
  const [rfqSuccess, setRfqSuccess] = useState(false);

  // PDF download
  const [pdfLoading, setPdfLoading] = useState(false);

  const hasAllPrices = items.every(
    (i) => i.price !== null && i.priceVisibilityMode === "show_exact_price"
  );
  const hasAnyPrice = items.some(
    (i) => i.price !== null && i.priceVisibilityMode === "show_exact_price"
  );

  const rawSubtotal = subtotal();
  const discount = appliedCoupon?.discountAmount ?? 0;
  const finalSubtotal = Math.max(0, rawSubtotal - discount);

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCouponError("");
    setCouponLoading(true);
    try {
      const res = await fetch("/api/v1/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), orderAmount: rawSubtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error ?? "Invalid coupon");
      } else {
        setAppliedCoupon(data);
        setCouponInput("");
      }
    } catch {
      setCouponError("Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  }

  async function handleDownloadPdf() {
    setPdfLoading(true);
    try {
      const { generateCartPdf } = await import("@/lib/pdf");
      await generateCartPdf(items, process.env.NEXT_PUBLIC_SELLER_NAME ?? "Saviour Mechatronics");
    } finally {
      setPdfLoading(false);
    }
  }

  async function handleRfqSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRfqSubmitting(true);
    try {
      const res = await fetch("/api/v1/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: rfqData.companyName || "RFQ Submission",
          customerPhone: "0000000000",
          customerEmail: "",
          deliveryLocation: "To be confirmed",
          deliveryMethod: "to_be_confirmed",
          inquiryNotes: `Company: ${rfqData.companyName}\nTimeline: ${rfqData.timeline}\nRequirements: ${rfqData.requirements}`,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            note: "",
          })),
          sourceChannel: "rfq_form",
          couponCode: appliedCoupon?.code,
        }),
      });
      if (res.ok) setRfqSuccess(true);
    } catch {
      // silently fail — user can try again
    } finally {
      setRfqSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <ShoppingCart className="h-16 w-16 mx-auto text-gray-200 mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Browse our catalog and add some components to your cart.</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-gray-400">
            <Link href="/" className="hover:text-green-600 transition-colors">Root</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-green-600 transition-colors">Inventory</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-black font-bold">Cart</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black border border-gray-200 hover:border-black px-3 py-1.5 font-mono transition-colors disabled:opacity-50"
          >
            <FileDown className="h-4 w-4" />
            {pdfLoading ? "Generating..." : "Download PDF"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4"
              >
                <Link href={`/product/${item.sku.toLowerCase().replace(/[^a-z0-9]/g, "-")}`} className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-2" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <ShoppingCart className="h-8 w-8" />
                    </div>
                  )}
                </Link>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug">{item.name}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">SKU: {item.sku}</p>
                  <div className="mt-1.5">
                    <StockBadge status={item.stockStatus} />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      className="px-2 py-1 text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-40"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= item.minOrderQuantity}
                    >−</button>
                    <span className="px-3 py-1 text-sm font-medium min-w-9 text-center">{item.quantity}</span>
                    <button
                      className="px-2 py-1 text-gray-600 hover:bg-gray-50 text-sm"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >+</button>
                  </div>
                  <PriceDisplay
                    price={item.price ? item.price * item.quantity : null}
                    priceVisibilityMode={item.priceVisibilityMode}
                    className="text-sm"
                  />
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              <h2 className="font-bold text-gray-900">Order Summary</h2>

              {/* Coupon */}
              {hasAnyPrice && !appliedCoupon && (
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 flex items-center gap-1">
                    <Tag className="h-3 w-3" /> Coupon Code
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="SAVE10"
                      className="text-xs font-mono"
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-3 py-1 text-xs font-bold bg-black text-white hover:bg-gray-900 transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                </div>
              )}

              {appliedCoupon && (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs">
                  <span className="text-green-700 font-bold font-mono">{appliedCoupon.code}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-700">−{formatPrice(appliedCoupon.discountAmount)}</span>
                    <button onClick={() => setAppliedCoupon(null)} className="text-green-400 hover:text-red-500">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Items</span>
                  <span className="font-medium">{items.reduce((s, i) => s + i.quantity, 0)}</span>
                </div>
                {hasAnyPrice && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold text-green-700">{formatPrice(rawSubtotal)}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between font-bold border-t border-gray-100 pt-2">
                    <span>After Discount</span>
                    <span className="text-green-700">{formatPrice(finalSubtotal)}</span>
                  </div>
                )}
                {!hasAllPrices && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Some items</span>
                    <span className="text-amber-600 text-xs">Price on request</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-100 pt-2">
                  <span className="text-gray-500">Delivery fee</span>
                  <span className="text-gray-400 text-xs">Confirmed via WhatsApp</span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
                <AlertCircle className="h-4 w-4 inline mr-1 text-green-600" />
                Final pricing and delivery cost will be confirmed through WhatsApp.
              </div>

              <Button size="lg" className="w-full" asChild>
                <Link href={`/inquiry${appliedCoupon ? `?coupon=${appliedCoupon.code}` : ""}`}>
                  Proceed to Inquiry
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <button
                onClick={() => setRfqOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold border border-gray-300 hover:border-black text-gray-600 hover:text-black transition-colors"
              >
                <FileText className="h-4 w-4" />
                Request Formal Quote (RFQ)
              </button>
            </div>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* RFQ Modal */}
      {rfqOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white w-full max-w-md border border-gray-200 shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="font-bold text-black">Request Formal Quote</h2>
              <button onClick={() => { setRfqOpen(false); setRfqSuccess(false); }} className="text-gray-400 hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>

            {rfqSuccess ? (
              <div className="p-8 text-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-bold text-black mb-2">RFQ Submitted!</h3>
                <p className="text-sm text-gray-500">We&apos;ll review your requirements and get back to you via WhatsApp or email within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleRfqSubmit} className="p-5 space-y-4">
                <p className="text-xs text-gray-500">
                  Your current cart items ({items.length} product{items.length !== 1 ? "s" : ""}) will be included in the quote request.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="company">Company / Organisation Name</Label>
                  <Input
                    id="company"
                    required
                    value={rfqData.companyName}
                    onChange={(e) => setRfqData((d) => ({ ...d, companyName: e.target.value }))}
                    placeholder="e.g. Kampala Technical Institute"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Required Timeline</Label>
                  <Input
                    id="timeline"
                    value={rfqData.timeline}
                    onChange={(e) => setRfqData((d) => ({ ...d, timeline: e.target.value }))}
                    placeholder="e.g. Within 2 weeks"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Special Requirements / Notes</Label>
                  <textarea
                    id="requirements"
                    rows={3}
                    value={rfqData.requirements}
                    onChange={(e) => setRfqData((d) => ({ ...d, requirements: e.target.value }))}
                    placeholder="Bulk pricing, custom specs, delivery address..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-green-600 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={rfqSubmitting}
                  className="w-full py-3 bg-black text-white font-bold text-sm hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {rfqSubmitting ? "Submitting..." : "Submit RFQ"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
