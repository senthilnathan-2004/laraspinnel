/// <reference types="react" />
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminTopbar from "@/components/admin/AdminTopbar";
import StatusBadge, { BookingStatus } from "@/components/admin/StatusBadge";
import { ArrowLeft, Save, Loader2, Phone, Mail, MapPin, Calendar, FileText, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Booking {
  _id: string;
  bookingRefId: string;
  customerName: string;
  phone: string;
  altPhone?: string;
  email?: string;
  productType: "goat" | "mutton";
  varietyOrPackName: string;
  quantity: number;
  weightSelection?: string;
  status: BookingStatus;
  preferredDate: string;
  deliveryTiming?: string;
  deliveryAddress: string;
  district?: string;
  notes?: string;
  adminNotes?: string;
  createdAt: string;
}

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [status, setStatus] = useState<BookingStatus>("pending");
  const [adminNotes, setAdminNotes] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const res = await fetch(`/api/admin/bookings`);
        if (res.ok) {
          const list = await res.json();
          const item = list.find((b: any) => b._id === id);
          if (item) {
            setBooking(item);
            setStatus(item.status);
            setAdminNotes(item.adminNotes || "");
          } else {
            setError("Booking not found");
          }
        } else {
          setError("Failed to load booking details");
        }
      } catch (err) {
        setError("Failed to load booking details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update booking");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminTopbar title="Manage Booking" />

      <div className="flex-1 p-3 md:p-6 w-full space-y-6 animate-in fade-in duration-200">
        {/* Back Link */}
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gray hover:text-brand-black transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Bookings</span>
        </Link>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 md:p-4 rounded-xl flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-3 md:p-4 rounded-xl flex items-start gap-3">
            <CheckCircle size={18} className="shrink-0 text-green-600 mt-0.5" />
            <span className="font-medium">Booking updated successfully!</span>
          </div>
        )}

        {isLoading ? (
          <div className="bg-white border border-brand-border rounded-2xl shadow-card p-12 text-center text-brand-gray flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-goat-primary" size={40} />
            <p className="text-sm font-semibold">Loading details...</p>
          </div>
        ) : !booking ? (
          <div className="bg-white border border-brand-border rounded-2xl shadow-card p-12 text-center text-brand-gray">
            <AlertCircle size={40} className="mx-auto mb-3 text-red-500" />
            <p className="text-sm font-semibold">Booking not found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Booking Details Card */}
            <div className="bg-white border border-brand-border rounded-2xl shadow-card p-3 md:p-6 md:col-span-2 space-y-6">
              <div className="flex items-center justify-between border-b border-brand-border pb-4">
                <div>
                  <span className="text-xs text-brand-gray font-semibold uppercase tracking-wider">Reference ID</span>
                  <h3 className="font-mono font-bold text-lg text-brand-black">{booking.bookingRefId}</h3>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              {/* Customer details */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-brand-black uppercase tracking-wider">Customer Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 text-sm">
                  <div>
                    <span className="text-brand-gray block text-xs">Customer Name</span>
                    <span className="font-semibold text-brand-black">{booking.customerName}</span>
                  </div>
                  <div>
                    <span className="text-brand-gray block text-xs">Phone Number</span>
                    <a href={`tel:${booking.phone}`} className="font-semibold text-goat-primary hover:underline flex items-center gap-1.5 mt-0.5">
                      <Phone size={14} />
                      <span>{booking.phone}</span>
                    </a>
                  </div>
                  {booking.altPhone && (
                    <div>
                      <span className="text-brand-gray block text-xs">Alternate Phone</span>
                      <a href={`tel:${booking.altPhone}`} className="font-semibold text-brand-black hover:underline flex items-center gap-1.5 mt-0.5">
                        <Phone size={14} />
                        <span>{booking.altPhone}</span>
                      </a>
                    </div>
                  )}
                  {booking.email && (
                    <div>
                      <span className="text-brand-gray block text-xs">Email Address</span>
                      <a href={`mailto:${booking.email}`} className="font-semibold text-brand-black hover:underline flex items-center gap-1.5 mt-0.5">
                        <Mail size={14} />
                        <span>{booking.email}</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Order summary */}
              <div className="space-y-4 border-t border-brand-border pt-6">
                <h4 className="text-xs font-semibold text-brand-black uppercase tracking-wider">Order Summary</h4>
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 text-sm">
                  <div>
                    <span className="text-brand-gray block text-xs">Product Variety / Pack</span>
                    <span className="font-semibold text-brand-black block">
                      {booking.varietyOrPackName} ({booking.productType === "goat" ? "Goat" : "Mutton"})
                    </span>
                    {booking.weightSelection && (
                      <span className="inline-block mt-1 bg-brand-light-gray px-2 py-0.5 rounded text-xs font-semibold text-brand-black border border-brand-border">
                        {booking.weightSelection}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-brand-gray block text-xs">Quantity Ordered</span>
                    <span className="font-semibold text-brand-black">{booking.quantity}</span>
                  </div>
                  <div>
                    <span className="text-brand-gray block text-xs">Preferred Delivery Date & Time</span>
                    <span className="font-semibold text-brand-black flex items-center gap-1.5 mt-0.5">
                      <Calendar size={14} className="text-brand-gray" />
                      <span>
                        {new Date(booking.preferredDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                        {booking.deliveryTiming ? ` • ${booking.deliveryTiming}` : ""}
                      </span>
                    </span>
                  </div>
                  {booking.district && (
                    <div>
                      <span className="text-brand-gray block text-xs">Delivery District</span>
                      <span className="font-semibold text-brand-black">{booking.district}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Address & Customer notes */}
              <div className="space-y-4 border-t border-brand-border pt-6 text-sm">
                <div>
                  <span className="text-brand-gray block text-xs mb-1">Delivery Address</span>
                  <div className="p-3 bg-brand-light-gray rounded-xl border border-brand-border text-brand-black flex items-start gap-2.5">
                    <MapPin size={16} className="text-brand-gray shrink-0 mt-0.5" />
                    <span className="whitespace-pre-wrap">{booking.deliveryAddress}</span>
                  </div>
                </div>
                {booking.notes && (
                  <div>
                    <span className="text-brand-gray block text-xs mb-1">Customer Notes</span>
                    <div className="p-3 bg-brand-light-gray rounded-xl border border-brand-border text-brand-black flex items-start gap-2.5">
                      <FileText size={16} className="text-brand-gray shrink-0 mt-0.5" />
                      <span>{booking.notes}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Manager Actions Card */}
            <div className="bg-white border border-brand-border rounded-2xl shadow-card p-3 md:p-6 h-fit space-y-6">
              <h4 className="text-xs font-semibold text-brand-black uppercase tracking-wider border-b border-brand-border pb-3">
                Booking Actions
              </h4>

              <form onSubmit={handleUpdate} className="space-y-4" noValidate>
                {/* Status selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                    Update Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as BookingStatus)}
                    className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary"
                  >
                    <option value="pending">Pending Verification</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Admin notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-black uppercase tracking-wider block">
                    Internal Notes
                  </label>
                  <textarea
                    rows={4}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Enter internal details, follow-ups, delivery arrangements..."
                    className="w-full bg-white border border-brand-border rounded-xl p-3 text-sm text-brand-black outline-none focus:ring-2 focus:ring-goat-primary resize-none"
                  ></textarea>
                </div>

                {/* Save button */}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full h-11 bg-brand-black hover:bg-goat-primary text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border border-transparent"
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  <span>Save Status</span>
                </button>
              </form>

              {/* Call Escape Button */}
              <div className="border-t border-brand-border pt-4">
                <a
                  href={`tel:${booking.phone}`}
                  className="w-full h-11 border border-brand-border hover:bg-brand-light-gray text-brand-black rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Phone size={16} />
                  <span>Call Customer</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
