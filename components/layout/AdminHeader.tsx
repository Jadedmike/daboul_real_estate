"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export function AdminHeader() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error during sign out:", err);
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 px-gutter-mobile flex items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs">
          <button
            aria-label="القائمة"
            className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <a
            aria-label="اتصال وتواصل"
            className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-secondary-container transition-colors"
            href="tel:+963900000000"
          >
            <span className="material-symbols-outlined text-[22px]">
              support_agent
            </span>
          </a>
        </div>
        <Link className="flex items-center" href="/">
          <div className="flex flex-col text-right">
            <span className="font-title-sm text-title-sm text-primary font-bold tracking-tight leading-none">
              Axion Digital
            </span>
            <span className="font-label-sm text-label-sm text-outline leading-tight">
              Admin Portal
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-space-xs">
          <button
            aria-label="الإشعارات السريعة"
            className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-secondary-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">
              notifications
            </span>
          </button>
          <div className="relative group flex items-center">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant/30"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VjHL3Xf69kKeZ2xN9LEEp_CJhkGWahcs3SdbNz42Ho-ZCUl-VOAx1aanObqYHxHP1_oTyp_HspbW7HxAHwqJdeGxsZC-V6YN40OqTxm2COSTX7mGTh2OJHy4NjVTDleOUQ15RMMkM1RWE7DPUo4pH8LQNXBKrIE3Pyk2AN1JKybTOfOCHqqTokQfbfnbllNHxUyuNa8AeYaGz12yu3TjDQPZUYmdo95LVgkxIw2T6HTgMfUyaHzeGDRqied-_JBDYl_cGvXdxR"
            />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            id="adminLogoutBtn"
            title="تسجيل الخروج من لوحة الإدارة"
            aria-label="تسجيل الخروج"
            disabled={isLoggingOut}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
