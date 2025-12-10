"use client";

import type { Notification } from "@/lib/types";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { useEffect, useState } from "react";

interface NotificationsProps {
  notifications: Notification[];
  onDismiss?: (id: string) => void;
}

export function Notifications({ notifications, onDismiss }: NotificationsProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Add new notifications
    const newNotifications = notifications.filter(
      (n) => !visibleNotifications.find((v) => v.id === n.id)
    );
    if (newNotifications.length > 0) {
      setVisibleNotifications((prev) => [...prev, ...newNotifications]);
    }
  }, [notifications]);

  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const timers = visibleNotifications.map((notification) =>
      setTimeout(() => {
        setVisibleNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
        onDismiss?.(notification.id);
      }, 5000)
    );

    return () => timers.forEach(clearTimeout);
  }, [visibleNotifications, onDismiss]);

  const handleDismiss = (id: string) => {
    setVisibleNotifications((prev) => prev.filter((n) => n.id !== id));
    onDismiss?.(id);
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colorMap = {
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    error: "bg-red-500/10 border-red-500/30 text-red-400",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    info: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  };

  const iconColorMap = {
    success: "text-emerald-400",
    error: "text-red-400",
    warning: "text-amber-400",
    info: "text-blue-400",
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
      {visibleNotifications.map((notification) => {
        const Icon = iconMap[notification.type];
        return (
          <div
            key={notification.id}
            className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm animate-slide-in ${
              colorMap[notification.type]
            }`}
            style={{
              animation: "slideIn 0.3s ease-out",
            }}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 ${iconColorMap[notification.type]}`} />
            <p className="text-sm text-white flex-1">{notification.message}</p>
            <button
              onClick={() => handleDismiss(notification.id)}
              className="text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

