import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { sendEmail } from "@/lib/email/sendEmail";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { replyText } = await request.json();
    if (!replyText || replyText.trim() === "") {
      return NextResponse.json({ error: "Reply text is required" }, { status: 400 });
    }

    await connectToDatabase();
    
    const resolvedParams = await params;
    const message = await ContactMessage.findById(resolvedParams.id);
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (!message.email) {
      return NextResponse.json({ error: "Client has no email address" }, { status: 400 });
    }

    // Send email using sendEmail helper
    const emailHtml = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
        <h2>Reply from Lara's Pinnal</h2>
        <p>Dear ${message.name},</p>
        <div style="padding: 16px; background-color: #f7f7f7; border-radius: 8px; margin: 16px 0; white-space: pre-wrap;">${replyText}</div>
        <br />
        <p><em>In response to your message:</em></p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 16px; color: #666;">
          <strong>${message.subject}</strong><br />
          ${message.message}
        </blockquote>
        <br />
        <p>Best regards,<br/>Lara's Pinnal Team</p>
      </div>
    `;

    const emailRes = await sendEmail({
      to: message.email,
      subject: `Re: ${message.subject} - Lara's Pinnal`,
      html: emailHtml
    });

    if (!emailRes.success) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    // Update message status to responded and store reply history
    message.status = "responded";
    if (!message.replies) {
      message.replies = [];
    }
    message.replies.push({ text: replyText, date: new Date() });
    
    await message.save();

    return NextResponse.json({ success: true, message: "Reply sent successfully", reply: { text: replyText, date: new Date() } });
  } catch (error: any) {
    console.error("Error replying to message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
