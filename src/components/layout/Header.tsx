"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Cpu, Phone, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/catalog/SearchBar";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-green-500/20 shadow-lg" 
          : "bg-white border-b border-gray-100"
      )}
    >
      {/* Technical Status Bar */}
      <div className="bg-black text-green-400 text-[10px] uppercase tracking-widest py-1 px-4 font-mono hidden sm:flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <Phone className="h-3 w-3" />
            Support: +256755888945
          </span>
        </div>
        <div className="hidden lg:block">
          Precision Engineering & Automation Solutions
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo with Motion */}
          <Link href="/" className="group flex items-center gap-2 font-bold text-xl">
            <div className="relative">
              <Cpu className="h-8 w-8 text-green-700 group-hover:rotate-90 transition-transform duration-500" />
              <motion.div 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-green-400/20 blur-xl rounded-full"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-black tracking-tighter uppercase">Saviour</span>
              <span className="text-green-700 text-[10px] font-mono tracking-[0.2em]">Mechatronics</span>
            </div>
          </Link>

          {/* Desktop Nav - "Terminal" Style */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-mono transition-colors group",
                    isActive ? "text-green-700" : "text-gray-600 hover:text-green-600"
                  )}
                >
                  {isActive && (
                    <motion.span 
                      layoutId="nav-underline"
                      className="absolute inset-0 bg-green-50 rounded-md -z-10"
                    />
                  )}
                  <span className="relative flex items-center gap-1">
                    {isActive && <Zap className="h-3 w-3 fill-current" />}
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <SearchBar />

            <Link href="/cart" className="relative p-2 group">
              <div className="absolute inset-0 bg-green-100 scale-0 group-hover:scale-100 rounded-full transition-transform" />
              <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-green-700 relative z-10" />
              {itemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-sm bg-black text-[10px] font-mono text-green-400 border border-green-500/50"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-50 text-black"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with AnimatePresence */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex justify-between items-center px-4 py-3 rounded-lg font-mono text-sm",
                    pathname === link.href ? "bg-green-700 text-white" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {link.label}
                  <span className="opacity-30 text-[10px]">0{navLinks.indexOf(link) + 1}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}