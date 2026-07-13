import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Banner from "@/models/Banner";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(banners);
  } catch (error: any) {
    console.error("Public Banners API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}
