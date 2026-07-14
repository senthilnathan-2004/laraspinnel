import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import GoatVariety from "@/models/GoatVariety";
import { goatVarietySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const goats = await GoatVariety.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(goats);
  } catch (error: any) {
    console.error("Admin Goats GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch goat varieties" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate admin
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // 2. Parse and validate body
    const body = await req.json();
    const result = goatVarietySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, breed, description, weightRange, ageRange, priceEstimate, tags, images, isFeatured, isActive } = result.data as any;

    // 3. Generate slug & check if exists
    let slug = slugify(name);
    const existing = await GoatVariety.findOne({ slug });
    if (existing) {
      // Append random suffix if slug duplicate
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    // 4. Create document
    const goat = await GoatVariety.create({
      name,
      slug,
      breed,
      description,
      weightRange,
      ageRange,
      priceEstimate,
      tags,
      images,
      isFeatured,
      isActive,
    });

    return NextResponse.json(goat, { status: 201 });
  } catch (error: any) {
    console.error("Admin Goats POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create goat variety" },
      { status: 500 }
    );
  }
}
