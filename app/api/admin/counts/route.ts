import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import ContactMessage from "@/models/ContactMessage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const [orders, messages] = await Promise.all([
      Order.countDocuments({ status: "pending" }),
      ContactMessage.countDocuments({ status: "new" }),
    ]);

    return NextResponse.json({ orders, messages });
  } catch (error: any) {
    console.error("Admin counts GET error:", error);
    return NextResponse.json({ error: "Failed to fetch counts" }, { status: 500 });
  }
}
