import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const stockStatus = searchParams.get("stock_status");
    const q = searchParams.get("q");
    const featured = searchParams.get("featured");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 48);
    const sort = searchParams.get("sort") || "createdAt_desc";

    const where: Record<string, unknown> = { isActive: true };

    if (category) where.category = { slug: category };
    if (brand) where.brand = { slug: brand };
    if (stockStatus) where.stockStatus = stockStatus;
    if (featured === "true") where.isFeatured = true;
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { sku: { contains: q } },
        { shortDescription: { contains: q } },
      ];
    }

    const orderByMap: Record<string, Record<string, string>> = {
      createdAt_desc: { createdAt: "desc" },
      createdAt_asc: { createdAt: "asc" },
      name_asc: { name: "asc" },
      price_asc: { price: "asc" },
      price_desc: { price: "desc" },
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true, slug: true } },
          specifications: { orderBy: { sortOrder: "asc" }, take: 5 },
        },
        orderBy: orderByMap[sort] || { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "FETCH_FAILED", message: "Failed to fetch products" } },
      { status: 500 }
    );
  }
}
