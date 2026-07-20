import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Banner from "@/models/Banner";
import { bannerSchema } from "@/lib/validations";
import { deleteImageByUrl } from "@/lib/imagekit";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;

    const body = await req.json();
    const result = bannerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { imageUrl, headline, subtext, buttonText, buttonLink, buttonTheme, order, isActive } = result.data;

    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      {
        imageUrl,
        headline,
        subtext,
        buttonText,
        buttonLink,
        buttonTheme,
        order,
        isActive,
      },
      { new: true }
    );

    if (!updatedBanner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 444 });
    }

    return NextResponse.json(updatedBanner);
  } catch (error: any) {
    console.error("Admin Banners PUT error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update banner" },
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

    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 444 });
    }

    // Free up ImageKit storage — best-effort, never blocks the delete response.
    if (banner.imageUrl) {
      await deleteImageByUrl(banner.imageUrl).catch((err) =>
        console.error("Failed to delete banner image from ImageKit:", err)
      );
    }

    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (error: any) {
    console.error("Admin Banners DELETE error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete banner" },
      { status: 500 }
    );
  }
}
