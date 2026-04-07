import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // "pending" | "approved" | "all"

  const where =
    status === "pending"
      ? { isApproved: false }
      : status === "approved"
      ? { isApproved: true }
      : {};

  const reviews = await prisma.review.findMany({
    where,
    include: {
      customer: { select: { fullName: true, email: true } },
      product: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function PATCH(req: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  const { id, isApproved } = await req.json();
  if (!id || typeof isApproved !== "boolean") {
    return NextResponse.json({ error: "id and isApproved required" }, { status: 400 });
  }

  const review = await prisma.review.update({
    where: { id: Number(id) },
    data: { isApproved },
  });

  return NextResponse.json(review);
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
