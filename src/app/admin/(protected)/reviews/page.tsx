"use client";

import { useEffect, useState } from "react";
import { Star, Check, X, Trash2 } from "lucide-react";

interface Review {
  id: number;
  rating: number;
  title: string | null;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  customer: { fullName: string; email: string };
  product: { name: string; slug: string };
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-3.5 w-3.5 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");
  const [loading, setLoading] = useState(true);

  async function fetchReviews() {
    setLoading(true);
    const res = await fetch(`/api/v1/admin/reviews?status=${filter}`);
    setReviews(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchReviews(); }, [filter]);

  async function setApproval(id: number, isApproved: boolean) {
    await fetch("/api/v1/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isApproved }),
    });
    fetchReviews();
  }

  async function deleteReview(id: number) {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/v1/admin/reviews?id=${id}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Customer Reviews</h1>
        <div className="flex gap-2">
          {(["pending", "approved", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-bold capitalize border transition-colors ${filter === f ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-black"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}

      {!loading && reviews.length === 0 && (
        <p className="text-gray-400 text-center py-12">No {filter === "all" ? "" : filter} reviews found.</p>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className={`border p-5 ${review.isApproved ? "border-green-200 bg-green-50/30" : "border-gray-200"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <StarDisplay rating={review.rating} />
                  {review.isApproved && (
                    <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-sm">Approved</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  <span className="font-bold text-black">{review.customer.fullName}</span>
                  {" "}&lt;{review.customer.email}&gt; on{" "}
                  <span className="text-green-700 font-medium">{review.product.name}</span>
                  {" · "}{new Date(review.createdAt).toLocaleDateString()}
                </p>
                {review.title && <p className="font-bold text-sm text-black mb-1">{review.title}</p>}
                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!review.isApproved ? (
                  <button
                    onClick={() => setApproval(review.id, true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                ) : (
                  <button
                    onClick={() => setApproval(review.id, false)}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-600 text-xs font-bold hover:border-black transition-colors"
                  >
                    <X className="h-3.5 w-3.5" /> Unapprove
                  </button>
                )}
                <button
                  onClick={() => deleteReview(review.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
