"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AdminTopbar from "@/components/admin/AdminTopbar";
import CustomSelect from "@/components/shared/CustomSelect";
import StatusBadge, { OrderStatus } from "@/components/admin/StatusBadge";
import { ArrowLeft, Save, Calendar, Phone, MapPin, User, FileText, ShoppingCart } from "lucide-react";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  notes?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
        setSelectedStatus(data.status);
      } else {
        setError("Failed to fetch order details.");
      }
    } catch (err) {
      setError("Failed to fetch order details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setIsUpdating(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        setOrder(data);
        setSuccessMsg("Order status updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError(data.error || "Failed to update status");
      }
    } catch (err) {
      setError("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminTopbar title={order ? `Order: ${order.orderNumber}` : "Order Details"} />

      <div className="flex-1 p-3 md:p-6 space-y-6 w-full max-w-none animate-in fade-in">
        <div>
          <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-black hover:text-goat-primary transition-colors">
            <ArrowLeft size={16} /> Back to Orders
          </Link>
        </div>

        {isLoading ? (
          <div className="bg-white border border-brand-border rounded-2xl p-12 text-center text-brand-gray animate-pulse">
            Loading order details...
          </div>
        ) : error || !order ? (
          <div className="bg-white border border-brand-border rounded-2xl p-6 text-center text-red-600">
            <p className="text-sm font-semibold">{error || "Order not found"}</p>
            <button onClick={fetchOrderDetails} className="mt-2 text-xs font-semibold underline text-brand-black">Try Again</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (8 cols): Info & Products */}
            <div className="lg:col-span-8 space-y-6">
              {/* Order Metadata summary card */}
              <div className="bg-white border border-brand-border rounded-2xl p-5 md:p-6 space-y-4 shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-brand-gray uppercase">Order Reference</span>
                  <h2 className="text-xl font-bold text-brand-black font-mono">{order.orderNumber}</h2>
                  <div className="flex items-center gap-1.5 text-xs text-brand-gray font-semibold">
                    <Calendar size={13} />
                    <span>Placed: {new Date(order.createdAt).toLocaleDateString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}</span>
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-1.5">
                  <span className="text-xs font-bold text-brand-gray uppercase">Current Status</span>
                  <StatusBadge status={order.status} />
                </div>
              </div>

              {/* Products Table Card */}
              <div className="bg-white border border-brand-border rounded-2xl shadow-card overflow-hidden">
                <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
                  <ShoppingCart size={18} className="text-goat-primary" />
                  <h3 className="font-bold text-sm text-brand-black uppercase tracking-wider">Ordered Products</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-brand-light-gray text-brand-gray font-semibold text-xs border-b border-brand-border">
                        <th className="px-4 py-3 w-16">Preview</th>
                        <th className="px-4 py-3">Product Name</th>
                        <th className="px-4 py-3 text-center">Price</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border">
                      {order.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-brand-light-gray/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-brand-border bg-brand-light-gray">
                              <Image
                                src={item.image || "/placeholder.jpg"}
                                alt={item.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-4 font-semibold text-brand-black">
                            {item.name}
                          </td>
                          <td className="px-4 py-4 text-center text-brand-black font-semibold">
                            ₹{item.price}
                          </td>
                          <td className="px-4 py-4 text-center text-brand-black">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 text-right font-bold text-brand-black">
                            ₹{item.price * item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-brand-light-gray/30 px-5 py-4 flex justify-between border-t border-brand-border text-sm font-semibold">
                  <span className="text-brand-gray">Delivery Shipping</span>
                  <span className="text-goat-primary font-bold">FREE Delivery</span>
                </div>
                <div className="px-5 py-4 flex justify-between border-t border-brand-border text-base font-bold">
                  <span className="text-brand-black">Total Paid / Estimated</span>
                  <span className="text-brand-black text-lg">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): Billing & Actions */}
            <div className="lg:col-span-4 space-y-6">
              {/* Billing Customer Card */}
              <div className="bg-white border border-brand-border rounded-2xl p-5 space-y-4 shadow-card">
                <h3 className="font-bold text-sm text-brand-black uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
                  <User size={18} className="text-goat-primary" /> Delivery Client
                </h3>

                <div className="space-y-3.5 text-sm">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-gray uppercase block">Customer Name</span>
                    <span className="font-semibold text-brand-black">{order.customerName}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-gray uppercase block">Mobile Number</span>
                    <a href={`tel:${order.phone}`} className="font-semibold text-goat-primary hover:underline flex items-center gap-1">
                      <Phone size={13} /> {order.phone}
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-gray uppercase block">Delivery Address</span>
                    <span className="text-brand-black font-semibold flex items-start gap-1">
                      <MapPin size={14} className="text-neutral-400 shrink-0 mt-0.5" />
                      <span>{order.address}, {order.city} - {order.pincode}</span>
                    </span>
                  </div>
                  {order.notes && (
                    <div className="space-y-1 pt-1.5 border-t border-brand-border/60">
                      <span className="text-[10px] font-bold text-brand-gray uppercase block flex items-center gap-1"><FileText size={10} /> Client Notes</span>
                      <span className="text-xs text-brand-gray whitespace-pre-line italic">"{order.notes}"</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Update Card */}
              <div className="bg-white border border-brand-border rounded-2xl p-5 space-y-4 shadow-card">
                <h3 className="font-bold text-sm text-brand-black uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
                  <Save size={18} className="text-goat-primary" /> Update Status
                </h3>

                <form onSubmit={handleStatusUpdate} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-brand-gray">Set Order Status</label>
                    <CustomSelect
                      options={[
                        { label: "Pending Verification", value: "pending" },
                        { label: "Confirmed", value: "confirmed" },
                        { label: "Preparing / Crafting", value: "preparing" },
                        { label: "Ready to Ship", value: "ready" },
                        { label: "Delivered", value: "delivered" },
                        { label: "Cancelled", value: "cancelled" },
                      ]}
                      value={selectedStatus}
                      onChange={(val) => setSelectedStatus(val as OrderStatus)}
                      theme="goat"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full bg-brand-black hover:bg-goat-primary text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm text-sm disabled:bg-neutral-400"
                  >
                    {isUpdating ? "Updating..." : <><Save size={16} /> Save Status</>}
                  </button>
                </form>

                {successMsg && (
                  <p className="text-xs font-bold text-goat-primary text-center mt-2 animate-pulse">
                    {successMsg}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
