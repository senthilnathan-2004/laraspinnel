import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");

    const query: any = { isActive: true };

    // Filter by featured
    if (featured === "true") {
      query.isFeatured = true;
    }

    // Filter by category slug
    if (categorySlug && categorySlug !== "all") {
      const categoryDoc = await Category.findOne({ slug: categorySlug, isActive: true });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        // If category is not found, return empty array
        return NextResponse.json([]);
      }
    }

    // Filter by search query
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Prepare sort
    let sortOption: any = { name: 1 };
    if (sort === "price-asc") {
      sortOption = { price: 1 };
    } else if (sort === "price-desc") {
      sortOption = { price: -1 };
    } else if (sort === "latest") {
      sortOption = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sortOption)
      .lean();

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Public Products GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
