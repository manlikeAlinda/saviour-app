"use client";

import { useState, useEffect } from "react";
import { Plus, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  _count: { products: number };
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchBrands = async () => {
    setLoading(true);
    const res = await fetch("/api/v1/admin/brands");
    const data = await res.json();
    if (data.success) setBrands(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/v1/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error?.message || "Failed to create brand"); return; }
      setName(""); setDescription(""); setShowForm(false);
      fetchBrands();
    } catch { setError("Network error"); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="text-gray-500 text-sm mt-1">{brands.length} brands</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          Add Brand
        </Button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 mb-4">New Brand</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Brand Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Arduino" required />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Brief brand description" />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create Brand"}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Brand</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Products</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : brands.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">No brands found</td></tr>
            ) : (
              brands.map((brand) => (
                <tr key={brand.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium text-gray-900">{brand.name}</div>
                        {brand.description && <div className="text-xs text-gray-400">{brand.description}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs hidden sm:table-cell">{brand.slug}</td>
                  <td className="px-4 py-3 text-gray-700">{brand._count.products}</td>
                  <td className="px-4 py-3">
                    <Badge variant={brand.isActive ? "success" : "secondary"}>
                      {brand.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
