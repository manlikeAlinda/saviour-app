import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

interface PriceDisplayProps {
  price: number | null;
  priceVisibilityMode: string;
  className?: string;
}

export function PriceDisplay({ price, priceVisibilityMode, className = "" }: PriceDisplayProps) {
  if (priceVisibilityMode === "show_exact_price" && price) {
    return (
      <span className={cn("font-mono font-bold", className)}>
        {formatPrice(price)}
      </span>
    );
  }
  if (priceVisibilityMode === "show_starting_from" && price) {
    return (
      <span className={cn("font-mono font-bold", className)}>
        <span className="text-[10px] font-normal opacity-70">from </span>{formatPrice(price)}
      </span>
    );
  }
  return (
    <span className={cn("font-mono text-[10px] tracking-widest uppercase font-bold text-amber-600", className)}>
      Quote
    </span>
  );
}
