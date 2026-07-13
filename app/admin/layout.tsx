import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div className="min-h-screen bg-brand-light-gray flex flex-col">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-brand-light-gray overflow-hidden">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </div>
  );
}
