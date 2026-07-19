import type { Metadata } from "next";
import "../globals.css";

// Static metadata — no per-navigation DB call. Admin pages must never be
// indexed (they sit behind auth), so robots is noindex/nofollow.
export const metadata: Metadata = {
  title: "Admin | Lara's Pinnal",
  description: "Lara's Pinnal admin dashboard.",
  robots: { index: false, follow: false },
};

import { Providers } from "@/components/Providers";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-brand-light-gray/20 w-full relative">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto w-full relative flex flex-col">
        <Providers>{children}</Providers>
      </div>
    </div>
  );
}
