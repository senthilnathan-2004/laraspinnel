import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const query: any = {};
    if (category && category !== "All") {
      query.category = category.toLowerCase();
    }

    const images = await GalleryImage.find(query).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(images);
  } catch (error: any) {
    console.error("Public Gallery API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery images" },
      { status: 500 }
    );
  }
}
