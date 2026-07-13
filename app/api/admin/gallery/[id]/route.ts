import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;

    const body = await req.json();
    const { imageUrl, altText, caption, category, order } = body;

    const updatedImage = await GalleryImage.findByIdAndUpdate(
      id,
      { imageUrl, altText, caption, category, order },
      { new: true }
    );

    if (!updatedImage) {
      return NextResponse.json({ error: "Gallery image not found" }, { status: 444 });
    }

    return NextResponse.json(updatedImage);
  } catch (error: any) {
    console.error("Admin Gallery PUT error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update gallery image" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;

    const image = await GalleryImage.findByIdAndDelete(id);
    if (!image) {
      return NextResponse.json({ error: "Gallery image not found" }, { status: 444 });
    }

    return NextResponse.json({ message: "Gallery image deleted successfully" });
  } catch (error: any) {
    console.error("Admin Gallery DELETE error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete gallery image" },
      { status: 500 }
    );
  }
}
