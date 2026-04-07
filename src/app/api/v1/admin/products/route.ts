import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  categoryId: z.number().int().positive(),
  brandId: z.number().int().positive().optional().nullable(),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  technicalSummary: z.string().optional(),
  price: z.number().positive().optional().nullable(),
  priceVisibilityMode: z.enum(["show_exact_price", "show_starting_from", "hide_price_request_quote"]).default("show_exact_price"),
  stockStatus: z.enum(["in_stock", "limited_availability", "available_on_order", "out_of_stock"]).default("in_stock"),
  stockQuantity: z.number().int().min(0).optional().nullable(),
  minimumOrderQuantity: z.number().int().min(1).default(1),
  unitOfMeasure: z.string().default("pcs"),
  imageUrl: z.string().optional().nullable(),
  datasheetUrl: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
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

export async function GET(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const stockStatus = searchParams.get("stock_status");

    const where: Record<string, unknown> = {};
    if (q) where.OR = [{ name: { contains: q } }, { sku: { contains: q } }];
    if (category) where.categoryId = parseInt(category);
    if (stockStatus) where.stockStatus = stockStatus;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: { name: true } }, brand: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "FETCH_FAILED", message: "Failed to fetch products" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_FAILED", message: "Invalid data", details: parsed.error.flatten() } },
        { status: 422 }
      );
    }

    const data = parsed.data;
    const slug = slugify(data.name);

    const { specifications, ...productData } = data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        slug,
        specifications: specifications
          ? { create: specifications }
          : undefined,
      },
      include: { specifications: true },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err?.code === "P2002") {
      return NextResponse.json(
        { success: false, error: { code: "DUPLICATE_SKU", message: "A product with this SKU already exists" } },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: { code: "CREATE_FAILED", message: "Failed to create product" } },
      { status: 500 }
    );
  }
}
