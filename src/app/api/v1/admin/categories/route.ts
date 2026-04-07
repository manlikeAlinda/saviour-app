import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export async function GET(_req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "FETCH_FAILED", message: "Failed to fetch categories" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_FAILED", message: "Invalid data", details: parsed.error.flatten() } },
        { status: 422 }
      );
    }

    const data = parsed.data;
    const slug = slugify(data.name);

    const category = await prisma.category.create({
      data: { ...data, slug },
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err?.code === "P2002") {
      return NextResponse.json(
        { success: false, error: { code: "DUPLICATE_NAME", message: "A category with this name already exists" } },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: { code: "CREATE_FAILED", message: "Failed to create category" } },
      { status: 500 }
    );
  }
}
