import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Category from "@/models/Category";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean();
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("Public Categories GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
export const revalidate = 60;
