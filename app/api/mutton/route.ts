import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import MuttonPack from "@/models/MuttonPack";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");

    const query: any = { isActive: true };

    if (featured === "true") {
      query.isFeatured = true;
    }

    const packs = await MuttonPack.find(query).sort({ isFeatured: -1, name: 1 }).lean();
    return NextResponse.json(packs);
  } catch (error: any) {
    console.error("Public Mutton API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch mutton packs" },
      { status: 500 }
    );
  }
}
