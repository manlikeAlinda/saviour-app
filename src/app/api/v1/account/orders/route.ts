import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/customer-auth";

export async function GET() {
  const { error, session } = await requireCustomer();
  if (error) return error;

  const email = session!.user!.email!;

  const inquiries = await prisma.inquiry.findMany({
    where: { customerEmail: email },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(inquiries);
}
