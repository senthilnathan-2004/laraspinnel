import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { orderSchema } from "@/lib/validations";
import { generateRefId } from "@/lib/utils";
import { formRateLimit } from "@/lib/rateLimit";
import SiteSettings from "@/models/SiteSettings";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { success } = await formRateLimit.limit(`ratelimit_order_${ip}`);
    
    if (!success) {
      return NextResponse.json(
        { error: "Too many checkout requests. Please wait before ordering again." },
        { status: 429 }
      );
    }

    await connectToDatabase();

    const body = await req.json();
    const result = orderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { customerName, phone, address, city, pincode, notes, items } = result.data;

    // Verify stock and update product quantities in a loop/transaction
    let totalAmount = 0;
    const finalItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Product '${item.name}' is no longer available.` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for '${item.name}'. Available: ${product.stock}` },
          { status: 400 }
        );
      }

      const price = product.discountPrice || product.price;
      totalAmount += price * item.quantity;

      finalItems.push({
        productId: product._id,
        name: product.name,
        price: price,
        quantity: item.quantity,
        image: product.images[0] || "",
        customText: item.customText?.trim() || undefined,
      });
    }

    // Generate unique order number
    const orderNumber = generateRefId();

    const order = await Order.create({
      orderNumber,
      customerName,
      phone,
      address,
      city,
      pincode,
      notes,
      items: finalItems,
      totalAmount,
      status: "pending",
    });

    // Decrement stock for each product purchased
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Retrieve admin email from settings to log alert (emails can be dispatched here optionally)
    console.log(`Order created successfully: ${orderNumber}. Total: ₹${totalAmount}`);

    return NextResponse.json(
      { message: "Order placed successfully", orderNumber, id: order._id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Public Orders POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to place order" },
      { status: 500 }
    );
  }
}
export const revalidate = 0;
