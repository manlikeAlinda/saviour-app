"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Inquiry {
  id: number;
  inquiryReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryLocation: string;
  deliveryMethod: string;
  status: string;
  createdAt: string;
  _count?: { items: number };
  items?: { id: number }[];
}

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

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  awaiting_customer: "Awaiting Customer",
  confirmed: "Confirmed",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (q) params.set("q", q);
      if (status) params.set("status", status);
      const res = await fetch(`/api/v1/admin/inquiries?${params}`);
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
        setMeta(data.meta);
      }
    } finally {
      setLoading(false);
    }
  }, [q, status, page]);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-500 text-sm mt-1">{meta.total} total inquiries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, phone, reference..."
            className="pl-10"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={status || "all"} onValueChange={(v) => { setStatus(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(statusLabels).map(([val, label]) => (
              <SelectItem key={val} value={val}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Reference</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Location</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td colSpan={6} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">No inquiries found</td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/inquiries/${inq.id}`} className="text-green-600 hover:underline font-mono text-xs">
                        {inq.inquiryReference}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{inq.customerName}</div>
                      <div className="text-xs text-gray-400">{inq.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{inq.deliveryLocation}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusColors[inq.status] || "secondary"}>
                        {statusLabels[inq.status] || inq.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/inquiries/${inq.id}`}
                        className="text-xs text-green-600 hover:underline font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span className="px-3 py-1.5 text-sm text-gray-500">
            {page} / {meta.totalPages}
          </span>
          <button
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
            disabled={page >= meta.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
