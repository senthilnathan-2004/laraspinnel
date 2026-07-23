import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import SiteSettings from "@/models/SiteSettings";
import { rateLimit } from "@/lib/rateLimit";
import { generateRefId } from "@/lib/utils";
import { sendEmail } from "@/lib/email/sendEmail";
import { getAdminNewContactEmailHtml } from "@/lib/email/adminNewContact";

export const dynamic = "force-dynamic";

// Public endpoint — customers submit a made-to-order request from /custom-order.
// It lands in the admin Orders page as a pending order with orderType "custom";
// price is 0 until the admin confirms a quote with the customer.
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { success } = rateLimit(`custom_order_${ip}`, 3, 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    await connectToDatabase();
    const body = await req.json();
    const {
      name,
      phone,
      email,
      category,
      categoryImage,
      occasion,
      colors,
      size,
      quantity,
      personalization,
      requirements,
      date,
      cityPin,
      notes,
      images,
    } = body;

    if (!name || !phone || !category) {
      return NextResponse.json(
        { error: "Name, phone, and product category are required" },
        { status: 400 }
      );
    }
    if (!/^\d{10}$/.test(String(phone).replace(/[^\d]/g, "").slice(-10))) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit phone number" },
        { status: 400 }
      );
    }

    const clean = (value: unknown, max: number) =>
      typeof value === "string" ? value.trim().slice(0, max) : "";

    // Only accept image URLs from our own ImageKit uploads
    const safeImages = (Array.isArray(images) ? images : [])
      .filter((u: unknown): u is string => typeof u === "string" && u.startsWith("https://ik.imagekit.io/"))
      .slice(0, 4);
    const safeCategoryImage =
      typeof categoryImage === "string" &&
      (categoryImage.startsWith("https://ik.imagekit.io/") || categoryImage.startsWith("/"))
        ? categoryImage
        : "";

    const colorList = (Array.isArray(colors) ? colors : [])
      .map((c: unknown) => clean(c, 40))
      .filter(Boolean)
      .slice(0, 10);

    const quantityLabel = clean(quantity, 20) || "1";
    const numericQty = /^\d+$/.test(quantityLabel)
      ? Math.min(99, parseInt(quantityLabel, 10))
      : 6; // "More than 5"

    // All request details live in the order's notes — shown on the admin detail page
    const composedNotes = [
      "CUSTOM ORDER REQUEST",
      occasion && `Occasion: ${clean(occasion, 60)}`,
      colorList.length > 0 && `Preferred colors: ${colorList.join(", ")}`,
      size && `Size: ${clean(size, 60)}`,
      `Quantity: ${quantityLabel}`,
      personalization && `Personalization: ${clean(personalization, 300)}`,
      requirements && `Special requirements: ${clean(requirements, 500)}`,
      date && `Preferred delivery date: ${clean(date, 20)}`,
      notes && `Additional notes: ${clean(notes, 500)}`,
      safeImages.length > 0 && `Reference images:\n${safeImages.join("\n")}`,
    ]
      .filter(Boolean)
      .join("\n");

    const orderNumber = generateRefId();
    const cleanName = clean(name, 80);
    const cleanCityPin = clean(cityPin, 80);

    const order = await Order.create({
      orderNumber,
      customerName: cleanName,
      phone: clean(phone, 20),
      email: clean(email, 120) || undefined,
      address: "Custom order — address to be confirmed",
      city: cleanCityPin || "To be confirmed",
      pincode: cleanCityPin.match(/\d{6}/)?.[0] || "-",
      // notes holds only the customer's own words; the rest is structured below
      notes: clean(notes, 500) || undefined,
      customDetails: {
        occasion: clean(occasion, 60) || undefined,
        colors: colorList.length > 0 ? colorList : undefined,
        size: clean(size, 60) || undefined,
        quantityLabel,
        personalization: clean(personalization, 300) || undefined,
        requirements: clean(requirements, 500) || undefined,
        preferredDate: clean(date, 20) || undefined,
        customerNote: clean(notes, 500) || undefined,
      },
      items: [
        {
          name: `Custom Order — ${clean(category, 80)}`,
          price: 0,
          quantity: numericQty,
          image: safeCategoryImage || "/logo.png",
          customText: clean(personalization, 300) || undefined,
          customImage: safeImages[0] || undefined,
        },
      ],
      subtotal: 0,
      deliveryFee: 0,
      totalAmount: 0,
      status: "pending",
      orderType: "custom",
      referenceImages: safeImages.length > 0 ? safeImages : undefined,
    });

    // Notify the shop owner — best-effort, never blocks the response
    try {
      const settingsList = await SiteSettings.find({ key: "contact_email" }).lean();
      const contactEmail = settingsList[0]?.value;
      if (contactEmail) {
        await sendEmail({
          to: contactEmail,
          subject: `New Custom Order Request: ${orderNumber}`,
          html: getAdminNewContactEmailHtml({
            name: cleanName,
            email: clean(email, 120),
            phone: clean(phone, 20),
            subject: `Custom Order Request (${orderNumber})`,
            message: composedNotes,
          }),
        });
      }
    } catch (err) {
      console.error("Custom order admin notification failed to send:", err);
    }

    return NextResponse.json(
      { message: "Custom order request received", orderNumber, id: order._id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Public custom-order POST error:", error);
    return NextResponse.json(
      { error: "Failed to submit your request. Please try again." },
      { status: 500 }
    );
  }
}
