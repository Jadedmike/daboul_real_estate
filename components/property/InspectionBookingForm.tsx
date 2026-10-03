"use client";

import React, { useState } from "react";

export function InspectionBookingForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 700);
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
        يرجى إدخال بياناتك وسيقوم مستشارنا العقاري المعتمد بتنسيق الزيارة الميدانية وتزويدك بكافة المخططات الهندسية.
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
        </div>
      ) : (
        <form onSubmit={handleSubmit} id="inspectionForm" className="space-y-space-sm pt-2">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
              الاسم الكامل
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: المهندس عمار الحلبي"
              className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary-container"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
              رقم الهاتف المحمول (واتساب)
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+963 9xx xxx xxx"
              className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary-container text-right"
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
              className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary-container"
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
              className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary-container resize-none"
            />
          </div>

          <button
            type="submit"
            id="submitBtn"
            disabled={isSubmitting}
            className="w-full h-11 bg-primary hover:bg-primary-container text-on-primary font-title-sm text-title-sm rounded-lg flex items-center justify-center gap-space-xs transition-colors shadow-sm cursor-pointer"
          >
            {isSubmitting ? (
              <span>جاري الإرسال...</span>
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
