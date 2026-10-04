"use client";

import React, { useState } from "react";
import { submitPublicInquiry } from "@/lib/actions/inquiries";
import { useToast } from "@/components/ui/Toast";

interface InspectionBookingFormProps {
  propertyId?: string;
  propertyTitle?: string;
}

export function InspectionBookingForm({
  propertyId,
  propertyTitle,
}: InspectionBookingFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Assemble structured message combining date & customer notes
      const messageParts: string[] = [];
      if (date.trim()) {
        messageParts.push(`الموعد المقترح للمعاينة: ${date.trim()}`);
      }
      if (notes.trim()) {
        messageParts.push(`الملاحظات: ${notes.trim()}`);
      }
      const finalMessage =
        messageParts.length > 0
          ? messageParts.join("\n")
          : "طلب معاينة ميدانية واستفسار حول تفاصيل العقار.";

      const result = await submitPublicInquiry({
        customer_name: name,
        phone: phone,
        whatsapp: phone, // Default WhatsApp to contact phone
        email: email.trim() ? email.trim() : null,
        message: finalMessage,
        property_id: propertyId || null,
      });

      if (!result.success) {
        const errText = result.error || "تعذر إرسال الطلب، يرجى المحاولة لاحقاً.";
        setErrorMessage(errText);
        showToast(errText);
        setIsSubmitting(false);
        return;
      }

      // Success
      setIsSuccess(true);
      showToast(result.message || "تم استلام طلبكم بنجاح!");
      // Reset fields
      setName("");
      setPhone("");
      setEmail("");
      setDate("");
      setNotes("");
    } catch (err) {
      console.error("Submission error:", err);
      const fallbackErr = "حدث خطأ غير متوقع أثناء إرسال الطلب.";
      setErrorMessage(fallbackErr);
      showToast(fallbackErr);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setErrorMessage(null);
  };

  return (
    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary-container text-[22px]">
          calendar_month
        </span>
        <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
          حجز موعد معاينة ميدانية للعقار
        </h3>
      </div>
      <p className="font-body-sm text-body-sm text-outline">
        يرجى إدخال بياناتك وسيقوم مستشارنا العقاري المعتمد بتنسيق الزيارة الميدانية وتزويدك بكافة المخططات الهندسية
        {propertyTitle ? ` الخاصة بـ "${propertyTitle}".` : "."}
      </p>

      {isSuccess ? (
        <div
          id="formSuccessMessage"
          className="p-space-md bg-secondary-fixed/50 border border-secondary-container/30 rounded-lg text-center flex flex-col items-center gap-space-xs mt-2"
        >
          <span className="material-symbols-outlined text-secondary-container text-[36px]">
            check_circle
          </span>
          <span className="font-title-sm text-title-sm text-on-surface font-bold">
            تم استلام طلب المعاينة بنجاح
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            سيتواصل معك مستشار دعبول العقاري في أقرب وقت لتأكيد موعد الزيارة.
          </span>
          <button
            type="button"
            onClick={handleResetForm}
            className="mt-2 px-space-md py-1.5 bg-surface text-on-surface border border-outline-variant/50 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors cursor-pointer"
          >
            إرسال طلب آخر
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} id="inspectionForm" className="space-y-space-sm pt-2">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg font-body-sm text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
              الاسم الكامل <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: المهندس عمار الحلبي"
              disabled={isSubmitting}
              className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary-container disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
              رقم الهاتف المحمول (واتساب) <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+963 9xx xxx xxx"
              disabled={isSubmitting}
              className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary-container text-right disabled:opacity-50"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
              البريد الإلكتروني (اختياري)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              disabled={isSubmitting}
              className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary-container text-right disabled:opacity-50"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
              التاريخ والوقت المناسب للمعاينة
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="مثال: غداً بعد الساعة 4 عصراً"
              disabled={isSubmitting}
              className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary-container disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
              ملاحظات أو استفسارات خاصة
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="هل ترغب بالاطلاع على المخطط التنظيمي أو سند الملكية؟"
              disabled={isSubmitting}
              className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary-container resize-none disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            id="submitBtn"
            disabled={isSubmitting}
            className="w-full h-11 bg-primary hover:bg-primary-container text-on-primary font-title-sm text-title-sm rounded-lg flex items-center justify-center gap-space-xs transition-colors shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                <span>جاري الإرسال...</span>
              </span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">
                  send
                </span>
                <span>تأكيد طلب المعاينة الميدانية</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
