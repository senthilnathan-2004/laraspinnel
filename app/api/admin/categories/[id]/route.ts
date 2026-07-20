import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { categorySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { deleteImageByUrl } from "@/lib/imagekit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;
    const category = await Category.findById(id).lean();

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error: any) {
    console.error("Admin Category Detail GET error:", error);
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;

    const body = await req.json();
    const result = categorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, description, image, isActive } = result.data;
    const slug = slugify(name);

    // Verify slug uniqueness (excluding current)
    const existing = await Category.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      return NextResponse.json(
        { error: "A category with this name already exists." },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug, description, image, isActive },
      { new: true }
    );

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error: any) {
    console.error("Admin Category PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;

    // Check if category is used by products
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category because it has ${productCount} associated products. Remove or reassign them first.` },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Free up ImageKit storage — best-effort, never blocks the delete response.
    if (category.image) {
      await deleteImageByUrl(category.image).catch((err) =>
        console.error("Failed to delete category image from ImageKit:", err)
      );
    }

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    console.error("Admin Category DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
export const revalidate = 0;
