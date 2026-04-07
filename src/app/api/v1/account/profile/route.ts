import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/customer-auth";

export async function GET() {
  const { error, session } = await requireCustomer();
  if (error) return error;

  const customer = await prisma.customer.findUnique({
    where: { id: Number((session!.user as { id?: string }).id) },
    select: { id: true, fullName: true, email: true, phone: true, createdAt: true },
  });

  return NextResponse.json(customer);
}

const updateSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
});

export async function PUT(req: NextRequest) {
  const { error, session } = await requireCustomer();
  if (error) return error;

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { fullName, phone, currentPassword, newPassword } = parsed.data;
  const customerId = Number((session!.user as { id?: string }).id);

  const updateData: Record<string, unknown> = {};
  if (fullName) updateData.fullName = fullName;
  if (phone !== undefined) updateData.phone = phone;

  if (newPassword && currentPassword) {
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    const valid = await bcrypt.compare(currentPassword, customer!.passwordHash);
    if (!valid) return NextResponse.json({ error: "Current password incorrect" }, { status: 400 });
    updateData.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  const updated = await prisma.customer.update({
    where: { id: customerId },
    data: updateData,
    select: { id: true, fullName: true, email: true, phone: true },
  });

  return NextResponse.json(updated);
}
