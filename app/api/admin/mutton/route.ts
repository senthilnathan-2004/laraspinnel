import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import MuttonPack from "@/models/MuttonPack";
import { muttonPackSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const packs = await MuttonPack.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(packs);
  } catch (error: any) {
    console.error("Admin Mutton GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch mutton packs" },
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
    const result = muttonPackSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, description, price, weightOptions, districtsAvailable, images, isFeatured, isActive } = result.data as any;

    let slug = slugify(name);
    const existing = await MuttonPack.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const pack = await MuttonPack.create({
      name,
      slug,
      description,
      price,
      weightOptions,
      districtsAvailable,
      images,
      isFeatured,
      isActive,
    });

    return NextResponse.json(pack, { status: 201 });
  } catch (error: any) {
    console.error("Admin Mutton POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create mutton pack" },
      { status: 500 }
    );
  }
}
