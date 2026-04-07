import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  ArrowLeft,
  ChevronRight,
  Database,
  Cpu,
  Info,
  Maximize2,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { StockBadge } from "@/components/catalog/StockBadge";
import { PriceDisplay } from "@/components/catalog/PriceDisplay";
import { ProductCard } from "@/components/catalog/ProductCard";
import { AddToCartButton } from "@/components/catalog/AddToCartButton";
import { ProductReviews } from "@/components/catalog/ProductReviews";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    select: { name: true, metaTitle: true, metaDescription: true, shortDescription: true },
  });
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.metaTitle || `${product.name} | Saviour Mechatronics`,
    description: product.metaDescription || product.shortDescription || undefined,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      brand: true,
      specifications: { orderBy: { sortOrder: "asc" } },
      relatedFrom: {
        include: {
          relatedProduct: {
            select: {
              id: true,
              name: true,
              slug: true,
              sku: true,
              imageUrl: true,
              price: true,
              priceVisibilityMode: true,
              stockStatus: true,
              shortDescription: true,
              minimumOrderQuantity: true,
              isFeatured: true,
              category: { select: { name: true, slug: true } },
            },
          },
        },
      },
    },
  });

  if (!product) notFound();

  const gallery: string[] = product.galleryJson ? JSON.parse(product.galleryJson) : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar / System Path */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-gray-400">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-green-600 transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            {product.category && (
              <>
                <Link href={`/category/${product.category.slug}`} className="hover:text-green-600 transition-colors">
                  {product.category.name}
                </Link>
                <ChevronRight className="h-3 w-3" />
              </>
            )}
            <span className="text-black font-bold truncate max-w-50">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Visual Asset & Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square bg-gray-50 border border-gray-200 group overflow-hidden">
              {/* Decorative Viewfinder Corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gray-300 z-10" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gray-300 z-10" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gray-300 z-10" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gray-300 z-10" />
              
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-12 transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-200">
                  <Cpu className="w-24 h-24 stroke-[1px]" />
                </div>
              )}
              
              <div className="absolute bottom-6 right-6 flex gap-2">
                <Button size="icon" variant="secondary" className="rounded-none bg-white/80 backdrop-blur shadow-sm">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {gallery.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {gallery.map((img, i) => (
                  <button key={i} className="relative h-24 w-24 shrink-0 border border-gray-200 bg-gray-50 hover:border-green-500 transition-colors">
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Technical Specifications Header */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                {product.brand && (
                  <Link href={`/products?brand=${product.brand.slug}`} className="text-[10px] font-bold text-green-600 border border-green-200 px-2 py-0.5 uppercase tracking-wider">
                    {product.brand.name}
                  </Link>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight leading-tight uppercase">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 py-2 border-y border-gray-100">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest">SKU</div>
                <div className="text-sm font-mono font-bold text-gray-700">{product.sku}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <StockBadge status={product.stockStatus} />
              <div className="h-4 w-px bg-gray-200" />
            </div>

            <div className="space-y-4">
              <div className="bg-black p-6 text-white border-l-4 border-green-600">
                <div className="text-[10px] text-green-500 mb-1 uppercase tracking-widest">Price</div>
                <PriceDisplay price={product.price} priceVisibilityMode={product.priceVisibilityMode} className="text-4xl font-bold tracking-tighter" />
              </div>

              {product.priceVisibilityMode !== "show_exact_price" && (
                <div className="bg-amber-50 border border-amber-200 p-4 flex gap-3">
                  <Info className="h-5 w-5 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    <span className="font-bold">Pricing via WhatsApp:</span> The exact price for this item is confirmed through WhatsApp before your order is finalised.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {product.shortDescription && (
                <p className="text-gray-600 leading-relaxed text-sm font-light italic border-l-2 border-gray-100 pl-4">
                  {product.shortDescription}
                </p>
              )}

              <div className="pt-4 border-t border-gray-100">
                <AddToCartButton product={product} />
              </div>

              {product.datasheetUrl && (
                <Button variant="outline" className="w-full rounded-none border-gray-200 font-mono text-xs uppercase tracking-widest h-12" asChild>
                  <a href={product.datasheetUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Datasheet
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Extended Data Section */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-gray-100 pt-16">
          
          {/* Detailed Description */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-2 w-2 bg-green-600" />
                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-black">Description</h2>
              </div>
              
              <div className="prose prose-slate max-w-none">
                <p className="text-gray-600 leading-loose whitespace-pre-wrap font-light">
                  {product.fullDescription}
                </p>
              </div>
            </div>

            {product.technicalSummary && (
              <div className="bg-gray-50 border border-gray-200 p-8 relative overflow-hidden">
                <Database className="absolute -bottom-4 -right-4 h-24 w-24 text-gray-200 opacity-50" />
                <h3 className="text-xs font-bold text-black mb-4 uppercase tracking-widest">Technical Summary</h3>
                <p className="text-sm text-gray-600 leading-relaxed relative z-10">{product.technicalSummary}</p>
              </div>
            )}
          </div>

          {/* Detailed Specs Table */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-2 w-2 bg-green-600" />
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-black">Specifications</h2>
            </div>
            
            <div className="border border-gray-200">
              <table className="w-full text-xs font-mono">
                <tbody>
                  {product.specifications.length > 0 ? (
                    product.specifications.map((spec, i) => (
                      <tr key={spec.id} className={cn("border-b border-gray-100", i % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                        <td className="px-4 py-3 font-bold text-gray-400 uppercase w-1/3 border-r border-gray-100">
                          {spec.specName}
                        </td>
                        <td className="px-4 py-3 text-black">
                          {spec.specValue}
                          {spec.specUnit && <span className="text-green-600 ml-1">[{spec.specUnit}]</span>}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-8 text-center text-gray-400 italic">No specifications listed.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Related Components Manifest */}
        {product.relatedFrom.length > 0 && (
          <div className="mt-24">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-600" />
                  <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-black">Related Products</h2>
                </div>
                <div className="h-px flex-1 bg-gray-100 mx-8" />
             </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.relatedFrom.map(({ relatedProduct }) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}

        <ProductReviews productSlug={product.slug} />

        {/* Footer Navigation */}
        <div className="mt-24 pt-12 border-t border-gray-100 flex justify-between items-center">
          <Button variant="ghost" className="rounded-none font-mono text-xs text-gray-400 hover:text-black" asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Link>
          </Button>
          <div className="flex gap-4">
             <Button variant="outline" size="icon" className="rounded-none border-gray-200">
                <Share2 className="h-4 w-4" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}