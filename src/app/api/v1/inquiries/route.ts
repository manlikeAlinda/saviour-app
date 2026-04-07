import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateInquiryReference } from "@/lib/utils";
import { generateWhatsAppMessage, generateWhatsAppUrl } from "@/lib/whatsapp";

const inquirySchema = z.object({
  customer_name: z.string().min(2),
  customer_phone: z.string().min(7),
  customer_email: z.string().email().optional().or(z.literal("")),
  delivery_location: z.string().min(2),
  delivery_method: z.enum([
    "pickup",
    "courier",
    "boda_delivery",
    "third_party_logistics",
    "discuss_on_whatsapp",
  ]),
  inquiry_notes: z.string().optional(),
  items: z
    .array(
      z.object({
        product_id: z.number().int().positive(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_FAILED",
            message: "Invalid inquiry data",
            details: parsed.error.flatten(),
          },
        },
        { status: 422 }
      );
    }

    const data = parsed.data;

    // Fetch products to snapshot
    const productIds = data.items.map((i) => i.product_id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate all products exist
    for (const item of data.items) {
      if (!productMap.has(item.product_id)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "PRODUCT_NOT_FOUND",
              message: `Product ID ${item.product_id} not found or inactive`,
            },
          },
          { status: 422 }
        );
      }
    }

    const inquiryReference = generateInquiryReference();

    // Build WhatsApp message
    const whatsappMessage = generateWhatsAppMessage({
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      customerEmail: data.customer_email || undefined,
      deliveryLocation: data.delivery_location,
      deliveryMethod: data.delivery_method,
      inquiryNotes: data.inquiry_notes,
      inquiryReference,
      items: data.items.map((item) => {
        const product = productMap.get(item.product_id)!;
        return {
          name: product.name,
          sku: product.sku,
          quantity: item.quantity,
        };
      }),
    });

    // Calculate subtotal (only for products with visible prices)
    let subtotalAmount = 0;
    let hasAnyPrice = false;
    for (const item of data.items) {
      const product = productMap.get(item.product_id)!;
      if (product.price && product.priceVisibilityMode === "show_exact_price") {
        subtotalAmount += product.price * item.quantity;
        hasAnyPrice = true;
      }
    }

    // Create inquiry in database FIRST
    const inquiry = await prisma.inquiry.create({
      data: {
        inquiryReference,
        customerName: data.customer_name,
        customerPhone: data.customer_phone,
        customerEmail: data.customer_email || null,
        deliveryLocation: data.delivery_location,
        deliveryMethod: data.delivery_method,
        inquiryNotes: data.inquiry_notes || null,
        whatsappMessageSnapshot: whatsappMessage,
        subtotalAmount: hasAnyPrice ? subtotalAmount : null,
        status: "new",
        sourceChannel: "website_whatsapp_checkout",
        items: {
          create: data.items.map((item) => {
            const product = productMap.get(item.product_id)!;
            return {
              productId: product.id,
              productNameSnapshot: product.name,
              skuSnapshot: product.sku,
              priceSnapshot:
                product.priceVisibilityMode === "show_exact_price"
                  ? product.price
                  : null,
              quantity: item.quantity,
              stockStatusSnapshot: product.stockStatus,
            };
          }),
        },
      },
    });

    const whatsappUrl = generateWhatsAppUrl(whatsappMessage);

    return NextResponse.json({
      success: true,
      data: {
        inquiry_reference: inquiry.inquiryReference,
        whatsapp_url: whatsappUrl,
        status: inquiry.status,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INQUIRY_CREATE_FAILED",
          message: "Unable to create inquiry at this time.",
        },
      },
      { status: 500 }
    );
  }
}
