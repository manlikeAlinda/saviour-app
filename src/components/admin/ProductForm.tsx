"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().optional(),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  technicalSummary: z.string().optional(),
  price: z.string().optional(),
  priceVisibilityMode: z.enum(["show_exact_price", "show_starting_from", "hide_price_request_quote"]),
  stockStatus: z.enum(["in_stock", "limited_availability", "available_on_order", "out_of_stock"]),
  stockQuantity: z.string().optional(),
  minimumOrderQuantity: z.string().default("1"),
  unitOfMeasure: z.string().default("pcs"),
  imageUrl: z.string().optional(),
  datasheetUrl: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  specifications: z.array(z.object({
    specName: z.string().min(1),
    specValue: z.string().min(1),
    specUnit: z.string().optional(),
    sortOrder: z.number().default(0),
  })).default([]),
});

type FormData = z.infer<typeof schema>;

interface Category { id: number; name: string }
interface Brand { id: number; name: string }

interface ProductFormProps {
  product?: {
    id: number;
    name: string;
    sku: string;
    categoryId: number;
    brandId: number | null;
    shortDescription: string | null;
    fullDescription: string | null;
    technicalSummary: string | null;
    price: number | null;
    priceVisibilityMode: string;
    stockStatus: string;
    stockQuantity: number | null;
    minimumOrderQuantity: number;
    unitOfMeasure: string;
    imageUrl: string | null;
    datasheetUrl: string | null;
    isFeatured: boolean;
    isActive: boolean;
    metaTitle: string | null;
    metaDescription: string | null;
    specifications: { specName: string; specValue: string; specUnit: string | null; sortOrder: number }[];
  };
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          name: product.name,
          sku: product.sku,
          categoryId: String(product.categoryId),
          brandId: product.brandId ? String(product.brandId) : "",
          shortDescription: product.shortDescription || "",
          fullDescription: product.fullDescription || "",
          technicalSummary: product.technicalSummary || "",
          price: product.price ? String(product.price) : "",
          priceVisibilityMode: product.priceVisibilityMode as FormData["priceVisibilityMode"],
          stockStatus: product.stockStatus as FormData["stockStatus"],
          stockQuantity: product.stockQuantity ? String(product.stockQuantity) : "",
          minimumOrderQuantity: String(product.minimumOrderQuantity),
          unitOfMeasure: product.unitOfMeasure,
          imageUrl: product.imageUrl || "",
          datasheetUrl: product.datasheetUrl || "",
          isFeatured: product.isFeatured,
          isActive: product.isActive,
          metaTitle: product.metaTitle || "",
          metaDescription: product.metaDescription || "",
          specifications: product.specifications.map((s) => ({
            specName: s.specName,
            specValue: s.specValue,
            specUnit: s.specUnit || "",
            sortOrder: s.sortOrder,
          })),
        }
      : {
          priceVisibilityMode: "show_exact_price",
          stockStatus: "in_stock",
          minimumOrderQuantity: "1",
          unitOfMeasure: "pcs",
          isFeatured: false,
          isActive: true,
          specifications: [],
        },
  });

  const { fields: specFields, append: addSpec, remove: removeSpec } = useFieldArray({
    control,
    name: "specifications",
  });

  useEffect(() => {
    fetch("/api/v1/admin/categories").then((r) => r.json()).then((d) => { if (d.success) setCategories(d.data); });
    fetch("/api/v1/admin/brands").then((r) => r.json()).then((d) => { if (d.success) setBrands(d.data); });
  }, []);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...data,
        categoryId: parseInt(data.categoryId),
        brandId: data.brandId ? parseInt(data.brandId) : null,
        price: data.price ? parseFloat(data.price) : null,
        stockQuantity: data.stockQuantity ? parseInt(data.stockQuantity) : null,
        minimumOrderQuantity: parseInt(data.minimumOrderQuantity),
      };

      const url = product ? `/api/v1/admin/products/${product.id}` : "/api/v1/admin/products";
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!result.success) {
        setError(result.error?.message || "Failed to save product");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-bold text-gray-900">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Product Name *</Label>
            <Input {...register("name")} placeholder="e.g. Arduino Uno R3" />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>SKU *</Label>
            <Input {...register("sku")} placeholder="e.g. MCU-001" />
            {errors.sku && <p className="text-xs text-red-600">{errors.sku.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Category *</Label>
            <Select value={watch("categoryId")} onValueChange={(v) => setValue("categoryId", v, { shouldValidate: true })}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-xs text-red-600">{errors.categoryId.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Brand</Label>
            <Select value={watch("brandId") || "none"} onValueChange={(v) => setValue("brandId", v === "none" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="No brand" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No brand</SelectItem>
                {brands.map((b) => <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Short Description</Label>
          <Input {...register("shortDescription")} placeholder="Brief one-line description" />
        </div>
        <div className="space-y-1.5">
          <Label>Full Description</Label>
          <Textarea {...register("fullDescription")} rows={4} placeholder="Detailed product description..." />
        </div>
        <div className="space-y-1.5">
          <Label>Technical Summary</Label>
          <Input {...register("technicalSummary")} placeholder="e.g. ATmega328P @ 16MHz, 14 I/O pins" />
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-bold text-gray-900">Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Price (UGX)</Label>
            <Input {...register("price")} type="number" placeholder="e.g. 45000" />
          </div>
          <div className="space-y-1.5">
            <Label>Price Visibility</Label>
            <Select value={watch("priceVisibilityMode")} onValueChange={(v) => setValue("priceVisibilityMode", v as FormData["priceVisibilityMode"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="show_exact_price">Show Exact Price</SelectItem>
                <SelectItem value="show_starting_from">Show Starting From</SelectItem>
                <SelectItem value="hide_price_request_quote">Request Quote</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stock */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-bold text-gray-900">Stock & Availability</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Stock Status *</Label>
            <Select value={watch("stockStatus")} onValueChange={(v) => setValue("stockStatus", v as FormData["stockStatus"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="limited_availability">Limited Availability</SelectItem>
                <SelectItem value="available_on_order">Available on Order</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Stock Quantity</Label>
            <Input {...register("stockQuantity")} type="number" placeholder="Optional" />
          </div>
          <div className="space-y-1.5">
            <Label>Min. Order Qty</Label>
            <Input {...register("minimumOrderQuantity")} type="number" min={1} />
          </div>
          <div className="space-y-1.5">
            <Label>Unit of Measure</Label>
            <Input {...register("unitOfMeasure")} placeholder="pcs" />
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-bold text-gray-900">Media & Links</h2>
        <div className="space-y-1.5">
          <Label>Image URL</Label>
          <Input {...register("imageUrl")} placeholder="https://..." />
        </div>
        <div className="space-y-1.5">
          <Label>Datasheet URL (PDF)</Label>
          <Input {...register("datasheetUrl")} placeholder="https://..." />
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Technical Specifications</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addSpec({ specName: "", specValue: "", specUnit: "", sortOrder: specFields.length })}
          >
            <Plus className="h-4 w-4" />
            Add Spec
          </Button>
        </div>
        {specFields.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No specifications added. Click &quot;Add Spec&quot; to add technical details.</p>
        )}
        <div className="space-y-3">
          {specFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`specifications.${index}.specName`)}
                placeholder="Property (e.g. Voltage)"
                className="flex-1"
              />
              <Input
                {...register(`specifications.${index}.specValue`)}
                placeholder="Value (e.g. 5)"
                className="flex-1"
              />
              <Input
                {...register(`specifications.${index}.specUnit`)}
                placeholder="Unit (e.g. V)"
                className="w-24"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeSpec(index)}>
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-bold text-gray-900">Settings</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("isFeatured")} className="rounded" />
            <span className="text-sm text-gray-700">Featured product</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("isActive")} className="rounded" />
            <span className="text-sm text-gray-700">Active (visible in store)</span>
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Meta Title</Label>
            <Input {...register("metaTitle")} placeholder="SEO title (optional)" />
          </div>
          <div className="space-y-1.5">
            <Label>Meta Description</Label>
            <Input {...register("metaDescription")} placeholder="SEO description (optional)" />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">{error}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
