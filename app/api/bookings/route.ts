import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Booking from "@/models/Booking";
import { bookingSchema } from "@/lib/validations";
import { generateRefId } from "@/lib/utils";
import { formRateLimit } from "@/lib/rateLimit";
import { sendEmail } from "@/lib/email/sendEmail";
import { getAdminNewBookingEmailHtml } from "@/lib/email/adminNewBooking";
import { getCustomerConfirmationEmailHtml } from "@/lib/email/customerConfirmation";
import SiteSettings from "@/models/SiteSettings";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { success } = await formRateLimit.limit(`ratelimit_booking_${ip}`);
    
    if (!success) {
      return NextResponse.json(
        { error: "You can only submit one booking per 24 hours to prevent spam." },
        { status: 429 }
      );
    }

    await connectToDatabase();

    const body = await req.json();
    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const {
      customerName,
      phone,
      altPhone,
      email,
      productType,
      varietyOrPackId,
      varietyOrPackName,
      quantity,
      preferredDate,
      weightSelection,
      deliveryTiming,
      deliveryAddress,
      district,
      notes,
    } = result.data;

    // Generate unique reference ID
    const bookingRefId = generateRefId();

    const booking = await Booking.create({
      bookingRefId,
      customerName,
      phone,
      altPhone,
      email,
      productType,
      varietyOrPackId,
      varietyOrPackName,
      quantity,
      weightSelection,
      preferredDate,
      deliveryTiming,
      deliveryAddress,
      district,
      notes,
      status: "pending",
    });

    // 2. Dispatch Emails
    // Retrieve admin email from settings
    const adminEmailSetting = await SiteSettings.findOne({ key: "contact_email" });
    const adminEmail = adminEmailSetting?.value || "admin@ragugoatform.com";

    // Send Alert to Admin
    sendEmail({
      to: adminEmail,
      subject: `[New Booking] Ref: ${bookingRefId} - ${customerName}`,
      html: getAdminNewBookingEmailHtml(booking),
    }).catch((err) => console.error("Admin Email Error:", err));

    // Send Confirmation to Customer (if email is provided)
    if (email) {
      sendEmail({
        to: email,
        subject: `Your Booking Reservation ${bookingRefId} - Ragu Goat Farm`,
        html: getCustomerConfirmationEmailHtml(booking),
      }).catch((err) => console.error("Customer Email Error:", err));
    }

    return NextResponse.json(
      { message: "Booking created successfully", bookingRefId, id: booking._id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Public Bookings POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}
export const revalidate = 0;
