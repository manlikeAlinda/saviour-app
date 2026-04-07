"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Coupon {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number | null;
  maxUsage: number | null;
  usageCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

const empty = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minOrderAmount: "",
  maxUsage: "",
  expiresAt: "",
  isActive: true,
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchCoupons() {
    setLoading(true);
    const res = await fetch("/api/v1/admin/coupons");
    setCoupons(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchCoupons(); }, []);

  function update(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function startEdit(coupon: Coupon) {
    setEditId(coupon.id);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minOrderAmount: coupon.minOrderAmount != null ? String(coupon.minOrderAmount) : "",
      maxUsage: coupon.maxUsage != null ? String(coupon.maxUsage) : "",
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
      isActive: coupon.isActive,
    });
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditId(null);
    setForm(empty);
    setError("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      code: form.code.toUpperCase(),
      discountType: form.discountType,
      discountValue: parseFloat(form.discountValue),
      minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : null,
      maxUsage: form.maxUsage ? parseInt(form.maxUsage) : null,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      isActive: form.isActive,
    };

    const res = await fetch("/api/v1/admin/coupons", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editId ? { id: editId, ...payload } : payload),
    });

    if (res.ok) {
      cancelForm();
      fetchCoupons();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to save coupon.");
    }
    setSaving(false);
  }

  async function deleteCoupon(id: number) {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/v1/admin/coupons?id=${id}`, { method: "DELETE" });
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }

  async function toggleActive(coupon: Coupon) {
    await fetch("/api/v1/admin/coupons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: coupon.id, isActive: !coupon.isActive }),
    });
    fetchCoupons();
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(empty); }}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-bold hover:bg-gray-900 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Coupon
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSave} className="border border-gray-200 p-6 mb-8 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-black">{editId ? "Edit Coupon" : "New Coupon"}</h2>
            <button type="button" onClick={cancelForm} className="text-gray-400 hover:text-black"><X className="h-4 w-4" /></button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Code *</Label>
              <Input value={form.code} onChange={(e) => update("code", e.target.value.toUpperCase())} required placeholder="SAVE10" className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label>Discount Type *</Label>
              <select
                value={form.discountType}
                onChange={(e) => update("discountType", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-green-600"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (UGX)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Discount Value *</Label>
              <Input type="number" value={form.discountValue} onChange={(e) => update("discountValue", e.target.value)} required min="0" placeholder={form.discountType === "percentage" ? "10" : "5000"} />
            </div>
            <div className="space-y-2">
              <Label>Min Order Amount (UGX)</Label>
              <Input type="number" value={form.minOrderAmount} onChange={(e) => update("minOrderAmount", e.target.value)} placeholder="Optional" min="0" />
            </div>
            <div className="space-y-2">
              <Label>Max Usage</Label>
              <Input type="number" value={form.maxUsage} onChange={(e) => update("maxUsage", e.target.value)} placeholder="Unlimited" min="1" />
            </div>
            <div className="space-y-2">
              <Label>Expires At</Label>
              <Input type="date" value={form.expiresAt} onChange={(e) => update("expiresAt", e.target.value)} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => update("isActive", e.target.checked)} className="rounded" />
            Active
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-black text-white font-bold text-sm hover:bg-gray-900 transition-colors disabled:opacity-50">
              {saving ? "Saving..." : editId ? "Update" : "Create"}
            </button>
            <button type="button" onClick={cancelForm} className="px-6 py-2 border border-gray-200 text-gray-600 text-sm font-bold hover:border-black transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black text-green-400 text-xs font-mono uppercase tracking-widest">
              <tr>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Discount</th>
                <th className="px-4 py-3 text-left">Min Order</th>
                <th className="px-4 py-3 text-left">Usage</th>
                <th className="px-4 py-3 text-left">Expires</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No coupons yet.</td></tr>
              )}
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-bold text-black">{coupon.code}</td>
                  <td className="px-4 py-3">
                    {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `UGX ${coupon.discountValue.toLocaleString()}`}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{coupon.minOrderAmount ? `UGX ${coupon.minOrderAmount.toLocaleString()}` : "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{coupon.usageCount}{coupon.maxUsage ? ` / ${coupon.maxUsage}` : ""}</td>
                  <td className="px-4 py-3 text-gray-500">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Never"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(coupon)} className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-sm ${coupon.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {coupon.isActive ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {coupon.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(coupon)} className="text-gray-400 hover:text-black transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteCoupon(coupon.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
