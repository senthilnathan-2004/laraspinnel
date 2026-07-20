import { NextRequest, NextResponse } from "next/server";
import { uploadImageToImageKit, deleteImageByUrl } from "@/lib/imagekit";
import { rateLimit } from "@/lib/rateLimit";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

// Public endpoint — customers use this to attach a reference image to their
// order customization request (e.g. a photo to recreate, a color swatch).
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { success } = rateLimit(`customer_upload_${ip}`, 10, 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: "Too many uploads. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Allowed: JPEG, PNG, WebP, AVIF, GIF." },
        { status: 415 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5 MB." },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await uploadImageToImageKit(
      buffer,
      file.name || `customization_${Date.now()}`,
      "laraspinnal/customer-uploads"
    );

    return NextResponse.json({
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch (error: any) {
    console.error("Customer upload route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}

// Lets a customer remove a reference image they just uploaded (before placing
// the order) without leaving an orphaned file sitting in ImageKit storage.
export async function DELETE(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { success } = rateLimit(`customer_upload_delete_${ip}`, 20, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
    }

    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "No image URL provided" }, { status: 400 });
    }

    await deleteImageByUrl(url);

    return NextResponse.json({ message: "Image deleted" });
  } catch (error: any) {
    console.error("Customer upload DELETE route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete image" },
      { status: 500 }
    );
  }
}
