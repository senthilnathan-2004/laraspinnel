import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import FestivalBooking from "@/models/FestivalBooking";

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
    }

    await connectToDatabase();

    const result = await FestivalBooking.deleteMany({
      _id: { $in: ids },
    });

    return NextResponse.json({
      message: "Festival bookings deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error bulk deleting festival bookings:", error);
    return NextResponse.json({ error: "Failed to delete festival bookings" }, { status: 500 });
  }
}
