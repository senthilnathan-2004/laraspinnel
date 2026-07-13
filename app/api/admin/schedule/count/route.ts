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
    
    // Default to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const startOfDay = new Date(tomorrow);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(tomorrow);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Count active orders for tomorrow
    const count = await Booking.countDocuments({ 
      preferredDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $ne: "cancelled" }
    });

    return NextResponse.json({ count });
  } catch (error: any) {
    console.error("Admin Schedule Count GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule count" },
      { status: 500 }
    );
  }
}
