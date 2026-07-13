import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import FestivalBooking from "@/models/FestivalBooking";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Count all festival bookings that are still pending
    const count = await FestivalBooking.countDocuments({ status: "pending" });

    return NextResponse.json({ count });
  } catch (error: any) {
    console.error("Admin Festival Booking Pending Count GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending festival bookings count" },
      { status: 500 }
    );
  }
}
