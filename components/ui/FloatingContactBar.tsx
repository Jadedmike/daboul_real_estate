import { formatTelUrl, formatWhatsAppUrl } from "@/lib/utils/format";

interface FloatingContactBarProps {
  phone?: string;
  whatsapp?: string;
  propertyTitle?: string;
}

export function FloatingContactBar({
  phone,
  whatsapp,
  propertyTitle,
}: FloatingContactBarProps) {
  // If no contact info is passed, use safe defaults
  const effectivePhone = phone || "+963 11 214 0000";
  const effectiveWhatsApp = whatsapp || "+963 944 000 000";

  const telLink = formatTelUrl(effectivePhone);
  const waMsg = propertyTitle
    ? `مرحباً دعبول العقارية، أنا مهتم بعقار: "${propertyTitle}". أرجو تزويدي بمزيد من التفاصيل.`
    : "مرحباً دعبول العقارية، أرغب في الاستفسار عن أحد العقارات المعروضة لديكم.";
  const waLink = formatWhatsAppUrl(effectiveWhatsApp, waMsg);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-space-sm bg-surface-container-lowest/95 backdrop-blur-xl border-t border-surface-container shadow-xl flex items-center gap-space-sm z-50 pb-safe">
      <a
        className="flex-1 h-12 bg-primary hover:bg-primary-container text-on-primary rounded-lg flex items-center justify-center gap-space-xs font-title-sm text-title-sm shadow-md transition-colors"
        href={telLink}
      >
        <span className="material-symbols-outlined text-[20px]">phone</span>
        <span>اتصال هاتفي</span>
      </a>
      <a
        className="flex-1 h-12 bg-secondary-container hover:bg-secondary text-on-primary rounded-lg flex items-center justify-center gap-space-xs font-title-sm text-title-sm shadow-md transition-colors"
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="material-symbols-outlined text-[20px]">chat</span>
        <span>واتساب دعبول</span>
      </a>
    </div>
  );
}
