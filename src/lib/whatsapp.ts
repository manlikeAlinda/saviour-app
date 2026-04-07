export interface WhatsAppCartItem {
  name: string;
  sku: string;
  quantity: number;
}

export interface WhatsAppInquiryData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryLocation: string;
  deliveryMethod: string;
  inquiryNotes?: string;
  inquiryReference: string;
  items: WhatsAppCartItem[];
}

export function generateWhatsAppMessage(data: WhatsAppInquiryData): string {
  const sellerName = process.env.SELLER_NAME || "Saviour Mechatronics";

  const itemLines = data.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name}\n   SKU: ${item.sku}\n   Quantity: ${item.quantity}`
    )
    .join("\n\n");

  const deliveryMethodLabel: Record<string, string> = {
    pickup: "Pickup from store",
    courier: "Courier delivery",
    boda_delivery: "Boda delivery",
    third_party_logistics: "Third-party logistics",
    discuss_on_whatsapp: "To discuss on WhatsApp",
  };

  const lines = [
    `Hello ${sellerName},`,
    "",
    "I would like to request the following mechatronics components:",
    "",
    itemLines,
    "",
    `Customer Name: ${data.customerName}`,
    `Phone: ${data.customerPhone}`,
  ];

  if (data.customerEmail) {
    lines.push(`Email: ${data.customerEmail}`);
  }

  lines.push(`Location: ${data.deliveryLocation}`);
  lines.push(
    `Delivery Method: ${deliveryMethodLabel[data.deliveryMethod] || data.deliveryMethod}`
  );

  if (data.inquiryNotes) {
    lines.push(`Notes: ${data.inquiryNotes}`);
  }

  lines.push("");
  lines.push(`Inquiry Reference: ${data.inquiryReference}`);
  lines.push("");
  lines.push(
    "Please confirm stock availability, final pricing, and shipping details."
  );

  return lines.join("\n");
}

export function generateWhatsAppUrl(message: string): string {
  const number = process.env.WHATSAPP_NUMBER || "+256755888945";
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}
