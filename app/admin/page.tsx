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
import DashboardAnalytics from "@/components/admin/DashboardAnalytics";
import { ShoppingBag, Clock, IndianRupee, MessageSquare, ArrowRight, Phone, Truck, Package, Calculator, CalendarDays } from "lucide-react";
import Link from "next/link";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready to Ship",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

async function getDashboardData() {
  await connectToDatabase();

  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: "pending" });
  const deliveredOrders = await Order.countDocuments({ status: "delivered" });
  const nonCancelledCount = await Order.countDocuments({ status: { $ne: "cancelled" } });
  const totalProducts = await Product.countDocuments();

  // Calculate total revenue from non-cancelled orders
  const revenueResult = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;
  const avgOrderValue = nonCancelledCount > 0 ? Math.round(totalRevenue / nonCancelledCount) : 0;

  // Revenue this month (server-local month start)
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthRevenueRes = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" }, createdAt: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);
  const revenueThisMonth = monthRevenueRes[0]?.total || 0;

  // ---- Analytics: revenue trend for the last 14 days (bucketed in IST) ----
  const istKey = (d: Date) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d); // en-CA => YYYY-MM-DD
  const dayNum = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit" });
  const dayFull = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short" });

  const start14 = new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000);
  const trendOrders = await Order.find({
    status: { $ne: "cancelled" },
    createdAt: { $gte: start14 },
  })
    .select("totalAmount createdAt")
    .lean();

  const trendMap = new Map<string, number>();
  for (const o of trendOrders as any[]) {
    const k = istKey(new Date(o.createdAt));
    trendMap.set(k, (trendMap.get(k) || 0) + o.totalAmount);
  }
  const revenueTrend = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now.getTime() - (13 - i) * 24 * 60 * 60 * 1000);
    const k = istKey(d);
    return { day: dayNum.format(d), label: dayFull.format(d), total: trendMap.get(k) || 0 };
  });
  const revenueToday = revenueTrend[revenueTrend.length - 1]?.total || 0;

  // ---- Analytics: orders grouped by status ----
  const statusRaw = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const statusCountMap = new Map<string, number>(statusRaw.map((s: any) => [s._id, s.count]));
  const ordersByStatus = (Object.keys(STATUS_LABELS) as OrderStatus[]).map((status) => ({
    status,
    label: STATUS_LABELS[status],
    count: statusCountMap.get(status) || 0,
  }));

  // ---- Analytics: top selling products (by quantity, non-cancelled) ----
  const topProductsRaw = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.name",
        qty: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
    { $sort: { qty: -1 } },
    { $limit: 5 },
  ]);
  const topProducts = topProductsRaw.map((p: any) => ({
    name: p._id || "Unknown",
    qty: p.qty,
    revenue: p.revenue,
  }));

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
    deliveredOrders,
    nonCancelledCount,
    totalProducts,
    totalRevenue,
    avgOrderValue,
    revenueThisMonth,
    revenueToday,
    newMessages,
    recentOrders,
    revenueTrend,
    ordersByStatus,
    topProducts,
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
      deliveredOrders: 0,
      nonCancelledCount: 0,
      totalProducts: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
      revenueThisMonth: 0,
      revenueToday: 0,
      newMessages: 0,
      recentOrders: [],
      revenueTrend: [],
      ordersByStatus: [],
      topProducts: [],
    };
  }

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

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
            className="shrink-0 inline-flex items-center gap-2 bg-brand-black text-white hover:bg-goat-primary px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 whitespace-nowrap"
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
            value={inr(data.totalRevenue)}
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

        {/* Secondary KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Revenue This Month"
            value={inr(data.revenueThisMonth)}
            icon={<CalendarDays size={22} className="text-goat-primary" />}
            badge={
              data.revenueToday > 0
                ? { text: `${inr(data.revenueToday)} today`, variant: "green" }
                : undefined
            }
          />
          <StatCard
            title="Avg Order Value"
            value={inr(data.avgOrderValue)}
            icon={<Calculator size={22} className="text-amber-500" />}
          />
          <StatCard
            title="Delivered Orders"
            value={data.deliveredOrders}
            icon={<Truck size={22} className="text-green-600" />}
          />
          <StatCard
            title="Total Products"
            value={data.totalProducts}
            icon={<Package size={22} className="text-blue-500" />}
          />
        </div>

        {/* Analytics */}
        <DashboardAnalytics
          revenueTrend={data.revenueTrend}
          ordersByStatus={data.ordersByStatus}
          topProducts={data.topProducts}
        />

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
