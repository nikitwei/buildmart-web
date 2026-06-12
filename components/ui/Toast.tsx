"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeToast } from "@/redux/slices/ui-slice";
import type { Toast as ToastType } from "@/domain/entities";

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const colorMap = {
  success: "bg-accent",
  error: "bg-error",
  info: "bg-primary",
};

function ToastItem({ toast }: { toast: ToastType }) {
  const dispatch = useAppDispatch();
  const Icon = iconMap[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, 4000);
    return () => clearTimeout(timer);
  }, [dispatch, toast.id]);

  return (
    <div
      className={`${colorMap[toast.type]} text-white px-4 py-3 rounded-lg shadow-modal flex items-center gap-3 min-w-[280px] max-w-sm animate-slide-in`}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm flex-1">{toast.message}</p>
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        className="p-0.5 hover:bg-white/20 rounded transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useAppSelector((s) => s.ui.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
