import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import Booking from "@/models/Booking";
import FestivalBooking from "@/models/FestivalBooking";
import { formRateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { success } = await formRateLimit.limit(`ratelimit_review_${ip}`);
    
    if (!success) {
      return NextResponse.json(
        { error: "You can only submit one review per 24 hours. Please try again later." },
        { status: 429 }
      );
    }

    await connectToDatabase();
    const body = await req.json();
    const { name, location, goal, outcome, rating, refId } = body;

    if (!name || !location || !goal || !outcome || !rating || !refId) {
      return NextResponse.json({ error: "All fields including rating and Order Ref ID are required" }, { status: 400 });
    }

    // Verify the refId exists in either Booking or FestivalBooking
    const bookingMatch = await Booking.findOne({ bookingRefId: refId });
    const festivalMatch = await FestivalBooking.findOne({ bookingRefId: refId });

    if (!bookingMatch && !festivalMatch) {
      return NextResponse.json({ error: "Invalid Order Reference ID. Please enter a valid ref ID from your booking." }, { status: 400 });
    }

    // Automatically calculate initial
    const initial = name.charAt(0).toUpperCase();

    // Create new testimonial, force isActive to false (pending approval)
    const newTestimonial = new Testimonial({
      name,
      location,
      goal,
      outcome,
      initial,
      rating: Number(rating),
      refId,
      isActive: false, 
    });

    await newTestimonial.save();
    return NextResponse.json({ success: true, message: "Review submitted successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Testimonial submission error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
