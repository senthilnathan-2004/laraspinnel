import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Booking from "@/models/Booking";
import FestivalBooking from "@/models/FestivalBooking";
import ContactMessage from "@/models/ContactMessage";

export const dynamic = "force-dynamic";

/**
 * Single endpoint that returns every sidebar badge count in one round-trip.
 * Replaces four separate /pending-count and /count calls (one auth + one
 * DB connection instead of four), and runs the counts in parallel.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Delivery schedule = active orders for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfDay = new Date(tomorrow);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(tomorrow);
    endOfDay.setHours(23, 59, 59, 999);

    const [bookings, festival, messages, schedule] = await Promise.all([
      Booking.countDocuments({ status: "pending" }),
      FestivalBooking.countDocuments({ status: "pending" }),
      ContactMessage.countDocuments({ status: "new" }),
      Booking.countDocuments({
        preferredDate: { $gte: startOfDay, $lte: endOfDay },
        status: { $ne: "cancelled" },
      }),
    ]);

    return NextResponse.json({ bookings, festival, messages, schedule });
  } catch (error: any) {
    console.error("Admin counts GET error:", error);
    return NextResponse.json({ error: "Failed to fetch counts" }, { status: 500 });
  }
}
