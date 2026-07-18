import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import FestivalBooking from "@/models/FestivalBooking";
import { festivalBookingSchema } from "@/lib/validations";
import { sendEmail } from "@/lib/email/sendEmail";
import { adminNewFestivalBookingTemplate } from "@/lib/email/adminNewFestivalBooking";
import { customerFestivalConfirmationTemplate } from "@/lib/email/customerFestivalConfirmation";
import SiteSettings from "@/models/SiteSettings";
import { formRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { success } = await formRateLimit.limit(`ratelimit_festival_${ip}`);
    
    if (!success) {
      return NextResponse.json(
        { error: "You can only submit one festival booking per 24 hours. Please contact us for larger orders." },
        { status: 429 }
      );
    }

    await connectToDatabase();
    const body = await req.json();

    // Validate request body
    const validatedData = festivalBookingSchema.parse(body);

    // Generate unique booking reference (e.g. FST-240101-XXXX)
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingRefId = `FST-${dateStr}-${randomChars}`;

    const newBooking = await FestivalBooking.create({
      ...validatedData,
      bookingRefId,
    });

    // Fetch site settings for email (admin email and farm name)
    const settingsList = await SiteSettings.find({
      key: { $in: ["contact_email", "farm_name"] }
    });
    
    const settings = settingsList.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    const adminEmail = settings.contact_email || process.env.ADMIN_EMAIL;

    // Send Admin Notification Email (Fire and forget)
    if (adminEmail) {
      sendEmail({
        to: adminEmail,
        subject: `New Festival Booking Request - ${bookingRefId}`,
        html: adminNewFestivalBookingTemplate(newBooking)
      }).catch((err) => console.error("Admin Email Error:", err));
    }

    // Send Customer Confirmation Email (if email was provided)
    if (validatedData.email) {
      sendEmail({
        to: validatedData.email,
        subject: `Festival Order Received - ${bookingRefId}`,
        html: customerFestivalConfirmationTemplate(newBooking, settings)
      }).catch((err) => console.error("Customer Email Error:", err));
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Festival booking submitted successfully",
        bookingRefId 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Festival Booking POST error:", error);

    // Zod validation error handling
    if (error.name === "ZodError") {
      const firstError = error.errors[0]?.message || "Validation failed";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to submit festival booking" },
      { status: 500 }
    );
  }
}
