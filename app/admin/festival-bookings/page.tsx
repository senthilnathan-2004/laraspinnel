"use client";

import React, { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { format } from "date-fns";
import { Eye, Loader2, Filter, AlertCircle, Sparkles, Trash2 } from "lucide-react";
import { IFestivalBooking } from "@/models/FestivalBooking";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminFestivalBookingsPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: bookings, error, isLoading, mutate } = useSWR<IFestivalBooking[]>(
    `/api/admin/festival-bookings?status=${statusFilter}`,
    fetcher
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && bookings) {
      setSelectedIds(bookings.map((b) => String(b._id)));
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
      const res = await fetch("/api/admin/festival-bookings/bulk-delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (res.ok) {
        setSelectedIds([]);
        setShowDeleteConfirm(false);
        mutate();
      } else {
        alert("Failed to delete orders"); // Fallback, could also make this custom
      }
    } catch (err) {
      alert("Error deleting orders");
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200">Pending</span>;
      case "confirmed":
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-200">Confirmed</span>;
      case "completed":
        return <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200">Completed</span>;
      case "cancelled":
        return <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full border border-red-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full border border-gray-200">{status}</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminTopbar title="Festival Orders" />

      <div className="p-3 md:p-6 space-y-6 flex-1 overflow-auto animate-in fade-in duration-200">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-goat-primary/10 flex items-center justify-center text-goat-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-black">Festival Goat Orders</h2>
              <p className="text-sm text-brand-gray">Manage custom function and festival orders</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={isDeletingBulk}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
              >
                <Trash2 size={16} />
                <span>{isDeletingBulk ? "Deleting..." : `Delete (${selectedIds.length})`}</span>
              </button>
            )}
            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-brand-border">
              <Filter size={16} className="text-brand-gray ml-2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer pr-8 py-1.5 outline-none"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-card border border-brand-border overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-brand-gray">
              <thead className="text-xs text-brand-black uppercase bg-brand-light-gray/50 border-b border-brand-border">
                <tr>
                  <th className="px-4 py-3 md:px-6 md:py-4 w-10">
                    <input
                      type="checkbox"
                      className="rounded border-brand-border text-brand-black focus:ring-brand-black cursor-pointer"
                      checked={Array.isArray(bookings) && bookings.length > 0 && selectedIds.length === bookings.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 md:py-4 font-bold">Booking Ref</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 font-bold">Customer</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 font-bold">Function</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 font-bold">Req. Weight</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 font-bold hidden md:table-cell">Delivery</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 font-bold">Status</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-goat-primary mx-auto mb-2" />
                      <p className="font-medium text-brand-gray">Loading orders...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-red-500">
                        <AlertCircle className="w-8 h-8 mb-2" />
                        <p className="font-medium">Failed to load orders</p>
                      </div>
                    </td>
                  </tr>
                ) : bookings && bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-brand-gray">
                      <div className="bg-brand-light-gray w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Sparkles size={24} className="text-neutral-400" />
                      </div>
                      <p className="font-medium text-brand-black text-base">No festival orders found</p>
                      <p className="text-sm">There are no orders matching this status.</p>
                    </td>
                  </tr>
                ) : (
                  bookings?.map((booking) => (
                    <tr key={String(booking._id)} className="border-b border-brand-border hover:bg-brand-light-gray/30 transition-colors">
                      <td className="px-4 py-3 md:px-6">
                        <input
                          type="checkbox"
                          className="rounded border-brand-border text-brand-black focus:ring-brand-black cursor-pointer"
                          checked={selectedIds.includes(String(booking._id))}
                          onChange={() => handleSelect(String(booking._id))}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono font-medium text-brand-black">
                        {booking.bookingRefId}
                      </td>
                      <td className="px-4 py-3 md:px-6">
                        <div className="font-bold text-brand-black">{booking.customerName}</div>
                        <div className="text-xs">{booking.phone}</div>
                      </td>
                      <td className="px-4 py-3 md:px-6">
                        <span className="font-medium text-brand-black">{booking.functionCategory}</span>
                      </td>
                      <td className="px-4 py-3 md:px-6">
                        <span className="font-medium text-goat-primary">{booking.weightRequired}</span>
                      </td>
                      <td className="px-4 py-3 md:px-6 hidden md:table-cell">
                        <div className="font-medium text-brand-black">
                          {booking.deliveryDate ? format(new Date(booking.deliveryDate), "MMM d, yyyy") : "N/A"}
                        </div>
                        <div className="text-xs">{booking.deliveryTiming}</div>
                      </td>
                      <td className="px-4 py-3 md:px-6">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-4 py-3 md:px-6 text-right">
                        <Link
                          href={`/admin/festival-bookings/${booking._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-black bg-white border border-brand-border rounded-lg hover:bg-brand-light-gray hover:border-neutral-300 transition-colors"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
              <h3 className="text-xl font-bold text-brand-black">Delete Festival Orders?</h3>
              <p className="text-sm text-brand-gray">
                Are you sure you want to delete {selectedIds.length} selected order{selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.
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
