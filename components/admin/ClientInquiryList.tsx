"use client";

import React from "react";
import { CLIENT_INQUIRIES } from "@/lib/data";
import { useToast } from "@/components/ui/Toast";

export function ClientInquiryList() {
  const { showToast } = useToast();

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-secondary-container text-[20px]">
            contact_mail
          </span>
          <h2 className="font-title-sm text-title-sm text-on-surface">
            طلبات ومعاينات العملاء الواردة
          </h2>
        </div>
        <span className="font-label-sm text-label-sm text-outline">
          3 طلبات جديدة
        </span>
      </div>

      <div className="space-y-space-xs">
        {CLIENT_INQUIRIES.map((inq) => (
          <div
            key={inq.id}
            className="p-space-xs bg-surface-container-low rounded-lg flex items-center justify-between gap-space-xs"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                  {inq.clientName}
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-label-sm font-label-sm bg-secondary-fixed text-on-secondary-fixed">
                  {inq.type}
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {inq.propertyTitle}
              </span>
              <span className="font-label-sm text-label-sm text-outline">
                {inq.date} • {inq.phone}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <a
                href={`tel:${inq.phone.replace(/\s+/g, "")}`}
                aria-label="اتصال بالعميل"
                className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary hover:bg-secondary-container hover:text-on-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">phone</span>
              </a>
              <button
                type="button"
                onClick={() => showToast(`فتح تفاصيل طلب: ${inq.clientName}`)}
                aria-label="تفاصيل الطلب"
                className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
