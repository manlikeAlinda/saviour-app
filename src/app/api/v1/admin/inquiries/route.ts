import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const status = searchParams.get("status");
    const q = searchParams.get("q");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (q) {
      where.OR = [
        { customerName: { contains: q } },
        { customerPhone: { contains: q } },
        { inquiryReference: { contains: q } },
      ];
    }

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        include: { items: { include: { product: { select: { name: true, sku: true } } } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.inquiry.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: inquiries,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "FETCH_FAILED", message: "Failed to fetch inquiries" } },
      { status: 500 }
    );
  }
}
