import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/utils";

const brandSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  logoUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export async function GET(_req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json({ success: true, data: brands });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "FETCH_FAILED", message: "Failed to fetch brands" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = brandSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_FAILED", message: "Invalid data", details: parsed.error.flatten() } },
        { status: 422 }
      );
    }

    const data = parsed.data;
    const slug = slugify(data.name);

    const brand = await prisma.brand.create({ data: { ...data, slug } });
    return NextResponse.json({ success: true, data: brand }, { status: 201 });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err?.code === "P2002") {
      return NextResponse.json(
        { success: false, error: { code: "DUPLICATE_NAME", message: "A brand with this name already exists" } },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: { code: "CREATE_FAILED", message: "Failed to create brand" } },
      { status: 500 }
    );
  }
}
