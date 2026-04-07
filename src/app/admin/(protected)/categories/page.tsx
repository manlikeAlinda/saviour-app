"use client";

import { useState, useEffect } from "react";
import { Plus, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch("/api/v1/admin/categories");
    const data = await res.json();
    if (data.success) setCategories(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/v1/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error?.message || "Failed to create category"); return; }
      setName(""); setDescription(""); setShowForm(false);
      fetchCategories();
    } catch { setError("Network error"); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} categories</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 mb-4">New Category</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Microcontrollers" required />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Brief description of this category" />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create Category"}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Products</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">No categories found</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Tags className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium text-gray-900">{cat.name}</div>
                        {cat.description && <div className="text-xs text-gray-400">{cat.description}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs hidden sm:table-cell">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-700">{cat._count.products}</td>
                  <td className="px-4 py-3">
                    <Badge variant={cat.isActive ? "success" : "secondary"}>
                      {cat.isActive ? "Active" : "Inactive"}
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
