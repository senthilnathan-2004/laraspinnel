import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const product = await Product.findOne({ slug, isActive: true })
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Fetch related products (same category, active, excluding this one)
    const relatedProducts = await Product.find({
      category: product.category._id,
      slug: { $ne: slug },
      isActive: true,
    })
      .limit(4)
      .lean();

    return NextResponse.json({ product, relatedProducts });
  } catch (error: any) {
    console.error("Public Product Detail GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}
export const revalidate = 10;
