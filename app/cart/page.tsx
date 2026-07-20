"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart, type CartItem } from "@/hooks/useCart";
import ImageUploadDropzone from "@/components/admin/ImageUploadDropzone";
import { ShoppingCart, Trash2, ArrowLeft, ArrowRight, ShoppingBag, Plus, Minus, Pencil } from "lucide-react";

const lineKey = (item: CartItem) => `${item.productId}-${item.customText || ""}-${item.customImage || ""}`;

export default function CartPage() {
  const { cart, updateQuantity, removeItem, updateCustomization, clearCart, cartCount, cartTotal } = useCart();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");
  const [draftImage, setDraftImage] = useState("");

  const startEditing = (item: CartItem) => {
    setEditingKey(lineKey(item));
    setDraftText(item.customText || "");
    setDraftImage(item.customImage || "");
  };

  const cancelEditing = () => setEditingKey(null);

  const saveEditing = (item: CartItem) => {
    updateCustomization(item.productId, item.customText, item.customImage, {
      customText: draftText.trim() || undefined,
      customImage: draftImage || undefined,
    });
    setEditingKey(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16 w-full space-y-8 animate-in fade-in">
        {/* Page Header */}
        <div className="space-y-3 border-b border-brand-border pb-6">
          <h1 className="font-display text-3xl sm:text-5xl text-brand-black tracking-wide uppercase">
            Your Shopping Cart
          </h1>
          <p className="text-sm font-medium text-brand-gray">
            Review your handcrafted gifts before proceeding to checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 border border-brand-border border-dashed rounded-3xl bg-brand-light-gray/20 max-w-2xl mx-auto space-y-4">
            <ShoppingCart className="mx-auto text-neutral-300 animate-bounce" size={56} />
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-brand-black">Your Cart is Empty</h2>
              <p className="text-xs text-brand-gray">Add some handmade love to your cart and make someone smile!</p>
            </div>
            <div className="pt-2">
              <Link
                href="/shop"
                className="bg-brand-black hover:bg-goat-primary text-white font-bold py-3 px-6 rounded-full transition-all inline-flex items-center gap-2 shadow-md"
              >
                <ShoppingBag size={18} /> Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items Column (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="border border-brand-border rounded-2xl overflow-hidden shadow-card">
                <div className="bg-brand-light-gray/50 px-4 py-3 border-b border-brand-border hidden md:grid grid-cols-12 text-xs font-bold text-brand-gray uppercase">
                  <div className="col-span-6">Product Details</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                <div className="divide-y divide-brand-border bg-white">
                  {cart.map((item) => (
                    <div
                      key={lineKey(item)}
                      className={`p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-start ${
                        editingKey === lineKey(item) ? "" : "md:items-center"
                      }`}
                    >
                      {/* Product Detail */}
                      <div className="col-span-1 md:col-span-6 flex gap-4 items-start">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-brand-light-gray shrink-0 border border-brand-border">
                          <Image
                            src={item.image || "/placeholder.jpg"}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <h3 className="font-semibold text-brand-black text-sm md:text-base truncate">
                            {item.name}
                          </h3>

                          {editingKey === lineKey(item) ? (
                            <div className="space-y-2 pt-1 max-w-sm md:max-w-none">
                              <textarea
                                value={draftText}
                                onChange={(e) => setDraftText(e.target.value)}
                                rows={2}
                                maxLength={300}
                                placeholder="e.g. Add name 'Priya', change ribbon color to pink..."
                                className="w-full p-2 bg-goat-tint/20 border border-goat-primary/25 rounded-lg text-xs outline-none focus:ring-2 focus:ring-goat-primary transition-all resize-none"
                              />
                              <ImageUploadDropzone
                                value={draftImage ? [draftImage] : []}
                                onChange={(urls) => setDraftImage(urls[urls.length - 1] || "")}
                                maxFiles={1}
                                endpoint="/api/customer-upload"
                              />
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  onClick={() => saveEditing(item)}
                                  className="text-xs font-semibold text-white bg-goat-primary hover:bg-goat-hover px-3 py-1.5 rounded-full transition-colors"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="text-xs font-semibold text-brand-gray hover:text-brand-black px-3 py-1.5 rounded-full border border-brand-border transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {item.customText && (
                                <p className="text-xs text-goat-text bg-goat-tint border border-goat-primary/20 rounded-lg px-2 py-1 italic truncate" title={item.customText}>
                                  Custom: {item.customText}
                                </p>
                              )}
                              {item.customImage && (
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-goat-primary/30 shrink-0">
                                  <Image
                                    src={item.customImage}
                                    alt="Customization reference"
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex items-center gap-3 mt-0.5">
                                <button
                                  onClick={() => startEditing(item)}
                                  className="text-xs font-semibold text-goat-primary hover:text-goat-hover transition-colors flex items-center gap-1"
                                >
                                  <Pencil size={13} /> Edit
                                </button>
                                <button
                                  onClick={() => removeItem(item.productId, item.customText, item.customImage)}
                                  className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
                                >
                                  <Trash2 size={13} /> Remove
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="col-span-1 md:col-span-2 md:text-center flex md:block justify-between text-sm">
                        <span className="md:hidden text-brand-gray font-medium">Price:</span>
                        <span className="font-semibold text-brand-black">₹{item.price}</span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center gap-3">
                        <span className="md:hidden text-brand-gray font-medium">Quantity:</span>
                        <div className="flex items-center border border-brand-border rounded-lg bg-brand-light-gray/20 h-8 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.customText, item.customImage)}
                            className="px-2 h-full hover:bg-brand-light-gray text-brand-black"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-brand-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.customText, item.customImage)}
                            className="px-2 h-full hover:bg-brand-light-gray text-brand-black"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-1 md:col-span-2 text-right flex md:block justify-between text-sm">
                        <span className="md:hidden text-brand-gray font-medium">Subtotal:</span>
                        <span className="font-bold text-brand-black">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <Link
                  href="/shop"
                  className="bg-white hover:bg-brand-light-gray text-brand-black border border-brand-border font-bold py-3 px-6 rounded-full transition-all inline-flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <ArrowLeft size={16} /> Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-3 px-6 rounded-full transition-all inline-flex items-center justify-center gap-2 text-sm"
                >
                  <Trash2 size={16} /> Clear Cart
                </button>
              </div>
            </div>

            {/* Summary Column (4 cols) */}
            <div className="lg:col-span-4 bg-brand-light-gray/30 border border-brand-border rounded-2xl p-6 space-y-6 shadow-card">
              <h2 className="font-display text-xl text-brand-black uppercase tracking-wide border-b border-brand-border pb-3">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-gray font-medium">Total Items:</span>
                  <span className="font-bold text-brand-black">{cartCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-gray font-medium">Subtotal:</span>
                  <span className="font-bold text-brand-black">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-gray font-medium">Delivery:</span>
                  <span className="text-goat-primary font-bold">FREE Delivery</span>
                </div>
                <div className="border-t border-brand-border pt-4 flex justify-between text-base">
                  <span className="font-bold text-brand-black">Total:</span>
                  <span className="font-extrabold text-brand-black">₹{cartTotal}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/checkout"
                  className="w-full bg-brand-black hover:bg-goat-primary text-white font-bold py-3.5 px-6 rounded-full transition-all flex items-center justify-center gap-2 shadow-md text-base"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
