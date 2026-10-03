import React from "react";

interface FloatingContactBarProps {
  phone?: string;
  whatsapp?: string;
}

export function FloatingContactBar({
  phone = "+963900000000",
  whatsapp = "963900000000",
}: FloatingContactBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-space-sm bg-surface-container-lowest/95 backdrop-blur-xl border-t border-surface-container shadow-xl flex items-center gap-space-sm z-50 pb-safe">
      <a
        className="flex-1 h-12 bg-primary hover:bg-primary-container text-on-primary rounded-lg flex items-center justify-center gap-space-xs font-title-sm text-title-sm shadow-md transition-colors"
        href={`tel:${phone}`}
      >
        <span className="material-symbols-outlined text-[20px]">phone</span>
        <span>اتصال هاتفي</span>
      </a>
      <a
        className="flex-1 h-12 bg-secondary-container hover:bg-secondary text-on-primary rounded-lg flex items-center justify-center gap-space-xs font-title-sm text-title-sm shadow-md transition-colors"
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="material-symbols-outlined text-[20px]">chat</span>
        <span>واتساب دعبول</span>
      </a>
    </div>
  );
}
