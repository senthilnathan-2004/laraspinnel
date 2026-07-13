"use client";

import React, { useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import StatusBadge, { BookingStatus } from "@/components/admin/StatusBadge";
import { Search, SlidersHorizontal, Download, Phone, Calendar, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";

interface Booking {
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
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        status: statusFilter,
        productType: typeFilter,
        search: searchTerm,
      });

      const res = await fetch(`/api/admin/bookings?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else {
        setError("Failed to fetch bookings list");
      }
    } catch (err) {
      setError("Failed to fetch bookings list");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  // CSV Export utility
  const exportToCSV = () => {
    if (bookings.length === 0) return;

    // Define headers
    const headers = [
      "Reference ID",
      "Customer Name",
      "Phone",
      "Product Type",
      "Variety/Pack Name",
      "Weight/KG",
      "Quantity",
      "Preferred Delivery Date",
      "Delivery Timing",
      "Status",
      "Booking Date",
    ];

    // Map rows
    const rows = bookings.map((b) => [
      b.bookingRefId,
      b.customerName,
      b.phone,
      b.productType.toUpperCase(),
      b.varietyOrPackName,
      b.weightSelection || "N/A",
      b.quantity,
      new Date(b.preferredDate).toLocaleDateString("en-IN"),
      b.deliveryTiming || "N/A",
      b.status.toUpperCase(),
      new Date(b.createdAt).toLocaleDateString("en-IN"),
    ]);

    // Construct CSV content
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    // Download trigger
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ragu_farm_bookings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(bookings.map((b) => b._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setShowDeleteConfirm(true);
  };

  const executeDelete = async () => {
    setIsDeletingBulk(true);
    try {
      const res = await fetch("/api/admin/bookings/bulk-delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (res.ok) {
        setSelectedIds([]);
        setShowDeleteConfirm(false);
        fetchBookings();
      } else {
        alert("Failed to delete bookings"); // Fallback, could also make this custom
      }
    } catch (err) {
      alert("Error deleting bookings");
    } finally {
      setIsDeletingBulk(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminTopbar title="Bookings Manager" />

      <div className="flex-1 p-3 md:p-6 space-y-6 w-full">
        {/* Filter Toolbar */}
        <div className="bg-white border border-brand-border rounded-2xl shadow-card p-3 md:p-5 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-4" noValidate>
            {/* Search Input */}
            <div className="relative w-full md:flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-gray">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, phone, ref number..."
                className="w-full h-11 pl-10 pr-4 bg-brand-light-gray/50 border border-brand-border rounded-xl text-sm text-brand-black focus:ring-2 focus:ring-goat-primary outline-none transition-all"
              />
            </div>
            
            <button
              type="submit"
              className="w-full md:w-auto h-11 px-4 md:px-6 bg-brand-black hover:bg-goat-primary text-white rounded-xl text-sm font-semibold transition-colors shrink-0 shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Additional Filter Switches */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-brand-border pt-4">
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-brand-gray" />
                <span className="text-brand-black text-xs uppercase tracking-wider font-bold">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-brand-light-gray border border-brand-border rounded-lg px-2.5 py-1 text-xs text-brand-black outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Product Type Filter */}
              <div className="flex items-center gap-2">
                <span className="text-brand-black text-xs uppercase tracking-wider font-bold">Product:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-brand-light-gray border border-brand-border rounded-lg px-2.5 py-1 text-xs text-brand-black outline-none"
                >
                  <option value="all">All Products</option>
                  <option value="goat">Goats</option>
                  <option value="mutton">Mutton</option>
                </select>
              </div>
            </div>

            {/* Export CSV & Bulk Delete buttons */}
            <div className="flex items-center gap-2">
              {selectedIds.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  disabled={isDeletingBulk}
                  className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs transition-all disabled:opacity-50 border border-red-100"
                >
                  <Trash2 size={14} />
                  <span>{isDeletingBulk ? "Deleting..." : `Delete (${selectedIds.length})`}</span>
                </button>
              )}
              <button
                onClick={exportToCSV}
                disabled={bookings.length === 0}
                className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-xl border border-brand-border text-brand-black hover:bg-brand-light-gray font-semibold text-xs transition-all disabled:opacity-50"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data list */}
        <div className="bg-white border border-brand-border rounded-2xl shadow-card overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-brand-gray flex flex-col items-center gap-3">
              <Loader2 size={36} className="animate-spin text-goat-primary" />
              <p className="text-sm font-semibold">Loading bookings...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-600">
              <p className="text-sm font-semibold">{error}</p>
              <button
                onClick={fetchBookings}
                className="mt-2 text-xs font-semibold underline text-brand-black"
              >
                Try Again
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center text-brand-gray">
              <Calendar size={40} className="mx-auto mb-3 text-neutral-300" />
              <p className="text-sm font-semibold">No bookings found</p>
              <p className="text-xs mt-1">Adjust filters or search query to look for orders.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-light-gray text-brand-gray font-semibold text-xs border-b border-brand-border">
                    <th className="px-4 md:px-6 py-3 w-10">
                      <input
                        type="checkbox"
                        className="rounded border-brand-border text-brand-black focus:ring-brand-black cursor-pointer"
                        checked={bookings.length > 0 && selectedIds.length === bookings.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-4 py-3">Reference ID</th>
                    <th className="px-4 md:px-6 py-3">Customer</th>
                    <th className="px-4 md:px-6 py-3">Product Type</th>
                    <th className="px-4 md:px-6 py-3">Variety / Pack</th>
                    <th className="px-4 md:px-6 py-3">Qty</th>
                    <th className="px-4 md:px-6 py-3">Delivery Date & Time</th>
                    <th className="px-4 md:px-6 py-3">Status</th>
                    <th className="px-4 md:px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-sm">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-brand-light-gray/50 transition-colors">
                      <td className="px-4 md:px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-brand-border text-brand-black focus:ring-brand-black cursor-pointer"
                          checked={selectedIds.includes(booking._id)}
                          onChange={() => handleSelect(booking._id)}
                        />
                      </td>
                      <td className="px-4 py-4 font-mono font-semibold text-brand-black">
                        {booking.bookingRefId}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="font-semibold text-brand-black">{booking.customerName}</div>
                        <div className="text-xs text-brand-gray flex items-center gap-1 mt-0.5">
                          <Phone size={12} className="text-neutral-400" />
                          <span>{booking.phone}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-semibold border ${
                            booking.productType === "goat"
                              ? "bg-goat-tint text-goat-text border-goat-primary/20"
                              : "bg-mutton-tint text-mutton-text border-mutton-primary/20"
                          }`}
                        >
                          {booking.productType === "goat" ? "Goat" : "Mutton"}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="font-medium text-brand-black">{booking.varietyOrPackName}</div>
                        {booking.weightSelection && (
                          <div className="text-xs text-brand-gray mt-0.5">Weight: {booking.weightSelection}</div>
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-4 font-semibold text-brand-black">
                        {booking.quantity}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="text-brand-gray">
                          {new Date(booking.preferredDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        {booking.deliveryTiming && (
                          <div className="text-xs text-brand-black font-medium mt-0.5">
                            {booking.deliveryTiming}
                          </div>
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <Link
                          href={`/admin/bookings/${booking._id}`}
                          className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-full border border-brand-border text-brand-black hover:bg-brand-light-gray transition-colors"
                        >
                          <span>Manage</span>
                          <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-brand-black">Delete Bookings?</h3>
              <p className="text-sm text-brand-gray">
                Are you sure you want to delete {selectedIds.length} selected booking{selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.
              </p>
            </div>
            <div className="flex border-t border-brand-border bg-brand-light-gray/30">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeletingBulk}
                className="flex-1 py-4 text-sm font-semibold text-brand-gray hover:bg-brand-light-gray transition-colors border-r border-brand-border disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                disabled={isDeletingBulk}
                className="flex-1 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {isDeletingBulk ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Loader helper inside same component file for simplicity
function Loader2({ size = 20, className = "" }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
