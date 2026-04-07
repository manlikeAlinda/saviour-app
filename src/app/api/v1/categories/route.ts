import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
      },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "FETCH_FAILED", message: "Failed to fetch categories" } },
      { status: 500 }
    );
  }
}
