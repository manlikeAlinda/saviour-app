import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/catalog/ProductCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug, isActive: true } });
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} | Saviour Mechatronics`,
    description: category.description || `Browse ${category.name} components`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
  });

  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, isActive: true },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-green-600">Products</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{category.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
        {category.description && (
          <p className="text-gray-500 mt-2">{category.description}</p>
        )}
        <p className="text-sm text-gray-400 mt-1">{products.length} product{products.length !== 1 ? "s" : ""}</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium text-gray-600">No products in this category yet</p>
          <Link href="/products" className="text-green-600 text-sm mt-2 hover:underline block">
            Browse all products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
