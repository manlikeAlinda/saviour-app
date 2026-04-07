import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const statusSchema = z.object({
  status: z.enum([
    "new",
    "contacted",
    "quoted",
    "awaiting_customer",
    "confirmed",
    "shipped",
    "completed",
    "cancelled",
  ]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_FAILED", message: "Invalid status" } },
        { status: 422 }
      );
    }

    const inquiry = await prisma.inquiry.update({
      where: { id: parseInt(id) },
      data: { status: parsed.data.status },
    });

    return NextResponse.json({ success: true, data: inquiry });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_FAILED", message: "Failed to update status" } },
      { status: 500 }
    );
  }
}
