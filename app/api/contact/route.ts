import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { contactMessageSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rateLimit";
import { sendEmail } from "@/lib/email/sendEmail";
import { getAdminNewContactEmailHtml } from "@/lib/email/adminNewContact";
import { getCustomerContactConfirmationEmailHtml } from "@/lib/email/customerContactConfirmation";
import SiteSettings from "@/models/SiteSettings";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const limiter = rateLimit(ip, 5, 60 * 1000); // 5 contacts/min limit
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    await connectToDatabase();

    const body = await req.json();
    const result = contactMessageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, phone, email, subject, message } = result.data;

    const contact = await ContactMessage.create({
      name,
      phone,
      email,
      subject,
      message,
      status: "new",
    });

    // 2. Dispatch Emails
    // Retrieve admin email from settings
    const adminEmailSetting = await SiteSettings.findOne({ key: "contact_email" });
    const adminEmail = adminEmailSetting?.value || "admin@ragugoatfarm.com";

    // Send Alert to Admin
    sendEmail({
      to: adminEmail,
      subject: `[New Contact Inquiry] Sub: ${subject} - ${name}`,
      html: getAdminNewContactEmailHtml(contact),
    }).catch((err) => console.error("Admin Email Error:", err));

    // Send Confirmation to Customer
    if (email) {
      sendEmail({
        to: email,
        subject: `We've received your message - Ragu Goat Farm`,
        html: getCustomerContactConfirmationEmailHtml(contact),
      }).catch((err) => console.error("Customer Email Error:", err));
    }

    return NextResponse.json(
      { message: "Contact message submitted successfully", id: contact._id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Public Contact POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit message" },
      { status: 500 }
    );
  }
}
export const revalidate = 0;
