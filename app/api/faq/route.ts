import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import FAQ from "@/models/FAQ";

export async function GET() {
  try {
    await connectToDatabase();
    // Only return active FAQs for the public endpoint, sorted by order
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(faqs);
  } catch (error) {
    console.error("GET /api/faq error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
