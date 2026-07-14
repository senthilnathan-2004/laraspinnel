import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import GoatVariety from "@/models/GoatVariety";
import { goatVarietySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;

    // Parse and validate body
    const body = await req.json();
    const result = goatVarietySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, breed, description, weightRange, ageRange, priceEstimate, tags, images, isFeatured, isActive } = result.data as any;

    const existingGoat = await GoatVariety.findById(id);
    if (!existingGoat) {
      return NextResponse.json({ error: "Goat variety not found" }, { status: 444 });
    }

    // Check slug updates
    let slug = existingGoat.slug;
    if (existingGoat.name !== name) {
      slug = slugify(name);
      const slugExists = await GoatVariety.findOne({ slug, _id: { $ne: id } });
      if (slugExists) {
        slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
      }
    }

    const updatedGoat = await GoatVariety.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true }
    );

    return NextResponse.json(updatedPostForGoat(updatedGoat));
  } catch (error: any) {
    console.error("Admin Goats PUT error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update goat variety" },
      { status: 500 }
    );
  }
}

function updatedPostForGoat(item: any) {
  return item;
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;

    const goat = await GoatVariety.findByIdAndDelete(id);
    if (!goat) {
      return NextResponse.json({ error: "Goat variety not found" }, { status: 444 });
    }

    return NextResponse.json({ message: "Goat variety deleted successfully" });
  } catch (error: any) {
    console.error("Admin Goats DELETE error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete goat variety" },
      { status: 500 }
    );
  }
}
