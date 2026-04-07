"use client";

import Link from "next/link";
import { 
  Cpu, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Terminal,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from "lucide-react";

export function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "256755888945";
  const currentYear = new Date().getFullYear();

  const categories = [
    { label: "Microcontrollers", href: "/category/microcontrollers" },
    { label: "Sensors", href: "/category/sensors" },
    { label: "Motors & Actuators", href: "/category/motors" },
    { label: "PLC Components", href: "/category/plc-components" },
    { label: "Development Boards", href: "/category/development-boards" },
  ];

  return (
    <footer className="bg-[#0a0a0b] text-gray-400 font-sans selection:bg-green-500/30">
      {/* Technical Top Border */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-neutral-800 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Specification Segment */}
          <div className="md:col-span-4 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tighter uppercase">
                <Cpu className="h-6 w-6 text-green-500" />
                <span>Saviour <span className="text-green-500">Mechatronics</span></span>
              </div>
            </div>
            
            <p className="text-sm leading-relaxed max-w-xs border-l-2 border-neutral-800 pl-4 py-1">
              Precision-grade hardware procurement for industrial automation, 
              robotics, and embedded systems development.
            </p>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between w-full max-w-60 rounded-sm border border-green-500/30 bg-green-500/5 px-4 py-3 text-xs font-mono font-bold uppercase tracking-widest text-green-500 hover:bg-green-500 hover:text-black transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Initiate Chat
              </span>
              <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* Logistics & Navigation Panels */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Categories Segment */}
            <div>
              <h3 className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-[0.3em] mb-6">
                Component Index
              </h3>
              <ul className="space-y-3 text-sm">
                {categories.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="flex items-center gap-2 hover:text-green-400 transition-colors group">
                      <span className="h-px w-0 bg-green-500 group-hover:w-3 transition-all" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links Segment */}
            <div>
              <h3 className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-[0.3em] mb-6">
                Resources
              </h3>
              <ul className="space-y-3 text-sm">
                {["Shop All", "Request Quote", "About", "FAQ"].map((label) => (
                  <li key={label}>
                    <Link href="#" className="hover:text-green-400 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Terminal Contact Segment */}
            <div className="bg-black/40 p-6 border border-neutral-800/50 rounded-sm">
              <h3 className="text-[11px] font-mono font-bold text-green-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Terminal className="h-3 w-3" />
                Contact Us
              </h3>
              <ul className="space-y-4 text-xs font-mono">
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>KAMPALA_UGANDA<br/>0.3476° N, 32.5825° E</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="truncate">support@saviour.me</span>
                </li>
                <li className="flex items-center gap-3">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span className="text-gray-500">Uptime: Mon-Sat</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Metadata Footer */}
        <div className="mt-20 pt-8 border-t border-neutral-800/50 flex flex-col lg:flex-row justify-between items-center gap-6 text-[10px] font-mono tracking-wider text-gray-600">
          <div className="flex flex-wrap justify-center gap-6 uppercase">
            <p>&copy; {currentYear} SV_MECH_SYS</p>
            <p className="flex items-center gap-1.5 text-gray-500">
              <ShieldCheck className="h-3.5 w-3.5" /> 
              Verification: Manual (WhatsApp)
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-black/50 px-4 py-2 rounded-full border border-neutral-800">
             <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
             <span className="uppercase italic">Transaction Protocol: COD / Mobile Money Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
}