import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const products = await Product.find({})
      .populate("category", "name slug")
      .sort({ name: 1 })
      .lean();
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Admin Products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
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
    const result = productSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, category, price, discountPrice, description, images, stock, isFeatured, isActive } = result.data;
    const slug = slugify(name);

    // Verify slug uniqueness
    const existing = await Product.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "A product with this name already exists." },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      slug,
      category,
      price,
      discountPrice,
      description,
      images,
      stock,
      isFeatured,
      isActive,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Admin Product POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
export const revalidate = 0;
