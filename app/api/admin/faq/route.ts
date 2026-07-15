import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import FAQ from "@/models/FAQ";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    // Admin gets all FAQs
    const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(faqs);
  } catch (error) {
    console.error("GET /api/admin/faq error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { question, answer, order, isActive } = body;

    if (!question || !answer) {
      return NextResponse.json({ error: "Question and Answer are required" }, { status: 400 });
    }

    await connectToDatabase();

    const newFaq = await FAQ.create({
      question,
      answer,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    const { revalidatePath } = require("next/cache");
    revalidatePath("/faq");

    return NextResponse.json(newFaq, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/faq error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
