import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/customer-auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const reviews = await prisma.review.findMany({
    where: { productId: product.id, isApproved: true },
    include: { customer: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return NextResponse.json({ reviews, avgRating, count: reviews.length });
}

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().min(10).max(1000),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { error, session } = await requireCustomer();
  if (error) return error;

  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const customerId = Number((session!.user as { id?: string }).id);

  const existing = await prisma.review.findUnique({
    where: { customerId_productId: { customerId, productId: product.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 });
  }

  const review = await prisma.review.create({
    data: {
      productId: product.id,
      customerId,
      rating: parsed.data.rating,
      title: parsed.data.title,
      comment: parsed.data.comment,
    },
  });

  return NextResponse.json({ success: true, review }, { status: 201 });
}
