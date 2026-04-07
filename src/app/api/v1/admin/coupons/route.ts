import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const couponSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().positive().optional().nullable(),
  maxUsage: z.number().int().positive().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  isActive: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const coupon = await prisma.coupon.findUnique({ where: { id: Number(id) } });
    return NextResponse.json(coupon);
  }

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  const body = await req.json();
  const parsed = couponSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const existing = await prisma.coupon.findUnique({ where: { code: parsed.data.code } });
  if (existing) return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });

  const coupon = await prisma.coupon.create({
    data: {
      code: parsed.data.code,
      discountType: parsed.data.discountType,
      discountValue: parsed.data.discountValue,
      minOrderAmount: parsed.data.minOrderAmount ?? null,
      maxUsage: parsed.data.maxUsage ?? null,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      isActive: parsed.data.isActive ?? true,
    },
  });

  return NextResponse.json(coupon, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  const body = await req.json();
  const { id, ...rest } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const parsed = couponSchema.partial().safeParse(rest);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const coupon = await prisma.coupon.update({
    where: { id: Number(id) },
    data: {
      ...parsed.data,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
    },
  });

  return NextResponse.json(coupon);
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.coupon.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
