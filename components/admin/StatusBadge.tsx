import React from "react";
import { Clock, CheckCircle, XCircle, Package, Truck, Sparkles } from "lucide-react";

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";

interface StatusBadgeProps {
  status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (statusStr: OrderStatus) => {
    switch (statusStr) {
      case "pending":
        return {
          icon: <Clock size={12} className="shrink-0" />,
          label: "Pending",
          classes: "bg-amber-50 text-amber-800 border-amber-200",
        };
      case "confirmed":
        return {
          icon: <CheckCircle size={12} className="shrink-0" />,
          label: "Confirmed",
          classes: "bg-blue-50 text-blue-800 border-blue-200",
        };
      case "preparing":
        return {
          icon: <Sparkles size={12} className="shrink-0" />,
          label: "Preparing",
          classes: "bg-indigo-50 text-indigo-800 border-indigo-200",
        };
      case "ready":
        return {
          icon: <Package size={12} className="shrink-0" />,
          label: "Ready to Ship",
          classes: "bg-purple-50 text-purple-800 border-purple-200",
        };
      case "delivered":
        return {
          icon: <Truck size={12} className="shrink-0" />,
          label: "Delivered",
          classes: "bg-green-50 text-green-800 border-green-200",
        };
      case "cancelled":
        return {
          icon: <XCircle size={12} className="shrink-0" />,
          label: "Cancelled",
          classes: "bg-red-50 text-red-800 border-red-200",
        };
      default:
        return {
          icon: <Clock size={12} className="shrink-0" />,
          label: "Unknown",
          classes: "bg-gray-50 text-gray-800 border-gray-200",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${config.classes}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}
