import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "Add Product | Admin" };

export default function NewProductPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
        <p className="text-gray-500 text-sm mt-1">Create a new product in the catalog</p>
      </div>
      <ProductForm />
    </div>
  );
}
