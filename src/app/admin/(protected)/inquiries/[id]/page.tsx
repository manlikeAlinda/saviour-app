"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InquiryItem {
  id: number;
  productNameSnapshot: string;
  skuSnapshot: string;
  priceSnapshot: number | null;
  quantity: number;
  stockStatusSnapshot: string | null;
  note: string | null;
}

interface Inquiry {
  id: number;
  inquiryReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryLocation: string;
  deliveryMethod: string;
  inquiryNotes: string | null;
  whatsappMessageSnapshot: string;
  subtotalAmount: number | null;
  status: string;
  sourceChannel: string;
  createdAt: string;
  items: InquiryItem[];
}

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "awaiting_customer", label: "Awaiting Customer" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const statusColors: Record<string, "default" | "warning" | "success" | "info" | "secondary" | "destructive"> = {
  new: "warning",
  contacted: "info",
  quoted: "info",
  awaiting_customer: "secondary",
  confirmed: "success",
  shipped: "success",
  completed: "default",
  cancelled: "destructive",
};

const deliveryMethodLabels: Record<string, string> = {
  pickup: "Pickup from Store",
  courier: "Courier Delivery",
  boda_delivery: "Boda Delivery",
  third_party_logistics: "Third-Party Logistics",
  discuss_on_whatsapp: "Discuss on WhatsApp",
};

export default function InquiryDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/admin/inquiries/${id}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setInquiry(d.data); })
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    if (!inquiry) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/v1/admin/inquiries/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiry({ ...inquiry, status: newStatus });
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading inquiry...</div>;
  }

  if (!inquiry) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Inquiry not found</p>
        <Link href="/admin/inquiries" className="text-green-600 hover:underline text-sm mt-2 block">
          Back to inquiries
        </Link>
      </div>
    );
  }

  const waUrl = `https://wa.me/${inquiry.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${inquiry.customerName}, regarding your inquiry ${inquiry.inquiryReference}:`)}`;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/admin/inquiries" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Inquiries
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-mono">{inquiry.inquiryReference}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Created on {new Date(inquiry.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Badge variant={statusColors[inquiry.status] || "secondary"} className="text-sm">
            {statusOptions.find((s) => s.value === inquiry.status)?.label || inquiry.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Customer + Items */}
        <div className="lg:col-span-2 space-y-5">
          {/* Customer Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Full Name</div>
                <div className="font-medium text-gray-900">{inquiry.customerName}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Phone</div>
                <div className="font-medium text-gray-900">{inquiry.customerPhone}</div>
              </div>
              {inquiry.customerEmail && (
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Email</div>
                  <div className="font-medium text-gray-900">{inquiry.customerEmail}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Delivery Location</div>
                <div className="font-medium text-gray-900">{inquiry.deliveryLocation}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Delivery Method</div>
                <div className="font-medium text-gray-900">{deliveryMethodLabels[inquiry.deliveryMethod] || inquiry.deliveryMethod}</div>
              </div>
              {inquiry.inquiryNotes && (
                <div className="col-span-2">
                  <div className="text-xs text-gray-400 mb-0.5">Notes</div>
                  <div className="text-gray-700 text-sm">{inquiry.inquiryNotes}</div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <Button variant="whatsapp" size="sm" asChild>
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Follow Up on WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-gray-900 mb-4">
              Requested Items ({inquiry.items.length})
            </h2>
            <div className="space-y-3">
              {inquiry.items.map((item, i) => (
                <div key={item.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="h-7 w-7 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm">{item.productNameSnapshot}</div>
                    <div className="text-xs text-gray-400 font-mono">SKU: {item.skuSnapshot}</div>
                    {item.note && <div className="text-xs text-gray-500 mt-1">Note: {item.note}</div>}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-medium text-gray-900">Qty: {item.quantity}</div>
                    {item.priceSnapshot ? (
                      <div className="text-xs text-green-700">
                        UGX {(item.priceSnapshot * item.quantity).toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">Price on request</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {inquiry.subtotalAmount && (
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-sm">
                <span className="text-gray-500">Estimated Subtotal</span>
                <span className="font-bold text-green-700">UGX {inquiry.subtotalAmount.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* WhatsApp Message Snapshot */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-gray-900 mb-3">WhatsApp Message Snapshot</h2>
            <pre className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-4 whitespace-pre-wrap font-mono overflow-x-auto">
              {inquiry.whatsappMessageSnapshot}
            </pre>
          </div>
        </div>

        {/* Right: Status & Actions */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-gray-900 mb-4">Update Status</h2>
            <Select value={inquiry.status} onValueChange={updateStatus} disabled={updating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-400 mt-2">Status changes are saved immediately</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <h2 className="font-bold text-gray-900">Quick Actions</h2>
            <Button variant="whatsapp" className="w-full" size="sm" asChild>
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Open WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
