import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Booking from "@/models/Booking";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Count all bookings that are still pending
    const count = await Booking.countDocuments({ status: "pending" });

    return NextResponse.json({ count });
  } catch (error: any) {
    console.error("Admin Booking Pending Count GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending bookings count" },
      { status: 500 }
    );
  }
}
