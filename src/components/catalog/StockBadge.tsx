const stockConfig: Record<string, { label: string; classes: string }> = {
  in_stock: { label: "In Stock", classes: "bg-green-50 text-green-700 border-green-200" },
  limited_availability: { label: "Limited", classes: "bg-amber-50 text-amber-700 border-amber-200" },
  available_on_order: { label: "On Order", classes: "bg-blue-50 text-blue-700 border-blue-200" },
  out_of_stock: { label: "Out of Stock", classes: "bg-red-50 text-red-600 border-red-200" },
};

export function StockBadge({ status }: { status: string }) {
  const config = stockConfig[status] || { label: status, classes: "bg-gray-50 text-gray-500 border-gray-200" };
  return (
    <span className={`inline-block text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 border ${config.classes}`}>
      {config.label}
    </span>
  );
}
