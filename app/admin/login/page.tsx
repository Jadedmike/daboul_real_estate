"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlError === "unauthorized"
      ? "الحساب المدخل غير مصرح له بالوصول إلى لوحة الإدارة."
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Authenticate with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError || !data.user) {
        // Generic error message to prevent user enumeration
        setErrorMessage("بيانات الدخول غير صحيحة. يرجى التحقق والمحاولة مجدداً.");
        setIsLoading(false);
        return;
      }

      // 2. Verify admin identity in admin_users table
      const { data: adminRecord, error: adminCheckError } = await supabase
        .from("admin_users")
        .select("id, is_active")
        .eq("user_id", data.user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (adminCheckError || !adminRecord) {
        // If not the authorized active admin, sign out immediately
        await supabase.auth.signOut();
        setErrorMessage("الحساب المدخل غير مصرح له بالوصول إلى لوحة الإدارة.");
        setIsLoading(false);
        return;
      }

      // 3. Authorized admin: redirect to admin dashboard
      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMessage("حدث خطأ غير متوقع أثناء تسجيل الدخول. يرجى المحاولة لاحقاً.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 p-space-lg sm:p-8">
      {/* Brand & Badge */}
      <div className="flex flex-col items-center text-center mb-space-md">
        <Link href="/" className="inline-flex items-center gap-space-xs mb-3 group">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb_RHzG3bw0UpDH7USvnF4lD89zw4R5IiAup9DZUbfAS_QX_bciTHi9Ctffq6lYEEwO9-ZC8dc3JaT3xd3q5V4Zg4U7p-8-37aD_oIfFyWSZLrpf6bHiMYOX3en1dN-iVwXZ3x1GavkMrS00Oala4UMnqnZM1gTXsKp3Ce8JBht3f-U569u5baAsAexqwuRK2UCyes9ygWO9vv0JbvdV7w5mEM5ES6a_-AaJSztf37PBAfvNlxwpEs67WCCH3HQ6Y0mA"
            alt="دعبول العقارية"
            className="h-11 w-auto object-contain"
          />
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed text-label-sm font-label-sm mb-2">
          <span className="material-symbols-outlined text-[16px] text-secondary">
            shield_lock
          </span>
          <span>بوابة الدخول الآمن للمشرف</span>
        </div>
        <h1 className="font-headline-sm text-headline-sm text-primary font-bold">
          تسجيل دخول المشرف
        </h1>
        <p className="font-body-sm text-body-sm text-outline mt-1">
          لوحة الإدارة المركزية لمنصة دعبول العقارية
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-space-md p-space-sm rounded-xl bg-error-container/20 border border-error/30 text-error flex items-start gap-2 text-body-sm"
        >
          <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
            error
          </span>
          <p className="flex-1 font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label
            htmlFor="admin-email"
            className="block font-title-sm text-title-sm text-on-surface mb-1.5"
          >
            البريد الإلكتروني للمشرف
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </span>
            <input
              id="admin-email"
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@daboul-realestate.sy"
              required
              autoComplete="email"
              disabled={isLoading}
              className="w-full h-12 pr-11 pl-4 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder:text-outline/60 text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-left disabled:opacity-60"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="admin-password"
              className="block font-title-sm text-title-sm text-on-surface"
            >
              كلمة المرور
            </label>
            <Link
              href="/admin/forgot-password"
              className="text-label-sm text-primary hover:text-primary-container transition-colors"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[20px]">lock</span>
            </span>
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
              disabled={isLoading}
              className="w-full h-12 pr-11 pl-11 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder:text-outline/60 text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-left disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-outline hover:text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="adminLoginBtn"
          disabled={isLoading}
          className="w-full h-12 mt-2 bg-primary text-on-primary rounded-xl font-title-md text-title-md flex items-center justify-center gap-2 shadow-md hover:bg-primary-container transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
              <span>جاري التحقق من الهوية...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">login</span>
              <span>تسجيل الدخول</span>
            </>
          )}
        </button>
      </form>

      {/* Return to website */}
      <div className="mt-space-md pt-space-sm border-t border-outline-variant/30 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
          <span>العودة إلى الموقع الرئيسي</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-surface flex flex-col justify-center items-center px-4 py-8"
    >
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-8 flex justify-center items-center shadow-lg">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>

      <div className="mt-6 text-center text-label-sm text-outline">
        <span>منصة دعبول العقارية • جلسة مشفرة عبر Supabase Auth SSL</span>
      </div>
    </div>
  );
}
