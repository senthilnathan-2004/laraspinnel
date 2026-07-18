import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Testimonial from "@/models/Testimonial";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Allow public access to GET testimonials if they want to fetch it on frontend
    // Parse query params
    const url = new URL(req.url);
    const activeOnly = url.searchParams.get("activeOnly") === "true";
    
    const query = activeOnly ? { isActive: true } : {};

    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json(testimonials);
  } catch (error: any) {
    console.error("Testimonials GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
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

    const { name, location, goal, outcome, rating, refId, isActive } = body;

    if (!name || !location || !goal || !outcome) {
      return NextResponse.json(
        { error: "Name, location, goal, and outcome are required" },
        { status: 400 }
      );
    }

    // Auto-generate initial
    const initial = name.charAt(0).toUpperCase();

    const newTestimonial = await Testimonial.create({
      name,
      location,
      goal,
      outcome,
      initial,
      rating: Number(rating) || 5,
      refId: refId || "ADMIN-CREATED",
      isActive: isActive !== undefined ? isActive : true,
    });

    const { revalidatePath } = require("next/cache");
    revalidatePath("/");

    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error: any) {
    console.error("Testimonial POST error:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
