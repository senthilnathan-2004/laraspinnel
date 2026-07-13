import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Booking from "@/models/Booking";
import ContactMessage from "@/models/ContactMessage";
import AdminTopbar from "@/components/admin/AdminTopbar";
import StatCard from "@/components/admin/StatCard";
import StatusBadge, { BookingStatus } from "@/components/admin/StatusBadge";
import { BookOpen, Clock, CheckCircle, MessageSquare, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

async function getDashboardData() {
  await connectToDatabase();

  const totalBookings = await Booking.countDocuments();
  const pendingBookings = await Booking.countDocuments({ status: "pending" });
  
  // Confirmed today
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const confirmedToday = await Booking.countDocuments({
    status: "confirmed",
    updatedAt: { $gte: startOfToday },
  });

  // New Messages (unread)
  const newMessages = await ContactMessage.countDocuments({ status: "new" });

  // Recent Bookings (last 5)
  const recentBookingsRaw = await Booking.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const recentBookings = recentBookingsRaw.map((b: any) => ({
    id: b._id.toString(),
    bookingRefId: b.bookingRefId,
    customerName: b.customerName,
    phone: b.phone,
    productType: b.productType,
    varietyOrPackName: b.varietyOrPackName,
    status: b.status as BookingStatus,
    createdAt: b.createdAt.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  }));

  return {
    totalBookings,
    pendingBookings,
    confirmedToday,
    newMessages,
    recentBookings,
  };
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  let data;
  try {
    data = await getDashboardData();
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
    // Fallback data if DB error
    data = {
      totalBookings: 0,
      pendingBookings: 0,
      confirmedToday: 0,
      newMessages: 0,
      recentBookings: [],
    };
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Topbar */}
      <AdminTopbar title="Dashboard" />

      {/* Main Content */}
      <div className="flex-1 p-3 md:p-6 space-y-6 w-full">
        {/* Welcome Section */}
        <div className="bg-white border border-brand-border rounded-2xl p-3 md:p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-brand-black">
              Welcome back, {session.user?.name || "Admin"}!
            </h2>
            <p className="text-brand-gray text-sm mt-1">
              Here is a summary of Ragu Goat Farm bookings and activities.
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 bg-brand-black text-white hover:bg-goat-primary px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200"
          >
            <span>View Public Site</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Bookings"
            value={data.totalBookings}
            icon={<BookOpen size={22} className="text-goat-primary" />}
          />
          <StatCard
            title="Pending Bookings"
            value={data.pendingBookings}
            icon={<Clock size={22} className="text-amber-500" />}
            badge={
              data.pendingBookings > 0
                ? { text: `${data.pendingBookings} action`, variant: "amber" }
                : undefined
            }
          />
          <StatCard
            title="Confirmed Today"
            value={data.confirmedToday}
            icon={<CheckCircle size={22} className="text-green-600" />}
          />
          <StatCard
            title="New Messages"
            value={data.newMessages}
            icon={<MessageSquare size={22} className="text-blue-500" />}
            badge={
              data.newMessages > 0
                ? { text: `${data.newMessages} unread`, variant: "blue" }
                : undefined
            }
          />
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white border border-brand-border rounded-2xl shadow-card overflow-hidden">
          <div className="px-4 md:px-6 py-5 border-b border-brand-border flex items-center justify-between">
            <h3 className="font-display text-lg text-brand-black tracking-wide">
              Recent Bookings
            </h3>
            <Link
              href="/admin/bookings"
              className="text-sm font-semibold text-goat-primary hover:text-goat-hover flex items-center gap-1 transition-colors"
            >
              <span>View All Bookings</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {data.recentBookings.length === 0 ? (
              <div className="p-12 text-center text-brand-gray">
                <BookOpen className="mx-auto mb-3 text-neutral-300" size={40} />
                <p className="text-sm font-medium">No bookings found</p>
                <p className="text-xs mt-1">Bookings submitted by customers will show up here.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-light-gray text-brand-gray font-semibold text-xs border-b border-brand-border">
                    <th className="px-4 md:px-6 py-3">Reference ID</th>
                    <th className="px-4 md:px-6 py-3">Customer</th>
                    <th className="px-4 md:px-6 py-3">Type</th>
                    <th className="px-4 md:px-6 py-3">Variety / Pack</th>
                    <th className="px-4 md:px-6 py-3">Date</th>
                    <th className="px-4 md:px-6 py-3">Status</th>
                    <th className="px-4 md:px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-sm">
                  {data.recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-brand-light-gray/50 transition-colors">
                      <td className="px-4 md:px-6 py-4 font-mono font-semibold text-brand-black">
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
                      <td className="px-4 md:px-6 py-4 font-medium text-brand-black">
                        {booking.varietyOrPackName}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-brand-gray">{booking.createdAt}</td>
                      <td className="px-4 md:px-6 py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <Link
                          href={`/admin/bookings/${booking.id}`}
                          className="inline-flex items-center justify-center h-8 px-3 text-xs font-semibold rounded-full border border-brand-border text-brand-black hover:bg-brand-light-gray transition-colors"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
