"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  Cpu,
  LayoutGrid,
  ArrowRightLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ProductCard } from "@/components/catalog/ProductCard";
import { cn } from "@/lib/utils";

// --- Types remain the same ---
interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string | null;
  price: number | null;
  priceVisibilityMode: string;
  stockStatus: string;
  imageUrl: string | null;
  minimumOrderQuantity: number;
  isFeatured: boolean;
  category: { name: string; slug: string } | null;
}

interface Category { id: number; name: string; slug: string; }
interface Brand { id: number; name: string; slug: string; }
interface Meta { total: number; page: number; totalPages: number; }

function ProductsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const stockStatus = searchParams.get("stock_status") || "";
  const sort = searchParams.get("sort") || "createdAt_desc";
  const page = parseInt(searchParams.get("page") || "1");

  // --- Logic remains the same ---
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (category) params.set("category", category);
      if (brand) params.set("brand", brand);
      if (stockStatus) params.set("stock_status", stockStatus);
      if (sort) params.set("sort", sort);
      params.set("page", String(page));

      const res = await fetch(`/api/v1/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setMeta(data.meta);
      }
    } finally {
      setLoading(false);
    }
  }, [q, category, brand, stockStatus, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    fetch("/api/v1/categories").then((r) => r.json()).then((d) => { if (d.success) setCategories(d.data); });
    fetch("/api/v1/brands").then((r) => r.json()).then((d) => { if (d.success) setBrands(d.data); });
  }, []);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/products?${params}`);
  };

  const clearFilters = () => router.push("/products");
  const hasFilters = !!(q || category || brand || stockStatus);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-gray-400">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-black font-bold">Shop</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Command Strip */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
            </div>
            <Input
              placeholder="Search by name, SKU or part number..."
              className="pl-10 h-12 bg-white border-gray-200 rounded-none text-sm focus-visible:ring-green-600 focus-visible:border-green-600"
              defaultValue={q}
              onChange={(e) => {
                const val = e.target.value;
                const timeout = setTimeout(() => updateParam("q", val), 400);
                return () => clearTimeout(timeout);
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={filtersOpen ? "default" : "outline"}
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={cn(
                "h-12 rounded-none px-6 text-xs gap-2 transition-all",
                filtersOpen ? "bg-black border-black" : "bg-white border-gray-200"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasFilters && <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />}
            </Button>

            <div className="hidden sm:flex items-center bg-white border border-gray-200 h-12 px-4 gap-3">
              <ArrowRightLeft className="h-4 w-4 text-gray-400" />
              <Select value={sort} onValueChange={(v) => updateParam("sort", v)}>
                <SelectTrigger className="border-none shadow-none focus:ring-0 text-xs w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="createdAt_desc">Newest first</SelectItem>
                  <SelectItem value="createdAt_asc">Oldest first</SelectItem>
                  <SelectItem value="name_asc">A to Z</SelectItem>
                  <SelectItem value="price_asc">Price: low to high</SelectItem>
                  <SelectItem value="price_desc">Price: high to low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Advanced Filter Module */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-black text-gray-300 p-8 border-l-4 border-green-600 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  <div className="space-y-3">
                  <label className="text-[10px] font-bold text-green-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <LayoutGrid className="h-3 w-3" /> Category
                  </label>
                  <Select value={category || "all"} onValueChange={(v) => updateParam("category", v === "all" ? "" : v)}>
                    <SelectTrigger className="bg-neutral-900 border-neutral-700 text-white rounded-none">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-green-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Cpu className="h-3 w-3" /> Brand
                  </label>
                  <Select value={brand || "all"} onValueChange={(v) => updateParam("brand", v === "all" ? "" : v)}>
                    <SelectTrigger className="bg-neutral-900 border-neutral-700 text-white rounded-none">
                      <SelectValue placeholder="All brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All brands</SelectItem>
                      {brands.map((b) => (
                        <SelectItem key={b.id} value={b.slug}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-green-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Zap className="h-3 w-3" /> Availability
                  </label>
                  <Select value={stockStatus || "all"} onValueChange={(v) => updateParam("stock_status", v === "all" ? "" : v)}>
                    <SelectTrigger className="bg-neutral-900 border-neutral-700 text-white rounded-none">
                      <SelectValue placeholder="Any status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any status</SelectItem>
                      <SelectItem value="in_stock">In stock</SelectItem>
                      <SelectItem value="limited_availability">Limited stock</SelectItem>
                      <SelectItem value="available_on_order">Available on order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {hasFilters && (
                  <div className="md:col-span-3 flex justify-end border-t border-neutral-800 pt-6">
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-white text-xs">
                      <X className="h-3 w-3 mr-2" /> Clear all filters
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Manifest */}
        <div className="space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white h-96 relative overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 bg-linear-to-r from-transparent via-gray-50 to-transparent"
                  />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32 bg-white border border-dashed border-gray-300">
              <Search className="h-16 w-16 mx-auto mb-6 text-gray-200" />
              <h3 className="text-xl font-bold text-black">No products found</h3>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters.</p>
              {hasFilters && (
                <Button variant="outline" className="mt-8 text-xs rounded-none" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          )}

          {/* Pagination Command */}
          {meta.totalPages > 1 && !loading && (
            <div className="flex flex-col items-center gap-6 mt-20 pt-10 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="rounded-none text-xs border-gray-200"
                  disabled={page <= 1}
                  onClick={() => updateParam("page", String(page - 1))}
                >
                  Previous
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "ghost"}
                      className={cn(
                        "h-10 w-10 p-0 rounded-none font-mono text-xs",
                        p === page ? "bg-black text-green-500" : "text-gray-400"
                      )}
                      onClick={() => updateParam("page", String(p))}
                    >
                      {p.toString().padStart(2, '0')}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="rounded-none text-xs border-gray-200"
                  disabled={page >= meta.totalPages}
                  onClick={() => updateParam("page", String(page + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-sm text-gray-400">
        Loading...
      </div>
    }>
      <ProductsPageInner />
    </Suspense>
  );
}