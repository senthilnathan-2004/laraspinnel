import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import ContactMessage from "@/models/ContactMessage";
import AdminTopbar from "@/components/admin/AdminTopbar";
import StatCard from "@/components/admin/StatCard";
import StatusBadge, { OrderStatus } from "@/components/admin/StatusBadge";
import { ShoppingBag, Clock, IndianRupee, MessageSquare, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

async function getDashboardData() {
  await connectToDatabase();

  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: "pending" });
  
  // Calculate total revenue from non-cancelled orders
  const revenueResult = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // New Messages (unread)
  const newMessages = await ContactMessage.countDocuments({ status: "new" });

  // Recent Orders (last 5)
  const recentOrdersRaw = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const recentOrders = recentOrdersRaw.map((o: any) => ({
    id: o._id.toString(),
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    phone: o.phone,
    itemsCount: o.items.reduce((acc: number, item: any) => acc + item.quantity, 0),
    totalAmount: o.totalAmount,
    status: o.status as OrderStatus,
    createdAt: o.createdAt.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  }));

  return {
    totalOrders,
    pendingOrders,
    totalRevenue,
    newMessages,
    recentOrders,
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
    data = {
      totalOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
      newMessages: 0,
      recentOrders: [],
    };
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Topbar */}
      <AdminTopbar title="Dashboard" />

      {/* Main Content */}
      <div className="flex-1 p-3 md:p-6 space-y-6 w-full animate-in fade-in">
        {/* Welcome Section */}
        <div className="bg-white border border-brand-border rounded-2xl p-3 md:p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-brand-black">
              Welcome back, {session.user?.name || "Admin"}!
            </h2>
            <p className="text-brand-gray text-sm mt-1">
              Here is a summary of Lara's Pinnal orders and messaging activities.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Orders"
            value={data.totalOrders}
            icon={<ShoppingBag size={22} className="text-goat-primary" />}
          />
          <StatCard
            title="Pending Orders"
            value={data.pendingOrders}
            icon={<Clock size={22} className="text-amber-500" />}
            badge={
              data.pendingOrders > 0
                ? { text: `${data.pendingOrders} action`, variant: "amber" }
                : undefined
            }
          />
          <StatCard
            title="Total Revenue"
            value={`₹${data.totalRevenue}`}
            icon={<IndianRupee size={22} className="text-green-600" />}
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

        {/* Recent Orders Section */}
        <div className="bg-white border border-brand-border rounded-2xl shadow-card overflow-hidden">
          <div className="px-4 md:px-6 py-5 border-b border-brand-border flex items-center justify-between">
            <h3 className="font-display text-lg text-brand-black tracking-wide">
              Recent Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-sm font-semibold text-goat-primary hover:text-goat-hover flex items-center gap-1 transition-colors"
            >
              <span>View All Orders</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {data.recentOrders.length === 0 ? (
              <div className="p-12 text-center text-brand-gray">
                <ShoppingBag className="mx-auto mb-3 text-neutral-300" size={40} />
                <p className="text-sm font-medium">No orders found</p>
                <p className="text-xs mt-1">Orders placed by customers will show up here.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-light-gray text-brand-gray font-semibold text-xs border-b border-brand-border">
                    <th className="px-4 md:px-6 py-3">Order Number</th>
                    <th className="px-4 md:px-6 py-3">Customer</th>
                    <th className="px-4 md:px-6 py-3">Items Count</th>
                    <th className="px-4 md:px-6 py-3">Total Amount</th>
                    <th className="px-4 md:px-6 py-3">Date</th>
                    <th className="px-4 md:px-6 py-3">Status</th>
                    <th className="px-4 md:px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-sm">
                  {data.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-brand-light-gray/50 transition-colors">
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
                      <td className="px-4 md:px-6 py-4 text-brand-black font-semibold">
                        {order.itemsCount}
                      </td>
                      <td className="px-4 md:px-6 py-4 font-semibold text-brand-black">
                        ₹{order.totalAmount}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-brand-gray">{order.createdAt}</td>
                      <td className="px-4 md:px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
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
