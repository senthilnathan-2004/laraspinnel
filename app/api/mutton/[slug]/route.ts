import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import MuttonPack from "@/models/MuttonPack";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const pack = await MuttonPack.findOne({ slug, isActive: true }).lean();

    if (!pack) {
      return NextResponse.json({ error: "Mutton pack not found" }, { status: 444 });
    }

    return NextResponse.json(pack);
  } catch (error: any) {
    console.error("Public Mutton Slug API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch mutton pack details" },
      { status: 500 }
    );
  }
}
