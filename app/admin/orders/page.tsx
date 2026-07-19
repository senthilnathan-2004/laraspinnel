"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminTopbar from "@/components/admin/AdminTopbar";
import CustomSelect from "@/components/shared/CustomSelect";
import StatusBadge, { OrderStatus } from "@/components/admin/StatusBadge";
import { Search, FileText, Phone } from "lucide-react";

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  items: {
    quantity: number;
  }[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        setFilteredOrders(data);
      } else {
        setError("Failed to fetch customer orders");
      }
    } catch (err) {
      setError("Failed to fetch customer orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let results = orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.phone.includes(searchTerm)
    );

    if (statusFilter !== "all") {
      results = results.filter((o) => o.status === statusFilter);
    }

    setFilteredOrders(results);
  }, [searchTerm, statusFilter, orders]);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminTopbar title="Customer Orders" />

      <div className="flex-1 p-3 md:p-6 space-y-6 w-full animate-in fade-in">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:max-w-xl">
            {/* Search */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-gray">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search orders by number, client, or phone..."
                className="w-full h-10 pl-9 pr-4 bg-white border border-brand-border rounded-xl text-sm text-brand-black focus:ring-2 focus:ring-goat-primary outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-48">
              <CustomSelect
                options={[
                  { label: "All Statuses", value: "all" },
                  { label: "Pending", value: "pending" },
                  { label: "Confirmed", value: "confirmed" },
                  { label: "Preparing", value: "preparing" },
                  { label: "Ready to Ship", value: "ready" },
                  { label: "Delivered", value: "delivered" },
                  { label: "Cancelled", value: "cancelled" },
                ]}
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                theme="goat"
              />
            </div>
          </div>
        </div>

        {/* List / Table */}
        <div className="bg-white border border-brand-border rounded-2xl shadow-card overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-brand-gray flex flex-col items-center gap-3">
              <div className="animate-spin text-goat-primary">
                <FileText size={40} />
              </div>
              <p className="text-sm font-semibold">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-600">
              <p className="text-sm font-semibold">{error}</p>
              <button
                onClick={fetchOrders}
                className="mt-2 text-xs font-semibold underline text-brand-black"
              >
                Try Again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-brand-gray">
              <FileText size={40} className="mx-auto mb-3 text-neutral-300" />
              <p className="text-sm font-semibold">No orders found</p>
              <p className="text-xs mt-1">Orders placed by customers will show up here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-light-gray text-brand-gray font-semibold text-xs border-b border-brand-border">
                    <th className="px-4 md:px-6 py-3">Order Number</th>
                    <th className="px-4 md:px-6 py-3">Customer</th>
                    <th className="px-4 md:px-6 py-3">Items Qty</th>
                    <th className="px-4 md:px-6 py-3">Total Amount</th>
                    <th className="px-4 md:px-6 py-3">Placed Date</th>
                    <th className="px-4 md:px-6 py-3">Status</th>
                    <th className="px-4 md:px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-sm">
                  {filteredOrders.map((order) => {
                    const totalQty = order.items.reduce((acc, item) => acc + item.quantity, 0);
                    return (
                      <tr key={order._id} className="hover:bg-brand-light-gray/50 transition-colors">
                        <td className="px-4 md:px-6 py-4 font-mono font-semibold text-brand-black">
                          {order.orderNumber}
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div className="font-semibold text-brand-black">{order.customerName}</div>
                          <div className="text-xs text-brand-gray flex items-center gap-1 mt-0.5">
                            <Phone size={12} className="text-neutral-400" />
                            <span>{order.phone}</span>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 font-semibold text-brand-black">
                          {totalQty}
                        </td>
                        <td className="px-4 md:px-6 py-4 font-bold text-brand-black">
                          ₹{order.totalAmount}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-brand-gray">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 md:px-6 py-4 text-right">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="inline-flex items-center justify-center h-8 px-3 text-xs font-semibold rounded-full border border-brand-border text-brand-black hover:bg-brand-light-gray transition-colors"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
