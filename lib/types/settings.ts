export interface CompanySettings {
  company_name_ar: string;
  company_name_en: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  short_description: string;
  working_hours: string;
  [key: string]: string | undefined;
}

export interface SettingsActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  company_name_ar: "دعبول العقارية",
  company_name_en: "Daboul Real Estate",
  phone: "+963 11 214 0000",
  whatsapp: "+963 944 000 000",
  email: "info@daboul-realestate.sy",
  address: "دمشق - المزة فيلات غربية / شارع دعبول الرئيسي",
  short_description:
    "الشركة السورية الرائدة في الوساطة والاستثمار والتطوير العقاري. دمشق، ريف دمشق، حلب، والساحل السوري.",
  working_hours: "السبت - الخميس: 9:00 ص - 8:00 م",
};
