import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Booking from "@/models/Booking";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;

    const body = await req.json();
    const { status, adminNotes } = body;

    const updatedFields: any = {};
    if (status) {
      if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
        return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
      }
      updatedFields.status = status;
    }
    if (adminNotes !== undefined) {
      updatedFields.adminNotes = adminNotes;
    }

    const oldBooking = await Booking.findById(id);
    if (!oldBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 444 });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 444 });
    }

    // If status changed and customer has an email address, send them an update notification email
    if (status && status !== oldBooking.status && updatedBooking.email) {
      try {
        const { sendEmail } = await import("@/lib/email/sendEmail");
        const { getCustomerStatusUpdateEmailHtml } = await import("@/lib/email/customerStatusUpdate");

        await sendEmail({
          to: updatedBooking.email,
          subject: `Update on Booking Reservation ${updatedBooking.bookingRefId} - Ragu Goat Farm`,
          html: getCustomerStatusUpdateEmailHtml(updatedBooking),
        });
      } catch (err) {
        console.error("Failed to send status update email:", err);
      }
    }

    return NextResponse.json(updatedBooking);
  } catch (error: any) {
    console.error("Admin Bookings PUT error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update booking" },
      { status: 500 }
    );
  }
}
