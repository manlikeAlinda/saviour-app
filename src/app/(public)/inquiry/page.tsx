"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageCircle, AlertCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { PriceDisplay } from "@/components/catalog/PriceDisplay";

const schema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  customer_phone: z.string().min(7, "Please enter a valid phone number"),
  customer_email: z.string().email("Invalid email address").optional().or(z.literal("")),
  delivery_location: z.string().min(2, "Please enter your delivery location"),
  delivery_method: z.enum(["pickup", "courier", "boda_delivery", "third_party_logistics", "discuss_on_whatsapp"]),
  inquiry_notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function InquiryPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const deliveryMethod = watch("delivery_method");

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingCart className="h-16 w-16 mx-auto text-gray-200 mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add some products to your cart before submitting an inquiry.</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  const subtotal = items.reduce((sum, i) => {
    if (i.price && i.priceVisibilityMode === "show_exact_price") return sum + i.price * i.quantity;
    return sum;
  }, 0);

  const hasAnyPrice = items.some((i) => i.price && i.priceVisibilityMode === "show_exact_price");

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/v1/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({
            product_id: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.error?.message || "Failed to submit inquiry. Please try again.");
        return;
      }

      // Clear cart
      clearCart();

      // Store reference in sessionStorage for success page
      sessionStorage.setItem("lastInquiryRef", result.data.inquiry_reference);
      sessionStorage.setItem("lastWhatsappUrl", result.data.whatsapp_url);

      // Redirect to success page
      router.push(`/inquiry/success?ref=${result.data.inquiry_reference}`);

      // Open WhatsApp in new tab after a brief delay
      setTimeout(() => {
        window.open(result.data.whatsapp_url, "_blank");
      }, 500);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Submit Inquiry</h1>
        <p className="text-gray-500 mt-1">
          Fill in your details and we&apos;ll confirm your order through WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-3 space-y-5"
        >
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
            <h2 className="font-bold text-gray-900">Your Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="customer_name">Full Name *</Label>
                <Input
                  id="customer_name"
                  placeholder="John Doe"
                  {...register("customer_name")}
                  className={errors.customer_name ? "border-red-400" : ""}
                />
                {errors.customer_name && (
                  <p className="text-xs text-red-600">{errors.customer_name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="customer_phone">Phone Number *</Label>
                <Input
                  id="customer_phone"
                  placeholder="0755888945"
                  type="tel"
                  {...register("customer_phone")}
                  className={errors.customer_phone ? "border-red-400" : ""}
                />
                {errors.customer_phone && (
                  <p className="text-xs text-red-600">{errors.customer_phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="customer_email">Email Address (optional)</Label>
              <Input
                id="customer_email"
                type="email"
                placeholder="you@example.com"
                {...register("customer_email")}
                className={errors.customer_email ? "border-red-400" : ""}
              />
              {errors.customer_email && (
                <p className="text-xs text-red-600">{errors.customer_email.message}</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
            <h2 className="font-bold text-gray-900">Delivery Details</h2>

            <div className="space-y-1.5">
              <Label htmlFor="delivery_location">Delivery Location *</Label>
              <Input
                id="delivery_location"
                placeholder="e.g. Kampala, Nakawa"
                {...register("delivery_location")}
                className={errors.delivery_location ? "border-red-400" : ""}
              />
              {errors.delivery_location && (
                <p className="text-xs text-red-600">{errors.delivery_location.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Delivery Method *</Label>
              <Select
                value={deliveryMethod}
                onValueChange={(v) => setValue("delivery_method", v as FormData["delivery_method"], { shouldValidate: true })}
              >
                <SelectTrigger className={errors.delivery_method ? "border-red-400" : ""}>
                  <SelectValue placeholder="Select delivery method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Pickup from Store</SelectItem>
                  <SelectItem value="courier">Courier Delivery</SelectItem>
                  <SelectItem value="boda_delivery">Boda Delivery</SelectItem>
                  <SelectItem value="third_party_logistics">Third-Party Logistics</SelectItem>
                  <SelectItem value="discuss_on_whatsapp">Discuss on WhatsApp</SelectItem>
                </SelectContent>
              </Select>
              {errors.delivery_method && (
                <p className="text-xs text-red-600">{errors.delivery_method.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inquiry_notes">Additional Notes (optional)</Label>
              <Textarea
                id="inquiry_notes"
                placeholder="e.g. Please confirm availability before delivery. I need these urgently."
                rows={3}
                {...register("inquiry_notes")}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <AlertCircle className="inline h-4 w-4 mr-1" />
            By submitting, your inquiry will be saved and you&apos;ll be redirected to WhatsApp to send your order request to our team.
          </div>

          <Button
            type="submit"
            size="lg"
            variant="whatsapp"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? (
              "Submitting..."
            ) : (
              <>
                <MessageCircle className="h-5 w-5" />
                Submit &amp; Continue to WhatsApp
              </>
            )}
          </Button>
        </form>

        {/* Cart Summary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 sticky top-24">
            <h2 className="font-bold text-gray-900">Order Summary</h2>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex items-start gap-3">
                  <div className="text-xs bg-green-600 text-white rounded-full h-5 w-5 flex items-center justify-center font-medium shrink-0 mt-0.5">
                    {item.quantity}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{item.sku}</p>
                  </div>
                  <PriceDisplay
                    price={item.price ? item.price * item.quantity : null}
                    priceVisibilityMode={item.priceVisibilityMode}
                    className="text-xs shrink-0"
                  />
                </div>
              ))}
            </div>

            {hasAnyPrice && (
              <div className="border-t border-gray-100 pt-3 flex justify-between text-sm">
                <span className="text-gray-500">Subtotal estimate</span>
                <span className="font-bold text-green-700">{formatPrice(subtotal)}</span>
              </div>
            )}

            <p className="text-xs text-gray-400 border-t border-gray-100 pt-3">
              Delivery fee and final total confirmed via WhatsApp.
            </p>

            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/cart">Edit Cart</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
