import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Category from "@/models/Category";
import { categorySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const categories = await Category.find({}).sort({ name: 1 }).lean();
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("Admin Categories GET error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
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
    const result = categorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, description, image, isActive } = result.data;
    const slug = slugify(name);

    // Verify slug uniqueness
    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "A category with this name already exists." },
        { status: 400 }
      );
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      isActive,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("Admin Category POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
  }
}
export const revalidate = 0;
