import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/customer-auth";

export async function GET() {
  const { error, session } = await requireCustomer();
  if (error) return error;

  const customerId = Number((session!.user as { id?: string }).id);
  const items = await prisma.wishlistItem.findMany({
    where: { customerId },
    include: {
      product: {
        select: {
          id: true, name: true, slug: true, imageUrl: true,
          price: true, priceVisibilityMode: true, stockStatus: true, sku: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}

const addSchema = z.object({ productId: z.number().int().positive() });

export async function POST(req: NextRequest) {
  const { error, session } = await requireCustomer();
  if (error) return error;

  const body = await req.json();
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid product id" }, { status: 400 });

  const customerId = Number((session!.user as { id?: string }).id);

  const item = await prisma.wishlistItem.upsert({
    where: { customerId_productId: { customerId, productId: parsed.data.productId } },
    create: { customerId, productId: parsed.data.productId },
    update: {},
  });

  return NextResponse.json(item, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { error, session } = await requireCustomer();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const productId = Number(searchParams.get("productId"));
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const customerId = Number((session!.user as { id?: string }).id);

  await prisma.wishlistItem.deleteMany({ where: { customerId, productId } });
  return NextResponse.json({ success: true });
}
