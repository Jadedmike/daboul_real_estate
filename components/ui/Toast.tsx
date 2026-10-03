"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2800);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        id="toastNotification"
        className={`fixed bottom-20 left-4 right-4 bg-primary text-on-primary p-space-sm rounded-lg shadow-xl flex items-center justify-between transition-all duration-300 pointer-events-none z-50 ${
          toast.visible
            ? "translate-y-0 opacity-100"
            : "translate-y-32 opacity-0"
        }`}
      >
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-secondary-container text-[20px]">
            check_circle
          </span>
          <span className="font-label-md text-label-md" id="toastMsg">
            {toast.message}
          </span>
        </div>
        <button
          onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
          className="pointer-events-auto hover:opacity-80"
          aria-label="إغلاق"
        >
          <span className="material-symbols-outlined text-[18px] opacity-70">
            close
          </span>
        </button>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: (msg: string) => {
        if (typeof window !== "undefined") {
          console.log("Toast:", msg);
        }
      },
    };
  }
  return context;
}
