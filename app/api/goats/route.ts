import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import GoatVariety from "@/models/GoatVariety";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");

    const query: any = { isActive: true };

    if (featured === "true") {
      query.isFeatured = true;
    }

    const goats = await GoatVariety.find(query).sort({ isFeatured: -1, name: 1 });
    return NextResponse.json(goats);
  } catch (error: any) {
    console.error("Public Goats API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch live goats" },
      { status: 500 }
    );
  }
}
