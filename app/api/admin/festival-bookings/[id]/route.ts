import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import FestivalBooking from "@/models/FestivalBooking";
import { sendEmail } from "@/lib/email/sendEmail";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const booking = await FestivalBooking.findById(params.id);

    if (!booking) {
      return NextResponse.json({ error: "Festival booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error("Festival Booking GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch festival booking details" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { status, adminNotes } = body;

    const existingBooking = await FestivalBooking.findById(params.id);
    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const updatedBooking = await FestivalBooking.findByIdAndUpdate(
      params.id,
      { $set: { status, adminNotes } },
      { new: true }
    );
    
    if (!updatedBooking) {
       return NextResponse.json({ error: "Booking could not be updated" }, { status: 500 });
    }

    // Send email notification on status change to customer if they provided an email
    if (existingBooking.status !== status && updatedBooking.email) {
      let subject = "";
      let message = "";

      if (status === "confirmed") {
        subject = `Festival Order Confirmed - ${updatedBooking.bookingRefId}`;
        message = `Good news! Your festival goat order (${updatedBooking.bookingRefId}) has been confirmed. We will ensure delivery as requested.`;
      } else if (status === "completed") {
        subject = `Festival Order Completed - ${updatedBooking.bookingRefId}`;
        message = `Your festival goat order (${updatedBooking.bookingRefId}) has been successfully completed. Thank you for choosing Ragu Farm!`;
      } else if (status === "cancelled") {
        subject = `Festival Order Cancelled - ${updatedBooking.bookingRefId}`;
        message = `Your festival goat order (${updatedBooking.bookingRefId}) has been cancelled. If you have questions, please contact us.`;
      }

      if (subject && message) {
        const html = `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>${subject}</h2>
            <p>Dear ${updatedBooking.customerName},</p>
            <p>${message}</p>
            ${adminNotes && status === "cancelled" ? `<p><strong>Reason/Note:</strong> ${adminNotes}</p>` : ""}
            <p>Thanks,<br/>Ragu Farm Team</p>
          </div>
        `;
        await sendEmail({
          to: updatedBooking.email,
          subject,
          html,
        });
      }
    }

    return NextResponse.json(updatedBooking);
  } catch (error: any) {
    console.error("Festival Booking PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update festival booking" },
      { status: 500 }
    );
  }
}
