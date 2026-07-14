import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const images = await GalleryImage.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(images);
  } catch (error: any) {
    console.error("Admin Gallery GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch gallery images" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await req.json();
    const { imageUrl, altText, caption, category, order } = body;

    if (!imageUrl || !altText || !category) {
      return NextResponse.json(
        { error: "Image URL, Alt Text, and Category are required." },
        { status: 400 }
      );
    }

    const image = await GalleryImage.create({
      imageUrl,
      altText,
      caption,
      category,
      order: order || 0,
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error: any) {
    console.error("Admin Gallery POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add gallery image" },
      { status: 500 }
    );
  }
}
