import type { CartItem } from "@/store/cart";

export async function generateCartPdf(items: CartItem[], sellerName: string) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(sellerName, 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text("Cart Summary / Procurement List", 14, 28);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 34);
  doc.setTextColor(0);

  // Table
  const rows = items.map((item) => [
    item.name,
    item.sku,
    String(item.quantity),
    item.priceVisibilityMode === "show_exact_price" && item.price != null
      ? `UGX ${(item.price * item.quantity).toLocaleString()}`
      : "Quote required",
  ]);

  const pricedSubtotal = items
    .filter((i) => i.priceVisibilityMode === "show_exact_price" && i.price != null)
    .reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0);

  autoTable(doc, {
    startY: 42,
    head: [["Product", "SKU", "Qty", "Amount (UGX)"]],
    body: rows,
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [0, 0, 0], textColor: [74, 222, 128] },
    foot: pricedSubtotal > 0
      ? [["", "", "Subtotal", `UGX ${pricedSubtotal.toLocaleString()}`]]
      : undefined,
    footStyles: { fontStyle: "bold" },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY ?? 100;
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(
    "* Prices marked 'Quote required' will be confirmed via WhatsApp. Final total may vary.",
    14,
    finalY + 10
  );

  doc.save(`saviour-cart-${Date.now()}.pdf`);
}
