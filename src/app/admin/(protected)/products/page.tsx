"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Edit, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number | null;
  priceVisibilityMode: string;
  stockStatus: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  category: { name: string } | null;
  brand: { name: string } | null;
}

const stockStatusColors: Record<string, "success" | "warning" | "info" | "destructive" | "secondary"> = {
  in_stock: "success",
  limited_availability: "warning",
  available_on_order: "info",
  out_of_stock: "destructive",
};

const stockStatusLabels: Record<string, string> = {
  in_stock: "In Stock",
  limited_availability: "Limited",
  available_on_order: "On Order",
  out_of_stock: "Out of Stock",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (q) params.set("q", q);
      if (stockStatus) params.set("stock_status", stockStatus);
      const res = await fetch(`/api/v1/admin/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setMeta(data.meta);
      }
    } finally {
      setLoading(false);
    }
  }, [q, stockStatus, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const deactivate = async (id: number) => {
    if (!confirm("Deactivate this product? It will be hidden from the store.")) return;
    await fetch(`/api/v1/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{meta.total} total products</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or SKU..."
            className="pl-10"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={stockStatus || "all"} onValueChange={(v) => { setStockStatus(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All stock statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="in_stock">In Stock</SelectItem>
            <SelectItem value="limited_availability">Limited</SelectItem>
            <SelectItem value="available_on_order">On Order</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Stock</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Price</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
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
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">No products found</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className={`border-b border-gray-100 hover:bg-gray-50 ${!product.isActive ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-400 font-mono">{product.sku}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      {product.category?.name || "—"}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant={stockStatusColors[product.stockStatus] || "secondary"}>
                        {stockStatusLabels[product.stockStatus] || product.stockStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {product.price && product.priceVisibilityMode === "show_exact_price"
                        ? formatPrice(product.price)
                        : <span className="text-gray-400 text-xs">On request</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={product.isActive ? "success" : "secondary"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/products/${product.id}`}>
                            <Edit className="h-4 w-4 text-gray-500" />
                          </Link>
                        </Button>
                        {product.isActive && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deactivate(product.id)}
                            title="Deactivate"
                          >
                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-red-500" />
                          </Button>
                        )}
                      </div>
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
          <span className="px-3 py-1.5 text-sm text-gray-500">{page} / {meta.totalPages}</span>
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
