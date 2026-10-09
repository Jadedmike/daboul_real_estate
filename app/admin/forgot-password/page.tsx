"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني الخاص بالمشرف.");
      return;
    }

    setIsLoading(true);

    try {
      // Determine origin dynamically to support both production domain and local dev
      const origin =
        typeof window !== "undefined" && window.location.origin
          ? window.location.origin
          : "https://daboul-real-estate.vercel.app";

      const redirectTo = `${origin}/admin/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo,
      });

      if (error) {
        if (error.message?.includes("rate limit") || error.code === "over_email_send_rate_limit") {
          setErrorMessage(
            "تم إرسال طلب استعادة مؤخراً. يرجى الانتظار دقيقة واحدة قبل المحاولة مجدداً."
          );
        } else {
          setErrorMessage(
            "تعذر إرسال رابط الاستعادة حالياً. يرجى التحقق من صحة البريد الإلكتروني أو المحاولة لاحقاً."
          );
        }
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        "تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح. يرجى مراجعة صندوق الوارد (أو مجلد الرسائل غير المرغوب فيها Spam) والنقر على الرابط لتعيين كلمة مرور جديدة."
      );
      setIsLoading(false);
    } catch {
      setErrorMessage("حدث خطأ غير متوقع أثناء معالجة الطلب. يرجى المحاولة لاحقاً.");
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
            lock_reset
          </span>
          <span>استعادة حساب المشرف</span>
        </div>
        <h1 className="font-headline-sm text-headline-sm text-primary font-bold">
          استعادة كلمة المرور
        </h1>
        <p className="font-body-sm text-body-sm text-outline mt-1">
          أدخل البريد الإلكتروني المعتمد لتلقي رابط تعيين كلمة المرور
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

      {/* Success Alert */}
      {successMessage && (
        <div
          role="status"
          className="mb-space-md p-space-sm rounded-xl bg-primary/10 border border-primary/30 text-primary flex items-start gap-2 text-body-sm"
        >
          <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5 text-primary">
            check_circle
          </span>
          <p className="flex-1 font-medium leading-relaxed">{successMessage}</p>
        </div>
      )}

      {/* Forgot Password Form */}
      {!successMessage ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-recovery-email"
              className="block font-title-sm text-title-sm text-on-surface mb-1.5"
            >
              البريد الإلكتروني للمشرف
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </span>
              <input
                id="admin-recovery-email"
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

          <button
            type="submit"
            id="sendRecoveryBtn"
            disabled={isLoading}
            className="w-full h-12 mt-2 bg-primary text-on-primary rounded-xl font-title-md text-title-md flex items-center justify-center gap-2 shadow-md hover:bg-primary-container transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                <span>جاري إرسال الرابط...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">send</span>
                <span>إرسال رابط استعادة كلمة المرور</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="text-center pt-2">
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center gap-2 w-full h-12 bg-primary text-on-primary rounded-xl font-title-md shadow-md hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            <span>العودة لصفحة تسجيل الدخول</span>
          </Link>
        </div>
      )}

      {/* Navigation links */}
      <div className="mt-space-md pt-space-sm border-t border-outline-variant/30 flex flex-col items-center gap-2 text-center">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          <span>العودة إلى تسجيل الدخول</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-outline hover:text-on-surface transition-colors"
        >
          <span>الموقع الرئيسي</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminForgotPasswordPage() {
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
        <ForgotPasswordForm />
      </Suspense>

      <div className="mt-6 text-center text-label-sm text-outline">
        <span>منصة دعبول العقارية • استعادة الحساب الآمنة</span>
      </div>
    </div>
  );
}
