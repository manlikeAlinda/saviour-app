"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Review {
  id: number;
  rating: number;
  title: string | null;
  comment: string;
  createdAt: string;
  customer: { fullName: string };
}

function StarRating({ value, onChange, readOnly }: { value: number; onChange?: (v: number) => void; readOnly?: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={`${readOnly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"}`}
        >
          <Star
            className={`h-5 w-5 ${star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ productSlug }: { productSlug: string }) {
  const { data: session } = useSession();
  const isCustomer = (session?.user as { role?: string })?.role === "customer";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ rating: 0, title: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/products/${productSlug}/reviews`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews ?? []);
        setAvgRating(data.avgRating);
      })
      .finally(() => setLoading(false));
  }, [productSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.rating === 0) { setSubmitError("Please select a rating."); return; }
    setSubmitting(true);
    setSubmitError("");
    const res = await fetch(`/api/v1/products/${productSlug}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSubmitSuccess(true);
      setForm({ rating: 0, title: "", comment: "" });
    } else {
      const data = await res.json();
      setSubmitError(data.error ?? "Failed to submit review.");
    }
    setSubmitting(false);
  }

  return (
    <div className="mt-24 border-t border-gray-100 pt-16">
      <div className="flex items-center gap-4 mb-10">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-600" />
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-black">Customer Reviews</h2>
        </div>
        {avgRating !== null && (
          <div className="flex items-center gap-2 ml-4">
            <StarRating value={Math.round(avgRating)} readOnly />
            <span className="text-sm font-bold text-black">{avgRating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Reviews List */}
        <div className="lg:col-span-7 space-y-6">
          {loading && <p className="text-gray-400 text-sm">Loading reviews...</p>}
          {!loading && reviews.length === 0 && (
            <p className="text-gray-400 text-sm italic">No reviews yet. Be the first to review this product.</p>
          )}
          {reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <StarRating value={review.rating} readOnly />
                <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              {review.title && <p className="font-bold text-sm text-black mb-1">{review.title}</p>}
              <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-3 font-mono">— {review.customer.fullName}</p>
            </div>
          ))}
        </div>

        {/* Write a Review */}
        <div className="lg:col-span-5">
          <div className="border border-gray-200 p-6">
            <h3 className="font-bold text-black mb-4 text-sm uppercase tracking-wider">Write a Review</h3>

            {!session && (
              <p className="text-sm text-gray-500">
                <Link href="/account/login" className="text-green-700 font-bold hover:underline">Sign in</Link> to leave a review.
              </p>
            )}

            {session && !isCustomer && (
              <p className="text-sm text-gray-500">Reviews can only be submitted by customers.</p>
            )}

            {submitSuccess && (
              <div className="bg-green-50 border border-green-200 p-4 text-sm text-green-700">
                Thank you! Your review has been submitted and will appear after approval.
              </div>
            )}

            {isCustomer && !submitSuccess && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Your Rating *</Label>
                  <StarRating value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rtitle">Title (optional)</Label>
                  <Input id="rtitle" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Great product!" maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rcomment">Review *</Label>
                  <textarea
                    id="rcomment"
                    required
                    minLength={10}
                    maxLength={1000}
                    rows={4}
                    value={form.comment}
                    onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                    placeholder="Share your experience with this product..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-green-600 resize-none"
                  />
                </div>
                {submitError && <p className="text-xs text-red-500">{submitError}</p>}
                <Button type="submit" disabled={submitting} className="w-full bg-black text-white hover:bg-gray-900 font-bold">
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
