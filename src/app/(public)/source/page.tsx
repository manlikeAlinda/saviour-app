"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, MessageCircle, Plus, Trash2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ComponentItem {
  id: string;
  name: string;
  quantity: string;
  specs: string;
}

export default function SourcePage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "256755888945";

  const [items, setItems] = useState<ComponentItem[]>([
    { id: crypto.randomUUID(), name: "", quantity: "1", specs: "" },
  ]);
  const [useCase, setUseCase] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [error, setError] = useState("");

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", quantity: "1", specs: "" },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof ComponentItem, value: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!contactName.trim() || !contactPhone.trim()) {
      setError("Please fill in your name and phone number.");
      return;
    }

    const filledItems = items.filter((i) => i.name.trim());
    if (filledItems.length === 0) {
      setError("Please add at least one component.");
      return;
    }

    const itemLines = filledItems
      .map((item, idx) => {
        const lines = [`${idx + 1}. *${item.name}* — Qty: ${item.quantity}`];
        if (item.specs.trim()) lines.push(`   Specs: ${item.specs.trim()}`);
        return lines.join("\n");
      })
      .join("\n\n");

    const message = [
      "Hello Saviour Mechatronics,",
      "",
      "I would like to source the following components:",
      "",
      itemLines,
      useCase.trim() ? `\n*Use case:* ${useCase.trim()}` : "",
      "",
      `*Name:* ${contactName.trim()}`,
      `*Phone:* ${contactPhone.trim()}`,
    ]
      .filter((l) => l !== undefined)
      .join("\n");

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-gray-400">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-black font-bold">Source a Component</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-green-600" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-green-700 uppercase">Custom sourcing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-black tracking-tighter mb-4">
            Can&apos;t find what<br />you&apos;re looking for?
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Tell us exactly what you need — component name, quantity, and specifications — and we&apos;ll check availability and get back to you on WhatsApp.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

              {/* Left — Components list */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-2 w-2 bg-green-600" />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">Components needed</span>
                </div>

                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div key={item.id} className="border border-gray-200 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                          Item {idx + 1}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2 space-y-1.5">
                          <Label htmlFor={`name-${item.id}`} className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Component name *
                          </Label>
                          <Input
                            id={`name-${item.id}`}
                            placeholder="e.g. Arduino Uno R3, LM317, NEMA 17..."
                            value={item.name}
                            onChange={(e) => updateItem(item.id, "name", e.target.value)}
                            className="rounded-none border-gray-200 focus-visible:ring-green-600 focus-visible:border-green-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`qty-${item.id}`} className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Quantity
                          </Label>
                          <Input
                            id={`qty-${item.id}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                            className="rounded-none border-gray-200 focus-visible:ring-green-600 focus-visible:border-green-600"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor={`specs-${item.id}`} className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Specifications / requirements
                        </Label>
                        <Textarea
                          id={`specs-${item.id}`}
                          placeholder="e.g. 5V, 2A, I2C interface, 42mm flange, 400 step/rev, part no. XYZ..."
                          rows={3}
                          value={item.specs}
                          onChange={(e) => updateItem(item.id, "specs", e.target.value)}
                          className="rounded-none border-gray-200 focus-visible:ring-green-600 focus-visible:border-green-600 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 text-sm font-bold text-green-700 hover:text-green-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add another component
                </button>
              </div>

              {/* Right — Contact + use case */}
              <div className="lg:col-span-5 space-y-8">

                {/* Use case */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-600" />
                    <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">Use case <span className="text-gray-300">(optional)</span></span>
                  </div>
                  <Textarea
                    placeholder="e.g. Building a 3D printer, automating a pump system, robotics project for school..."
                    rows={4}
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    className="rounded-none border-gray-200 focus-visible:ring-green-600 focus-visible:border-green-600 resize-none"
                  />
                  <p className="text-xs text-gray-400">
                    Helps us recommend the right variant or suggest compatible alternatives.
                  </p>
                </div>

                {/* Contact */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-600" />
                    <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">Your contact</span>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name" className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Full name *
                    </Label>
                    <Input
                      id="contact-name"
                      placeholder="Your name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="rounded-none border-gray-200 focus-visible:ring-green-600 focus-visible:border-green-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-phone" className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Phone / WhatsApp *
                    </Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="e.g. 0755888945"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="rounded-none border-gray-200 focus-visible:ring-green-600 focus-visible:border-green-600"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 border border-red-200 bg-red-50 px-4 py-3">
                    {error}
                  </p>
                )}

                <div className="border border-gray-100 bg-gray-50 p-4 text-xs text-gray-500 leading-relaxed">
                  Clicking the button below will open WhatsApp with your request pre-filled. We&apos;ll review it and reply with availability and pricing.
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-black text-green-400 hover:bg-green-700 hover:text-white font-bold text-sm transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  Send Request via WhatsApp
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* CTA — browse catalog */}
      <section className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-green-500 uppercase mb-2">Already know what you need?</p>
            <h2 className="text-2xl font-bold mb-1">Browse our catalog.</h2>
            <p className="text-gray-400">We may already stock what you&apos;re looking for.</p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-colors shrink-0"
          >
            Browse Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
