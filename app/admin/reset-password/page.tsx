"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const urlCode = searchParams.get("code");
  const urlError = searchParams.get("error");
  const urlErrorDesc = searchParams.get("error_description");

  const [hasValidSession, setHasValidSession] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // 1. Check if Supabase returned an error in the query parameters
    if (urlError || urlErrorDesc) {
      if (isMounted) {
        setSessionError(
          urlErrorDesc?.includes("expired") || urlError?.includes("otp_expired")
            ? "انتهت صلاحية رابط استعادة كلمة المرور. يرجى طلب رابط جديد."
            : `تعذر التحقق من رابط الاستعادة: ${urlErrorDesc || urlError}`
        );
        setIsVerifying(false);
      }
      return;
    }

    // 2. Also inspect URL hash for errors (implicit flow)
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const hashError = params.get("error_description") || params.get("error");
      if (hashError) {
        if (isMounted) {
          setSessionError(
            hashError.includes("expired")
              ? "انتهت صلاحية رابط استعادة كلمة المرور. يرجى طلب رابط جديد."
              : `تعذر التحقق من رابط الاستعادة: ${hashError}`
          );
          setIsVerifying(false);
        }
        return;
      }
    }

    // 3. Set up auth state change listener for PASSWORD_RECOVERY event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        if (isMounted) {
          setHasValidSession(true);
          setSessionError(null);
          setIsVerifying(false);
        }
      }
    });

    // 4. If PKCE code is provided in URL, exchange it for a session
    const checkAuth = async () => {
      if (urlCode) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(urlCode);
        if (error) {
          if (isMounted) {
            setSessionError(
              "رمز استعادة كلمة المرور غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد."
            );
            setIsVerifying(false);
          }
          return;
        }
        if (data.session && isMounted) {
          setHasValidSession(true);
          setSessionError(null);
          setIsVerifying(false);
          return;
        }
      }

      // 5. Check if an active session already exists in client
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && isMounted) {
        setHasValidSession(true);
        setSessionError(null);
        setIsVerifying(false);
        return;
      }

      // If no code, no session, and timer expires, display invalid session state
      const timer = setTimeout(() => {
        if (isMounted && !hasValidSession) {
          setIsVerifying(false);
          setSessionError(
            "لم يتم العثور على جلسة استعادة صالحة. يرجى استخدام الرابط المرسل إلى بريدك الإلكتروني أو طلب رابط جديد."
          );
        }
      }, 1200);

      return () => clearTimeout(timer);
    };

    checkAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [urlCode, urlError, urlErrorDesc]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!password || !confirmPassword) {
      setFormError("يرجى ملء جميع حقول كلمة المرور.");
      return;
    }

    if (password.length < 8) {
      setFormError("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("كلمتا المرور غير متطابقتين. يرجى التأكد وإعادة المحاولة.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setFormError(
          error.message?.includes("should be different")
            ? "كلمة المرور الجديدة يجب أن تكون مختلفة عن كلمة المرور السابقة."
            : `حدث خطأ أثناء تحديث كلمة المرور: ${error.message}`
        );
        setIsSubmitting(false);
        return;
      }

      // Password updated successfully!
      // Sign out recovery session to ensure fresh login
      await supabase.auth.signOut();
      setIsSuccess(true);
      setIsSubmitting(false);
    } catch {
      setFormError("حدث خطأ غير متوقع أثناء حفظ كلمة المرور. يرجى المحاولة لاحقاً.");
      setIsSubmitting(false);
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
            password
          </span>
          <span>تعيين كلمة المرور الجديدة</span>
        </div>
        <h1 className="font-headline-sm text-headline-sm text-primary font-bold">
          كلمة مرور المشرف
        </h1>
        <p className="font-body-sm text-body-sm text-outline mt-1">
          قم بتعيين كلمة مرور قوية لحماية لوحة إدارة المنصة
        </p>
      </div>

      {/* Loading Verifying State */}
      {isVerifying && (
        <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-9 h-9 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-body-md text-on-surface-variant">
            جاري التحقق من صلاحية رابط الاستعادة...
          </p>
        </div>
      )}

      {/* Invalid Session Error State */}
      {!isVerifying && sessionError && !hasValidSession && (
        <div className="space-y-4">
          <div
            role="alert"
            className="p-space-sm rounded-xl bg-error-container/20 border border-error/30 text-error flex items-start gap-2.5 text-body-sm"
          >
            <span className="material-symbols-outlined text-[22px] shrink-0 mt-0.5">
              error
            </span>
            <div className="flex-1">
              <p className="font-bold mb-1">تعذر المتابعة</p>
              <p className="font-medium leading-relaxed">{sessionError}</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/admin/forgot-password"
              className="w-full h-12 bg-primary text-on-primary rounded-xl font-title-md flex items-center justify-center gap-2 shadow-md hover:bg-primary-container transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">
                refresh
              </span>
              <span>طلب رابط استعادة جديد</span>
            </Link>

            <Link
              href="/admin/login"
              className="w-full h-11 bg-surface-container-low text-on-surface rounded-xl font-label-lg flex items-center justify-center gap-1.5 border border-outline-variant/40 hover:bg-surface-container transition-colors"
            >
              <span>العودة لصفحة تسجيل الدخول</span>
            </Link>
          </div>
        </div>
      )}

      {/* Success State */}
      {!isVerifying && isSuccess && (
        <div className="space-y-5 text-center py-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center border-2 border-primary/30">
            <span className="material-symbols-outlined text-[36px]">
              check_circle
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="font-title-lg text-title-lg font-bold text-primary">
              تم تعيين كلمة المرور بنجاح!
            </h2>
            <p className="font-body-sm text-outline">
              تم تحديث كلمة المرور الخاصة بحساب المشرف. يمكنك الآن المتابعة وتسجيل الدخول.
            </p>
          </div>

          <Link
            href="/admin/login"
            className="w-full h-12 bg-primary text-on-primary rounded-xl font-title-md flex items-center justify-center gap-2 shadow-md hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            <span>الانتقال لتسجيل الدخول</span>
          </Link>
        </div>
      )}

      {/* Valid Recovery Form */}
      {!isVerifying && hasValidSession && !isSuccess && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div
              role="alert"
              className="mb-3 p-space-sm rounded-xl bg-error-container/20 border border-error/30 text-error flex items-start gap-2 text-body-sm"
            >
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                error
              </span>
              <p className="flex-1 font-medium">{formError}</p>
            </div>
          )}

          {/* New Password Field */}
          <div>
            <label
              htmlFor="new-admin-password"
              className="block font-title-sm text-title-sm text-on-surface mb-1.5"
            >
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </span>
              <input
                id="new-admin-password"
                type={showPassword ? "text" : "password"}
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8 أحرف على الأقل"
                required
                disabled={isSubmitting}
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

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirm-admin-password"
              className="block font-title-sm text-title-sm text-on-surface mb-1.5"
            >
              تأكيد كلمة المرور الجديدة
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-[20px]">
                  lock_clock
                </span>
              </span>
              <input
                id="confirm-admin-password"
                type={showConfirmPassword ? "text" : "password"}
                dir="ltr"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أعد إدخال كلمة المرور"
                required
                disabled={isSubmitting}
                className="w-full h-12 pr-11 pl-11 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder:text-outline/60 text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-left disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                }
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-outline hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showConfirmPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="updatePasswordBtn"
            disabled={isSubmitting}
            className="w-full h-12 mt-2 bg-primary text-on-primary rounded-xl font-title-md text-title-md flex items-center justify-center gap-2 shadow-md hover:bg-primary-container transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                <span>جاري حفظ كلمة المرور...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">
                  save
                </span>
                <span>حفظ كلمة المرور الجديدة</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Return link */}
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

export default function AdminResetPasswordPage() {
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
        <ResetPasswordForm />
      </Suspense>

      <div className="mt-6 text-center text-label-sm text-outline">
        <span>منصة دعبول العقارية • جلسة استعادة مشفرة وآمنة</span>
      </div>
    </div>
  );
}
