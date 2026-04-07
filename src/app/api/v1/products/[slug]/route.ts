import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        brand: true,
        specifications: { orderBy: { sortOrder: "asc" } },
        relatedFrom: {
          include: {
            relatedProduct: {
              select: {
                id: true,
                name: true,
                slug: true,
                sku: true,
                imageUrl: true,
                price: true,
                priceVisibilityMode: true,
                stockStatus: true,
                shortDescription: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Product not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "FETCH_FAILED", message: "Failed to fetch product" } },
      { status: 500 }
    );
  }
}
