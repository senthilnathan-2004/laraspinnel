"use client";

import React, { useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { Calendar, Search, MapPin, Phone, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import StatusBadge, { BookingStatus } from "@/components/admin/StatusBadge";

interface ScheduleBooking {
  _id: string;
  bookingRefId: string;
  customerName: string;
  phone: string;
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
}

export default function AdminDeliverySchedulePage() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [bookings, setBookings] = useState<ScheduleBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Initialize with tomorrow's date
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split("T")[0];
    setSelectedDate(dateString);
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!selectedDate) return;
      
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/admin/bookings?date=${selectedDate}`);
        if (res.ok) {
          const data = await res.json();
          // Filter out cancelled orders
          setBookings(data.filter((b: ScheduleBooking) => b.status !== "cancelled"));
        } else {
          setError("Failed to fetch schedule");
        }
      } catch (err) {
        setError("Failed to fetch schedule");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedDate]);

  // Derived metrics
  const totalMuttonQuantity = bookings
    .filter((b) => b.productType === "mutton")
    .reduce((sum, b) => sum + b.quantity, 0);

  const totalLiveGoatQuantity = bookings
    .filter((b) => b.productType === "goat")
    .reduce((sum, b) => sum + b.quantity, 0);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminTopbar title="Delivery Schedule" />

      <div className="flex-1 p-3 md:p-6 w-full space-y-6 animate-in fade-in duration-200">
        
        {/* Top Controls */}
        <div className="bg-white p-4 rounded-2xl shadow-card border border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-display font-bold text-brand-black">Daily Deliveries</h2>
            <p className="text-sm text-brand-gray">View and manage orders for a specific date</p>
          </div>
          
          <div className="w-full sm:w-auto flex items-center gap-2 bg-brand-light-gray p-1.5 rounded-xl border border-brand-border">
            <div className="pl-3 text-brand-gray">
              <Calendar size={18} />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-sm font-semibold text-brand-black focus:ring-0 w-full sm:w-40 py-1"
            />
          </div>
        </div>

        {/* Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-mutton-tint/30 border border-mutton-primary/20 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-mutton-primary uppercase tracking-wider mb-1">Mutton Orders</p>
              <h3 className="text-3xl font-display font-bold text-mutton-primary">
                {totalMuttonQuantity} <span className="text-base font-sans font-medium text-mutton-primary/70">packs</span>
              </h3>
            </div>
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="text-2xl">🥩</span>
            </div>
          </div>
          
          <div className="bg-goat-tint/30 border border-goat-primary/20 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-goat-primary uppercase tracking-wider mb-1">Live Goat Orders</p>
              <h3 className="text-3xl font-display font-bold text-goat-primary">
                {totalLiveGoatQuantity} <span className="text-base font-sans font-medium text-goat-primary/70">goats</span>
              </h3>
            </div>
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="text-2xl">🐐</span>
            </div>
          </div>
        </div>

        {/* Schedule List */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-brand-gray space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-goat-primary"></div>
            <p className="text-sm font-semibold">Loading schedule...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-card border border-brand-border text-center space-y-3">
            <div className="w-16 h-16 bg-brand-light-gray rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="text-brand-gray" size={24} />
            </div>
            <h3 className="text-lg font-bold text-brand-black">No Deliveries Scheduled</h3>
            <p className="text-sm text-brand-gray max-w-sm mx-auto">
              There are no active orders scheduled for delivery on {new Date(selectedDate).toLocaleDateString("en-IN", { dateStyle: "long" })}.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-bold text-brand-black px-1">
              Scheduled Deliveries ({bookings.length})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-white border border-brand-border rounded-2xl shadow-card p-5 hover:border-goat-primary/30 transition-colors relative overflow-hidden">
                  
                  {/* Decorative indicator strip */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${booking.productType === 'goat' ? 'bg-goat-primary' : 'bg-mutton-primary'}`}></div>

                  <div className="flex justify-between items-start mb-4 pl-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${booking.productType === 'goat' ? 'bg-goat-tint text-goat-text border-goat-primary/20' : 'bg-mutton-tint text-mutton-text border-mutton-primary/20'}`}>
                          {booking.productType}
                        </span>
                        <span className="font-mono text-xs text-brand-gray font-semibold">{booking.bookingRefId}</span>
                      </div>
                      <h4 className="font-bold text-brand-black">{booking.varietyOrPackName}</h4>
                      {booking.weightSelection && (
                        <p className="text-xs font-semibold text-brand-gray mt-0.5">Weight: {booking.weightSelection}</p>
                      )}
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <StatusBadge status={booking.status} />
                      <span className="text-xl font-display font-bold text-brand-black">
                        x{booking.quantity}
                      </span>
                    </div>
                  </div>

                  <div className="bg-brand-light-gray/50 rounded-xl p-4 space-y-3 pl-4 ml-2">
                    <div className="flex items-start gap-2.5">
                      <Clock size={14} className="text-brand-gray mt-0.5 shrink-0" />
                      <div>
                        <span className="block text-xs font-semibold text-brand-gray">Delivery Timing</span>
                        <span className="text-sm font-medium text-brand-black">{booking.deliveryTiming || "Anytime"}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin size={14} className="text-brand-gray mt-0.5 shrink-0" />
                      <div>
                        <span className="block text-xs font-semibold text-brand-gray">Address</span>
                        <span className="text-sm font-medium text-brand-black">{booking.deliveryAddress} {booking.district ? `(${booking.district})` : ""}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Phone size={14} className="text-brand-gray mt-0.5 shrink-0" />
                      <div>
                        <span className="block text-xs font-semibold text-brand-gray">Customer Contact</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-brand-black">{booking.customerName}</span>
                          <span className="text-brand-gray text-xs">•</span>
                          <a href={`tel:${booking.phone}`} className="text-sm font-semibold text-goat-primary hover:underline">{booking.phone}</a>
                        </div>
                      </div>
                    </div>
                    
                    {booking.notes && (
                      <div className="flex items-start gap-2.5 pt-2 border-t border-brand-border/50">
                        <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="block text-xs font-semibold text-brand-gray">Notes</span>
                          <span className="text-sm text-brand-black">{booking.notes}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pl-3 flex justify-end">
                    <Link href={`/admin/bookings/${booking._id}`} className="text-xs font-semibold text-brand-gray hover:text-brand-black flex items-center gap-1 transition-colors">
                      View full details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
