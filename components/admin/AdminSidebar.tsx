"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Beef,
  BookOpen,
  FileText,
  Image as ImageIcon,
  Megaphone,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Menu,
  CalendarCheck,
  Quote,
  Sparkles,
  PenTool,
} from "lucide-react";
import { Horse } from "@phosphor-icons/react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsMobileOpen(prev => !prev);
    window.addEventListener('toggle-admin-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-admin-sidebar', handleToggle);
  }, []);

  // Close sidebar on route change for mobile
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const { data: messagesData } = useSWR("/api/admin/messages/unread-count", fetcher, { 
    refreshInterval: 60000 
  });
  const unreadCount = messagesData?.count || 0;

  const { data: bookingsData } = useSWR("/api/admin/bookings/pending-count", fetcher, { 
    refreshInterval: 60000 
  });
  const pendingBookingsCount = bookingsData?.count || 0;

  const { data: scheduleData } = useSWR("/api/admin/schedule/count", fetcher, { 
    refreshInterval: 60000 
  });
  const scheduleCount = scheduleData?.count || 0;

  const { data: festivalBookingsData } = useSWR("/api/admin/festival-bookings/pending-count", fetcher, { 
    refreshInterval: 60000 
  });
  const pendingFestivalCount = festivalBookingsData?.count || 0;

  const sidebarItems: SidebarItem[] = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Goat Varieties",
      href: "/admin/goats",
      icon: <Horse size={18} weight="duotone" />,
    },
    {
      name: "Mutton Packs",
      href: "/admin/mutton",
      icon: <Beef size={18} />,
    },
    {
      name: "Bookings",
      href: "/admin/bookings",
      icon: <BookOpen size={18} />,
      badge: pendingBookingsCount,
    },
    {
      name: "Festival Orders",
      href: "/admin/festival-bookings",
      icon: <Sparkles size={18} />,
      badge: pendingFestivalCount,
    },
    {
      name: "Delivery Schedule",
      href: "/admin/schedule",
      icon: <CalendarCheck size={18} />,
      badge: scheduleCount,
    },
    {
      name: "Blog",
      href: "/admin/blog",
      icon: <PenTool size={18} />,
    },
    {
      name: "Gallery",
      href: "/admin/gallery",
      icon: <ImageIcon size={18} />,
    },
    {
      name: "Banners",
      href: "/admin/banners",
      icon: <Megaphone size={18} />,
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: <MessageSquare size={18} />,
      badge: unreadCount,
    },
    {
      name: "Festival Content",
      href: "/admin/festival-content",
      icon: <Megaphone size={18} />,
    },
    {
      name: "Page Content",
      href: "/admin/content",
      icon: <FileText size={18} />,
    },
    {
      name: "Testimonials",
      href: "/admin/testimonials",
      icon: <Quote size={18} />,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings size={18} />,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <aside
        className={`bg-brand-black text-white h-screen fixed md:sticky top-0 left-0 z-40 flex flex-col justify-between transition-all duration-300 border-r border-neutral-800 ${
          isCollapsed ? "w-16" : "w-60"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
      <div>
        {/* Logo and collapse button */}
        <div className="p-3 md:p-4 flex items-center justify-between border-b border-neutral-800 h-16">
          {!isCollapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <span className="font-display text-xl tracking-wider text-goat-primary">
                RAGU FARM
              </span>
              <span className="bg-neutral-800 text-[10px] text-neutral-400 px-1.5 py-0.5 rounded font-mono">
                ADMIN
              </span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/admin" className="mx-auto text-xl font-display text-goat-primary">
              R
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex hover:bg-neutral-800 p-1.5 rounded text-neutral-400 hover:text-white"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group relative ${
                  isActive
                    ? "bg-white/10 text-white font-medium border-l-4 border-goat-primary pl-2"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                <div className={isActive ? "text-goat-primary" : "text-neutral-400 group-hover:text-white"}>
                  {item.icon}
                </div>
                {!isCollapsed && <span className="truncate flex-1">{item.name}</span>}
                
                {/* Badge */}
                {item.badge !== undefined && item.badge > 0 && !isCollapsed && (
                  <span className="bg-mutton-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
                
                {item.badge !== undefined && item.badge > 0 && isCollapsed && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-mutton-primary rounded-full"></span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-brand-black border border-neutral-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-neutral-800 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-neutral-400 hover:bg-neutral-900 hover:text-white rounded-lg text-sm"
        >
          <ExternalLink size={18} />
          {!isCollapsed && <span>View Live Site</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 text-neutral-400 hover:bg-red-950/20 hover:text-red-400 rounded-lg text-sm w-full text-left"
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
    </>
  );
}
