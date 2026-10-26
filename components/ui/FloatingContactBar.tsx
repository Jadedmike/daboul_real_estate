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
    ? `مرحباً Axion Digital، أنا مهتم بعقار: "${propertyTitle}". أرجو تزويدي بمزيد من التفاصيل.`
    : "مرحباً Axion Digital، أرغب في الاستفسار عن أحد العقارات المعروضة لديكم.";
  const waLink = formatWhatsAppUrl(effectiveWhatsApp, waMsg);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-space-sm bg-[#F8F6F0]/85 backdrop-blur-2xl border-t border-[#A0BDDB]/35 shadow-[0_-8px_32px_rgba(52,33,27,0.1)] flex items-center gap-space-sm z-50 pb-safe">
      <a
        className="flex-1 h-12 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] rounded-xl flex items-center justify-center gap-space-xs font-title-sm text-title-sm font-bold border border-[#A0BDDB]/20 shadow-md transition-all active:scale-[0.99]"
        href={telLink}
      >
        <span className="material-symbols-outlined text-[20px]">phone</span>
        <span>اتصال هاتفي</span>
      </a>
      <a
        className="flex-1 h-12 bg-[#A0BDDB] hover:bg-[#8faecf] text-[#34211B] rounded-xl flex items-center justify-center gap-space-xs font-title-sm text-title-sm font-bold shadow-md transition-all active:scale-[0.99]"
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="material-symbols-outlined text-[20px]">chat</span>
        <span>واتساب Axion Digital</span>
      </a>
    </div>
  );
}
