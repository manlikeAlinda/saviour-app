import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  code: z.string().min(1),
  orderAmount: z.number().positive(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { code, orderAmount } = parsed.data;

  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ error: "Invalid or inactive coupon code" }, { status: 404 });
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
  }

  if (coupon.maxUsage !== null && coupon.usageCount >= coupon.maxUsage) {
    return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
  }

  if (coupon.minOrderAmount !== null && orderAmount < coupon.minOrderAmount) {
    return NextResponse.json(
      { error: `Minimum order amount of UGX ${coupon.minOrderAmount.toLocaleString()} required` },
      { status: 400 }
    );
  }

  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = (orderAmount * coupon.discountValue) / 100;
  } else {
    discountAmount = Math.min(coupon.discountValue, orderAmount);
  }

  return NextResponse.json({
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount: Math.round(discountAmount),
  });
}
