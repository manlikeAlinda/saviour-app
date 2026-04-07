"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InquirySuccessPage() {
  const [ref, setRef] = useState("");
  const [waUrl, setWaUrl] = useState("");

  useEffect(() => {
    const savedRef = sessionStorage.getItem("lastInquiryRef") || "";
    const savedUrl = sessionStorage.getItem("lastWhatsappUrl") || "";
    setRef(savedRef);
    setWaUrl(savedUrl);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Inquiry Submitted!</h1>
        <p className="text-gray-600 mb-2">
          Your inquiry has been recorded and is ready to be sent via WhatsApp.
        </p>

        {ref && (
          <div className="inline-block bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 my-4">
            <span className="text-xs text-gray-500">Reference Number</span>
            <p className="font-mono font-bold text-green-700 text-lg">{ref}</p>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-8">
          Keep this reference number for tracking. Our team will confirm availability, final pricing and delivery details via WhatsApp.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {waUrl && (
            <Button variant="whatsapp" size="lg" asChild>
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                Open WhatsApp to Send
              </a>
            </Button>
          )}
          <Button variant="outline" size="lg" asChild>
            <Link href="/products">
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800 text-left">
          <strong>What happens next?</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1 text-green-700">
            <li>Click &quot;Open WhatsApp&quot; above to send your pre-filled order message</li>
            <li>Our team reviews your inquiry and confirms stock availability</li>
            <li>We provide final pricing including delivery cost</li>
            <li>You confirm and we proceed with fulfillment</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
