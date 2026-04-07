import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const [
      totalProducts,
      activeProducts,
      totalInquiries,
      newInquiries,
      quotedInquiries,
      recentInquiries,
      categoryCounts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: "new" } }),
      prisma.inquiry.count({ where: { status: "quoted" } }),
      prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          inquiryReference: true,
          customerName: true,
          customerPhone: true,
          deliveryLocation: true,
          status: true,
          createdAt: true,
          _count: { select: { items: true } },
        },
      }),
      prisma.category.findMany({
        include: { _count: { select: { products: { where: { isActive: true } } } } },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        totalInquiries,
        newInquiries,
        quotedInquiries,
        recentInquiries,
        categoryCounts,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "FETCH_FAILED", message: "Failed to fetch dashboard data" } },
      { status: 500 }
    );
  }
}
