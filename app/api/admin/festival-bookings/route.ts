import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import FestivalBooking from "@/models/FestivalBooking";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");

    const query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const bookings = await FestivalBooking.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("Admin Festival Bookings GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch festival bookings" },
      { status: 500 }
    );
  }
}
