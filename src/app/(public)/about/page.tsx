import Image from "next/image";
import Link from "next/link";
import {
  Cpu,
  ShieldCheck,
  MessageCircle,
  Truck,
  Users,
  Zap,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "About Us | Saviour Mechatronics",
  description: "Learn about Saviour Mechatronics — your trusted source for quality electronics and automation components in Uganda.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-gray-400">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-black font-bold">About</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-green-600" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-green-700 uppercase">About Us</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-black tracking-tighter mb-6">
            Engineering the<br />
            <span className="text-green-700">Future of Uganda.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
            Saviour Mechatronics is dedicated to bridging the gap between local innovation and world-class component accessibility — right here in Kampala.
          </p>
        </div>
      </section>

      {/* Story + Image */}
      <section className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-2 w-2 bg-green-600" />
                <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">Our Story</span>
              </div>
              <div className="space-y-5 text-gray-600 leading-relaxed">
                <p>
                  Founded in Kampala, <span className="font-bold text-black">Saviour Mechatronics</span> emerged from a simple necessity: the need for reliable, high-specification hardware without the friction of international shipping delays.
                </p>
                <p>
                  We don&apos;t just sell parts. We curate a hand-selected catalog of microcontrollers, sensors, motors, and automation components — all vetted for quality and performance.
                </p>
                <blockquote className="border-l-4 border-green-600 pl-5 py-1 bg-gray-50 italic text-gray-700">
                  Because stock and pricing change quickly, we confirm every order through WhatsApp. That way you always get accurate information before committing to a purchase.
                </blockquote>
              </div>
              <div className="pt-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white hover:bg-green-700 font-bold text-sm transition-colors"
                >
                  Browse our catalog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="overflow-hidden border border-gray-200">
                <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80&fit=crop"
                  alt="Electronics workspace"
                  width={600}
                  height={750}
                  className="object-cover w-full grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-[10px] font-bold tracking-[0.3em] text-green-500 uppercase mb-2">What we offer</p>
            <h2 className="text-3xl font-bold text-white tracking-tight">How we work</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-800">
            {[
              {
                icon: <ShieldCheck className="h-6 w-6 text-green-400" />,
                title: "Quality assurance",
                desc: "Every component in our catalog is sourced from reputable suppliers and checked before it reaches you.",
              },
              {
                icon: <Cpu className="h-6 w-6 text-green-400" />,
                title: "Technical knowledge",
                desc: "Our team has hands-on experience with the products we sell. We can help you pick the right part for your project.",
              },
              {
                icon: <MessageCircle className="h-6 w-6 text-green-400" />,
                title: "WhatsApp ordering",
                desc: "Browse online, confirm via WhatsApp. Real-time answers on stock, specs, and pricing.",
              },
              {
                icon: <Truck className="h-6 w-6 text-green-400" />,
                title: "Flexible delivery",
                desc: "Boda delivery within Kampala, courier upcountry, or collect in person. We work around you.",
              },
              {
                icon: <Zap className="h-6 w-6 text-green-400" />,
                title: "Local stock",
                desc: "No waiting weeks for international shipping. What you see on the site is available in Kampala.",
              },
              {
                icon: <Users className="h-6 w-6 text-green-400" />,
                title: "Community first",
                desc: "We support engineers, students, makers, and small businesses across Uganda.",
              },
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

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-green-700 text-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Ready to find your components?</h2>
            <p className="text-green-100 text-lg">Browse the catalog and get in touch through WhatsApp.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-700 hover:bg-green-50 font-bold text-sm transition-colors"
            >
              Browse Products
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-white hover:bg-white/10 font-bold text-sm transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
