"use client";

import React, { createContext, useContext, useState } from "react";

interface AdminSidebarContextValue {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextValue | null>(null);

// Shared between AdminSidebar (which owns the collapse toggle) and AdminTopbar
// (which needs to know the sidebar's current width to position its fixed
// header correctly) — a plain prop can't cross that gap since they're siblings.
export function AdminSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <AdminSidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const ctx = useContext(AdminSidebarContext);
  if (!ctx) {
    throw new Error("useAdminSidebar must be used within AdminSidebarProvider");
  }
  return ctx;
}
