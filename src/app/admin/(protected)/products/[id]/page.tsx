import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Edit Product | Admin" };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: { specifications: { orderBy: { sortOrder: "asc" } } },
  });

  if (!product) notFound();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 text-sm mt-1 font-mono">{product.sku} — {product.name}</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
