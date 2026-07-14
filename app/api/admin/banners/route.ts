import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Banner from "@/models/Banner";
import { bannerSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(banners);
  } catch (error: any) {
    console.error("Admin Banners GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch banners" },
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
    const result = bannerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { imageUrl, headline, subtext, buttonText, buttonLink, buttonTheme, order, isActive } = result.data;

    const banner = await Banner.create({
      imageUrl,
      headline,
      subtext,
      buttonText,
      buttonLink,
      buttonTheme,
      order,
      isActive,
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error: any) {
    console.error("Admin Banners POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create banner" },
      { status: 500 }
    );
  }
}
