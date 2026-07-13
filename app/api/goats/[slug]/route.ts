import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import GoatVariety from "@/models/GoatVariety";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const goat = await GoatVariety.findOne({ slug, isActive: true });

    if (!goat) {
      return NextResponse.json({ error: "Goat variety not found" }, { status: 444 });
    }

    return NextResponse.json(goat);
  } catch (error: any) {
    console.error("Public Goat Slug API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch goat variety details" },
      { status: 500 }
    );
  }
}
