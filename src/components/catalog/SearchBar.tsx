"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchResult {
  id: number;
  name: string;
  slug: string;
  sku: string;
  imageUrl: string | null;
  category: { name: string; slug: string };
}

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/products?q=${encodeURIComponent(q)}&limit=6`);
      const data = await res.json();
      setResults(data.data ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && results[activeIndex]) {
        router.push(`/product/${results[activeIndex].slug}`);
        setOpen(false);
        setQuery("");
      } else if (query.trim()) {
        router.push(`/products?q=${encodeURIComponent(query.trim())}`);
        setOpen(false);
        setQuery("");
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function handleSelect(slug: string) {
    router.push(`/product/${slug}`);
    setOpen(false);
    setQuery("");
    setResults([]);
  }

  // Group by category
  const grouped: Record<string, SearchResult[]> = {};
  for (const r of results) {
    const cat = r.category.name;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(r);
  }

  return (
    <div ref={containerRef} className="relative">
      {!open ? (
        <button
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
          className="hidden sm:flex p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all"
          aria-label="Open search"
        >
          <Search className="h-5 w-5" />
        </button>
      ) : (
        <div className="hidden sm:flex items-center border border-gray-300 bg-white rounded-md overflow-hidden w-72 focus-within:border-green-600 transition-colors">
          <Search className="h-4 w-4 text-gray-400 ml-3 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1); }}
            onKeyDown={handleKeyDown}
            placeholder="Search products, SKUs..."
            className="flex-1 px-3 py-2 text-sm outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-2 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          )}
          <button onClick={() => { setOpen(false); setQuery(""); setResults([]); }} className="p-2 text-gray-400 hover:text-gray-600 border-l border-gray-200">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {open && query.length >= 2 && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 shadow-xl z-50 max-h-96 overflow-y-auto">
          {loading && (
            <div className="px-4 py-3 text-sm text-gray-400 font-mono">Searching...</div>
          )}

          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              No products found for &ldquo;{query}&rdquo;
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{category}</span>
                  </div>
                  {items.map((item) => {
                    const flatIndex = results.indexOf(item);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.slug)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-green-50 transition-colors border-b border-gray-50 last:border-0 ${
                          flatIndex === activeIndex ? "bg-green-50" : ""
                        }`}
                      >
                        <div className="h-10 w-10 bg-gray-100 shrink-0 flex items-center justify-center">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <Search className="h-4 w-4 text-gray-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-black truncate">{item.name}</p>
                          <p className="text-xs text-gray-400 font-mono">{item.sku}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}

              <button
                onClick={() => { router.push(`/products?q=${encodeURIComponent(query)}`); setOpen(false); setQuery(""); }}
                className="w-full px-4 py-3 text-sm text-green-700 font-bold hover:bg-green-50 border-t border-gray-200 text-center"
              >
                View all results for &ldquo;{query}&rdquo;
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
