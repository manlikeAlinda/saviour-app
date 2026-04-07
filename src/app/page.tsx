import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Truck,
  Zap,
  Cpu,
  Settings,
  Activity,
  Box,
  Wrench,
} from "lucide-react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { prisma } from "@/lib/prisma";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: { category: { select: { name: true, slug: true } } },
    take: 8,
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
    take: 6,
  });
}

const categoryIcons: Record<string, React.ReactNode> = {
  microcontrollers: <Cpu className="h-7 w-7" />,
  sensors: <Activity className="h-7 w-7" />,
  motors: <Settings className="h-7 w-7" />,
  "power-modules": <Zap className="h-7 w-7" />,
  "plc-components": <Box className="h-7 w-7" />,
  "development-boards": <Cpu className="h-7 w-7" />,
  "motor-drivers": <Settings className="h-7 w-7" />,
  connectors: <Box className="h-7 w-7" />,
  robotics: <Settings className="h-7 w-7" />,
  tools: <Wrench className="h-7 w-7" />,
};

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Saviour Mechatronics | Electronics & Automation Components",
  description:
    "Browse and order quality mechatronics components — microcontrollers, sensors, motors, PLC parts and more. WhatsApp-assisted ordering for personalized service.",
};

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  const whatsappNumber = process.env.WHATSAPP_NUMBER || "256755888945";

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">

        {/* Hero */}
        <section className="relative bg-black text-white overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80&fit=crop"
            alt=""
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-br from-black/90 via-black/70 to-green-950/80" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8 sm:pt-24 sm:pb-12 md:pt-32 md:pb-16 w-full">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="h-px w-10 bg-green-500" />
                <span className="text-[11px] font-bold tracking-[0.3em] text-green-500 uppercase">
                  Kampala, Uganda
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-none tracking-tighter mb-4 sm:mb-6 text-white">
                Electronics &<br />
                <span className="text-green-400">Automation</span><br />
                Components.
              </h1>

              <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-10 max-w-xl leading-relaxed">
                Microcontrollers, sensors, motors, PLC parts and more — available locally.
                Build your order online and confirm through WhatsApp.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-colors"
                >
                  Browse Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=Hello, I have a query about mechatronics components.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white hover:bg-white/10 font-bold text-sm transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Bottom trust bar */}
          <div className="relative border-t border-white/10 bg-white/5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                {[
                  { icon: <ShieldCheck className="h-4 w-4" />, title: "Genuine parts", desc: "Sourced from reputable suppliers" },
                  { icon: <Truck className="h-4 w-4" />, title: "Flexible delivery", desc: "Pickup, boda or courier" },
                  { icon: <MessageCircle className="h-4 w-4" />, title: "WhatsApp ordering", desc: "Personal order confirmation" },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-3 py-4 px-4 sm:px-6">
                    <div className="text-green-400 shrink-0">{item.icon}</div>
                    <div>
                      <div className="text-sm font-bold text-white">{item.title}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] text-green-700 uppercase mb-2">What we stock</p>
                <h2 className="text-3xl font-bold text-black tracking-tight">Browse by Category</h2>
              </div>
              <Link href="/products" className="text-sm font-bold text-gray-500 hover:text-green-700 transition-colors flex items-center gap-1">
                All products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-gray-200 border border-gray-200">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center gap-3 p-6 bg-white hover:bg-black transition-colors duration-200 text-center"
                >
                  <div className="text-green-600 group-hover:text-green-400 transition-colors">
                    {categoryIcons[cat.slug] || <Box className="h-7 w-7" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-black group-hover:text-white transition-colors leading-tight">{cat.name}</div>
                    <div className="text-[10px] text-gray-400 group-hover:text-gray-500 mt-0.5">{cat._count.products} items</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-gray-100">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] text-green-700 uppercase mb-2">Hand-picked</p>
                <h2 className="text-3xl font-bold text-black tracking-tight">Featured Products</h2>
              </div>
              <Link href="/products" className="text-sm font-bold text-gray-500 hover:text-green-700 transition-colors flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white border border-gray-200">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Why us */}
        <section className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <p className="text-[10px] font-bold tracking-[0.3em] text-green-500 uppercase mb-2">Why choose us</p>
              <h2 className="text-3xl font-bold text-white tracking-tight">Built for engineers, makers & students</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-800">
              {[
                { icon: <ShieldCheck className="h-7 w-7 text-green-400" />, title: "Genuine parts", desc: "We source only quality components from reputable suppliers. No counterfeit parts." },
                { icon: <Cpu className="h-7 w-7 text-green-400" />, title: "Technical knowledge", desc: "Our team understands what they sell. We can help you choose the right component." },
                { icon: <MessageCircle className="h-7 w-7 text-green-400" />, title: "WhatsApp ordering", desc: "Browse online, confirm via WhatsApp. Fast, personal, and reliable service." },
                { icon: <Truck className="h-7 w-7 text-green-400" />, title: "Local stock", desc: "No waiting for international shipping. Most items are available and ready to go." },
              ].map((item) => (
                <div key={item.title} className="bg-neutral-900 p-8 space-y-4">
                  {item.icon}
                  <h3 className="font-bold text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WhatsApp CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-green-700 text-white">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-green-300 uppercase mb-2">Get in touch</p>
              <h2 className="text-3xl font-bold mb-3">Ready to order?</h2>
              <p className="text-green-100 text-lg max-w-lg">
                Browse the catalog, add to cart, and we&apos;ll handle the rest through WhatsApp. No online payment needed.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-700 hover:bg-green-50 font-bold text-sm transition-colors"
              >
                Browse Products
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white hover:bg-white/10 font-bold text-sm transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
