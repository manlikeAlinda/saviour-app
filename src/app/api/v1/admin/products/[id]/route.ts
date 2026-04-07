import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  categoryId: z.number().int().positive().optional(),
  brandId: z.number().int().positive().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  fullDescription: z.string().optional().nullable(),
  technicalSummary: z.string().optional().nullable(),
  price: z.number().positive().optional().nullable(),
  priceVisibilityMode: z.enum(["show_exact_price", "show_starting_from", "hide_price_request_quote"]).optional(),
  stockStatus: z.enum(["in_stock", "limited_availability", "available_on_order", "out_of_stock"]).optional(),
  stockQuantity: z.number().int().min(0).optional().nullable(),
  minimumOrderQuantity: z.number().int().min(1).optional(),
  unitOfMeasure: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  datasheetUrl: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  weightGrams: z.number().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  specifications: z.array(z.object({
    specName: z.string(),
    specValue: z.string(),
    specUnit: z.string().optional().nullable(),
    sortOrder: z.number().int().default(0),
  })).optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        brand: true,
        specifications: { orderBy: { sortOrder: "asc" } },
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_FAILED", message: "Invalid data", details: parsed.error.flatten() } },
        { status: 422 }
      );
    }

    const { specifications, ...productData } = parsed.data;

    // Replace specifications if provided
    if (specifications !== undefined) {
      await prisma.productSpecification.deleteMany({ where: { productId: parseInt(id) } });
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...productData,
        specifications: specifications
          ? { create: specifications }
          : undefined,
      },
      include: { specifications: true },
    });

    return NextResponse.json({ success: true, data: product });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_FAILED", message: "Failed to update product" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  try {
    await prisma.product.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true, message: "Product deactivated" });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "DELETE_FAILED", message: "Failed to deactivate product" } },
      { status: 500 }
    );
  }
}
