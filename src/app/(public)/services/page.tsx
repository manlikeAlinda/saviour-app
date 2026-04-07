import Link from "next/link";
import { ChevronRight, Cpu, BookOpen, Layers, GraduationCap, Lightbulb, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Services | Saviour Mechatronics",
  description: "Beyond components — we offer training, PCB design, prototyping, school project supervision, and product development consulting.",
};

const services = [
  {
    icon: <Cpu className="h-8 w-8 text-green-600" />,
    title: "Electronics Prototyping",
    description:
      "We help you build working prototypes of your electronic designs. From schematic review to breadboard assembly and testing, we work with you to bring ideas to life quickly.",
    details: ["Rapid prototyping", "Component sourcing", "Circuit testing & debugging", "Design iteration support"],
  },
  {
    icon: <Layers className="h-8 w-8 text-green-600" />,
    title: "PCB Design",
    description:
      "Custom PCB layout and design for your projects. We handle single and double-layer boards, component placement, and produce Gerber files ready for fabrication.",
    details: ["Schematic capture", "Single & double-layer PCBs", "Gerber file export", "Design-for-manufacture review"],
  },
  {
    icon: <GraduationCap className="h-8 w-8 text-green-600" />,
    title: "Training & Workshops",
    description:
      "Hands-on training sessions covering electronics fundamentals, Arduino and Raspberry Pi programming, sensor integration, and basic robotics — for individuals, teams, and institutions.",
    details: ["Arduino & Raspberry Pi", "Sensor & actuator integration", "Robotics basics", "Group & corporate sessions"],
  },
  {
    icon: <BookOpen className="h-8 w-8 text-green-600" />,
    title: "School Project Supervision",
    description:
      "We supervise and guide students through final-year engineering and electronics projects. We help with feasibility, component selection, circuit design, and final presentation.",
    details: ["Project scoping & feasibility", "Component selection", "Circuit design guidance", "Report & presentation support"],
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-green-600" />,
    title: "Product Development Consulting",
    description:
      "From concept to production-ready design, we consult on electronics product development — helping startups and businesses define specifications, choose platforms, and plan manufacturing.",
    details: ["Concept & spec definition", "Platform & component selection", "Prototype-to-production roadmap", "Supplier & sourcing guidance"],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-gray-400">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-black font-bold">Services</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-green-600" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-green-700 uppercase">What we offer</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-black tracking-tighter mb-4">
            More than components.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            We don&apos;t just sell parts. We help you design, build, and learn. Whether you&apos;re a student, a startup, or an established business — we have a service for you.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 border border-gray-200">
            {services.map((service) => (
              <div key={service.title} className="bg-white p-10">
                <div className="mb-5">{service.icon}</div>
                <h2 className="text-xl font-bold text-black mb-3">{service.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.details.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="h-1.5 w-1.5 bg-green-600 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* CTA tile */}
            <div className="bg-black p-10 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] text-green-500 uppercase mb-3">Get started</p>
                <h2 className="text-2xl font-bold text-white mb-3">Have a project in mind?</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Reach out via WhatsApp or email to discuss your requirements. We&apos;ll respond within one business day.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-colors w-fit"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gray-50 border-t border-gray-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] font-bold tracking-[0.3em] text-green-700 uppercase mb-3">Need components too?</p>
          <h2 className="text-3xl font-bold text-black mb-4">Browse our full catalog.</h2>
          <p className="text-gray-500 mb-8">
            Thousands of mechatronics components in stock — sensors, actuators, microcontrollers, and more.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black hover:bg-gray-900 text-white font-bold text-sm transition-colors"
          >
            Browse Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
