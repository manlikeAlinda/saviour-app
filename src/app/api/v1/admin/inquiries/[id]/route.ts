import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  try {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: parseInt(id) },
      include: { items: { include: { product: { select: { name: true, sku: true, imageUrl: true } } } } },
    });
    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Inquiry not found" } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: inquiry });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "FETCH_FAILED", message: "Failed to fetch inquiry" } },
      { status: 500 }
    );
  }
}
