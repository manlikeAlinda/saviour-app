import Link from "next/link";
import { MessageCircle, Mail, MapPin, Clock, ChevronRight, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Contact Us | Saviour Mechatronics",
  description: "Get in touch with Saviour Mechatronics for component inquiries, technical support, and ordering.",
};

export default function ContactPage() {
  const whatsappNumber = process.env.WHATSAPP_NUMBER || "+256755888945";

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-gray-400">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-black font-bold">Contact</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-green-600" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-green-700 uppercase">Get in touch</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-black tracking-tighter mb-4">
            We&apos;re here to help.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Questions about a product, bulk pricing, or sourcing something not in the catalog — reach out and we&apos;ll get back to you fast.
          </p>
        </div>
      </section>

      {/* Contact details + FAQ */}
      <section className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact Info */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-2 w-2 bg-green-600" />
                <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">Contact details</span>
              </div>

              <div className="space-y-0 border border-gray-200">
                {[
                  {
                    icon: <MessageCircle className="h-5 w-5 text-green-600" />,
                    title: "WhatsApp",
                    detail: "Best for order inquiries and quick support",
                    action: (
                      <a
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 bg-black text-green-400 hover:bg-green-700 hover:text-white font-bold text-xs transition-colors"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Chat on WhatsApp
                      </a>
                    ),
                  },
                  {
                    icon: <Mail className="h-5 w-5 text-green-600" />,
                    title: "Email",
                    detail: "For formal inquiries and documentation",
                    action: (
                      <a href="mailto:info@saviour.com" className="inline-block mt-3 text-sm font-bold text-green-700 hover:text-green-600 transition-colors">
                        info@saviour.com
                      </a>
                    ),
                  },
                  {
                    icon: <MapPin className="h-5 w-5 text-green-600" />,
                    title: "Location",
                    detail: "Kampala, Uganda",
                    action: null,
                  },
                  {
                    icon: <Clock className="h-5 w-5 text-green-600" />,
                    title: "Business hours",
                    detail: "Monday – Saturday: 8:00 AM – 6:00 PM",
                    action: <p className="text-sm text-gray-400 mt-1">Sunday: Closed</p>,
                  },
                ].map((item, i, arr) => (
                  <div key={item.title} className={`flex items-start gap-5 p-6 ${i < arr.length - 1 ? "border-b border-gray-200" : ""}`}>
                    <div className="shrink-0 mt-0.5">{item.icon}</div>
                    <div>
                      <p className="font-bold text-black">{item.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{item.detail}</p>
                      {item.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-2 w-2 bg-green-600" />
                <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">Common questions</span>
              </div>

              <div className="border border-gray-200">
                {[
                  {
                    q: "How does ordering work?",
                    a: "Browse our catalog, add items to your cart, fill in your details, and submit. We confirm stock, pricing, and delivery through WhatsApp.",
                  },
                  {
                    q: "Do you handle bulk orders?",
                    a: "Yes. Send us your requirements via WhatsApp and we will arrange bulk pricing and sourcing.",
                  },
                  {
                    q: "Can you source items not in the catalog?",
                    a: "Often yes. Send us the part number or specification and we will check availability for you.",
                  },
                  {
                    q: "What delivery options are available?",
                    a: "Store pickup, boda delivery within Kampala, or courier upcountry. We can discuss options via WhatsApp.",
                  },
                  {
                    q: "Is online payment available?",
                    a: "We confirm orders via WhatsApp and arrange payment on delivery or before dispatch. No online payment is required.",
                  },
                ].map((item, i, arr) => (
                  <div key={item.q} className={`p-6 ${i < arr.length - 1 ? "border-b border-gray-200" : ""}`}>
                    <p className="font-bold text-black text-sm mb-1.5">{item.q}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-green-500 uppercase mb-2">Ready to order?</p>
            <h2 className="text-3xl font-bold mb-2">Browse our catalog.</h2>
            <p className="text-gray-400 text-lg">Find the components you need and confirm via WhatsApp.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-colors"
            >
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
