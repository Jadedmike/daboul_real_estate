/**
 * Formats a phone number for tel: protocol.
 */
export function formatTelUrl(phone: string): string {
  if (!phone) return "tel:+963112140000";
  const clean = phone.replace(/[^\d+]/g, "");
  return `tel:${clean}`;
}

/**
 * Formats a phone or WhatsApp number into a valid WhatsApp URL.
 */
export function formatWhatsAppUrl(whatsapp: string, text?: string): string {
  if (!whatsapp) return "https://wa.me/963944000000";
  const clean = whatsapp.replace(/\D+/g, "");
  const base = `https://wa.me/${clean}`;
  if (text) {
    return `${base}?text=${encodeURIComponent(text)}`;
  }
  return base;
}
