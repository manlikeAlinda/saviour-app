import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  const phone = searchParams.get("phone");

  if (!reference || !phone) {
    return NextResponse.json({ error: "reference and phone are required" }, { status: 400 });
  }

  const inquiry = await prisma.inquiry.findFirst({
    where: {
      inquiryReference: reference.toUpperCase(),
      customerPhone: phone,
    },
    include: {
      items: {
        select: {
          productNameSnapshot: true,
          skuSnapshot: true,
          quantity: true,
          priceSnapshot: true,
          stockStatusSnapshot: true,
        },
      },
    },
  });

  if (!inquiry) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    inquiryReference: inquiry.inquiryReference,
    status: inquiry.status,
    customerName: inquiry.customerName,
    deliveryMethod: inquiry.deliveryMethod,
    deliveryLocation: inquiry.deliveryLocation,
    totalEstimate: inquiry.totalEstimate,
    subtotalAmount: inquiry.subtotalAmount,
    discountAmount: inquiry.discountAmount,
    couponCode: inquiry.couponCode,
    createdAt: inquiry.createdAt,
    updatedAt: inquiry.updatedAt,
    items: inquiry.items,
  });
}
