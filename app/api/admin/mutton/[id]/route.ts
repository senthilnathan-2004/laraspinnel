import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import MuttonPack from "@/models/MuttonPack";
import { muttonPackSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;

    const body = await req.json();
    const result = muttonPackSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, description, price, weightOptions, districtsAvailable, images, isFeatured, isActive } = result.data as any;

    const existingPack = await MuttonPack.findById(id);
    if (!existingPack) {
      return NextResponse.json({ error: "Mutton pack not found" }, { status: 444 });
    }

    let slug = existingPack.slug;
    if (existingPack.name !== name) {
      slug = slugify(name);
      const slugExists = await MuttonPack.findOne({ slug, _id: { $ne: id } });
      if (slugExists) {
        slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
      }
    }

    const updatedPack = await MuttonPack.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        description,
        price,
        weightOptions,
        districtsAvailable,
        images,
        isFeatured,
        isActive,
      },
      { new: true }
    );

    return NextResponse.json(updatedPack);
  } catch (error: any) {
    console.error("Admin Mutton PUT error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update mutton pack" },
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

    const pack = await MuttonPack.findByIdAndDelete(id);
    if (!pack) {
      return NextResponse.json({ error: "Mutton pack not found" }, { status: 444 });
    }

    return NextResponse.json({ message: "Mutton pack deleted successfully" });
  } catch (error: any) {
    console.error("Admin Mutton DELETE error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete mutton pack" },
      { status: 500 }
    );
  }
}
