import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireCustomer() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "customer") {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null };
  }
  return { error: null, session };
}
