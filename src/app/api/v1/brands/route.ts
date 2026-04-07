import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
      },
    });
    return NextResponse.json({ success: true, data: brands });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "FETCH_FAILED", message: "Failed to fetch brands" } },
      { status: 500 }
    );
  }
}
