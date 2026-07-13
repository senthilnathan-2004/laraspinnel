"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  User, 
  Phone, 
  MapPin, 
  CalendarClock, 
  Save, 
  Sparkles,
  Mail
} from "lucide-react";
import Link from "next/link";
import { IFestivalBooking } from "@/models/FestivalBooking";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminFestivalBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  const { data: booking, error, isLoading, mutate } = useSWR<IFestivalBooking>(
    `/api/admin/festival-bookings/${unwrappedParams.id}`,
    fetcher
  );

  const [isSaving, setIsSaving] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [editStatus, setEditStatus] = useState("");
  const [editAdminNotes, setEditAdminNotes] = useState("");

  // Sync state when data loads
  React.useEffect(() => {
    if (booking) {
      setEditStatus(booking.status);
      setEditAdminNotes(booking.adminNotes || "");
    }
  }, [booking]);

  const handleUpdate = async () => {
    setIsSaving(true);
    setUpdateSuccess(false);
    
    try {
      const res = await fetch(`/api/admin/festival-bookings/${unwrappedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          adminNotes: editAdminNotes,
        }),
      });

      if (res.ok) {
        setUpdateSuccess(true);
        mutate(); // refresh data
        setTimeout(() => setUpdateSuccess(false), 3000);
      } else {
        alert("Failed to update booking");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminTopbar title="Booking Details" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-goat-primary" />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminTopbar title="Booking Details" />
        <div className="flex-1 flex flex-col items-center justify-center text-red-500">
          <XCircle className="w-12 h-12 mb-4" />
          <h2 className="text-xl font-bold">Booking Not Found</h2>
          <Link href="/admin/festival-bookings" className="mt-4 text-brand-gray hover:text-brand-black underline">
            Return to list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-brand-light-gray/20">
      <AdminTopbar title={`Order #${booking.bookingRefId}`} />

      <div className="p-3 md:p-6 w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
        
        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Link 
            href="/admin/festival-bookings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gray hover:text-brand-black transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Festival Orders
          </Link>
          
          <div className="flex items-center gap-3">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
              booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
              booking.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' :
              'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {booking.status}
            </span>
          </div>
        </div>

        {updateSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600" />
            <span className="font-medium">Booking updated successfully! Notification emails sent if status changed.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Requirements */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-2xl shadow-card border border-brand-border overflow-hidden">
              <div className="p-5 border-b border-brand-border bg-brand-light-gray/30 flex items-center gap-3">
                <Sparkles size={20} className="text-goat-primary" />
                <h3 className="font-bold text-brand-black">Festival Requirements</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <p className="text-xs font-bold text-brand-gray uppercase tracking-wider mb-1">Occasion / Function</p>
                    <p className="font-medium text-brand-black text-lg">{booking.functionCategory}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-gray uppercase tracking-wider mb-1">Required Weight</p>
                    <p className="font-medium text-goat-primary text-lg">{booking.weightRequired}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-gray uppercase tracking-wider mb-1">Preferred Color</p>
                    <p className="font-medium text-brand-black">{booking.preferredColor}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-gray uppercase tracking-wider mb-1">Unwanted Color</p>
                    <p className="font-medium text-red-600">{booking.unwantedColor}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-bold text-brand-gray uppercase tracking-wider mb-1">Preferred Age / Teeth (Pallu)</p>
                    <p className="font-medium text-brand-black bg-brand-light-gray p-3 rounded-lg border border-brand-border mt-1">
                      {booking.preferredAge}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-brand-border overflow-hidden">
              <div className="p-5 border-b border-brand-border bg-brand-light-gray/30 flex items-center gap-3">
                <CalendarClock size={20} className="text-brand-gray" />
                <h3 className="font-bold text-brand-black">Delivery Details</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-brand-light-gray/50 border border-brand-border p-4 rounded-xl">
                    <p className="text-xs font-bold text-brand-gray uppercase tracking-wider mb-1">Date</p>
                    <p className="font-bold text-brand-black">
                      {booking.deliveryDate ? format(new Date(booking.deliveryDate), "EEEE, MMM d, yyyy") : "Not specified"}
                    </p>
                  </div>
                  <div className="bg-brand-light-gray/50 border border-brand-border p-4 rounded-xl">
                    <p className="text-xs font-bold text-brand-gray uppercase tracking-wider mb-1">Timing</p>
                    <p className="font-bold text-brand-black">{booking.deliveryTiming || "Any time"}</p>
                  </div>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="bg-white rounded-2xl shadow-card border border-brand-border overflow-hidden">
                <div className="p-5 border-b border-brand-border bg-brand-light-gray/30">
                  <h3 className="font-bold text-brand-black">Customer Notes</h3>
                </div>
                <div className="p-6 text-brand-gray italic">
                  "{booking.notes}"
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Customer & Actions */}
          <div className="space-y-6">
            
            <div className="bg-brand-black rounded-2xl shadow-card overflow-hidden text-white">
              <div className="p-5 border-b border-neutral-800 flex items-center gap-3">
                <User size={20} className="text-goat-primary" />
                <h3 className="font-bold">Customer Info</h3>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Name</p>
                  <p className="font-bold text-lg">{booking.customerName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Phone size={14} /> Phone
                  </p>
                  <p className="font-medium text-neutral-200">
                    <a href={`tel:${booking.phone}`} className="hover:text-goat-primary transition-colors">{booking.phone}</a>
                  </p>
                </div>
                {booking.email && (
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                      <Mail size={14} /> Email
                    </p>
                    <p className="font-medium text-neutral-200 break-all">
                      <a href={`mailto:${booking.email}`} className="hover:text-goat-primary transition-colors">{booking.email}</a>
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <MapPin size={14} /> Address
                  </p>
                  <p className="font-medium text-neutral-300 leading-relaxed bg-neutral-900 p-3 rounded-xl border border-neutral-800 mt-1">
                    {booking.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-brand-border overflow-hidden">
              <div className="p-5 border-b border-brand-border bg-brand-light-gray/30">
                <h3 className="font-bold text-brand-black">Update Order</h3>
              </div>
              <div className="p-6 space-y-5">
                
                <div>
                  <label className="text-xs font-bold text-brand-black uppercase tracking-wider block mb-2">Order Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full h-11 bg-white border border-brand-border rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-goat-primary outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-black uppercase tracking-wider block mb-2">Admin Notes (Internal)</label>
                  <textarea
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    rows={4}
                    className="w-full bg-brand-light-gray border border-brand-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-goat-primary outline-none resize-none"
                    placeholder="Add private notes about pricing, availability, etc."
                  ></textarea>
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={isSaving}
                  className="w-full bg-brand-black hover:bg-neutral-800 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  <span>{isSaving ? "Saving..." : "Save Updates"}</span>
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
