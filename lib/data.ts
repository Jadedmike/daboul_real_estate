export interface PropertyImage {
  url: string;
  alt: string;
  label?: string;
}

export interface PropertySpec {
  label: string;
  value: string;
  icon: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  governorate: string;
  district: string;
  dealType: "sale" | "rent";
  propertyType: "apartment" | "villa" | "office" | "shop" | "land";
  price: string;
  priceNumeric: number;
  priceNote?: string;
  isNegotiable?: boolean;
  badges: string[];
  badgeHighlight?: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  floor?: string;
  publishedTime: string;
  imageUrl: string;
  imageAlt: string;
  images?: PropertyImage[];
  specs?: PropertySpec[];
  features?: string[];
  description?: string[];
  cadastralStatus?: string;
  paymentTerms?: string;
}

export interface District {
  id: string;
  name: string;
}

export interface Governorate {
  id: string;
  name: string;
  propertyCount: number;
  image?: string;
  districts: District[];
}

export interface AdminProperty {
  id: string;
  code: string;
  title: string;
  location: string;
  type: string;
  price: string;
  deal: "للبيع" | "للإيجار";
  status: "متاح" | "محجوز" | "مباع";
  date: string;
  thumbnail: string;
}

export interface ClientInquiry {
  id: string;
  clientName: string;
  phone: string;
  propertyTitle: string;
  type: "معاينة" | "استفسار";
  date: string;
  status: string;
}

export const GOVERNORATES: Governorate[] = [
  {
    id: "damascus",
    name: "دمشق العاصمة",
    propertyCount: 64,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRp9VHpaEzBhXGu9i0azr_4wkfPjiMzoaQPN8F9wYrPwbf4MV51pqa9aXipNm0V5ObCsB4WGQoYMYEXrRQsprhZXp21TYOcuJI3esK6Vh8HVIavldJCNwilqbNw3Bqj6BUmLcXUHZ05lN0PptDAYnTk_rOd5-_rkNY_cZ6eyRg67knWkoNNMBK7q7xPRwR0ZjCxFsgSCWQNImR6y84Xr7haOamoQpc4OAHxj5zXj7Y9fOmiO-5h9Te",
    districts: [
      { id: "all", name: "كافة مناطق دمشق" },
      { id: "malki", name: "المالكي" },
      { id: "abu-roumaneh", name: "أبو رمانة" },
      { id: "mazzeh", name: "المزة (فيلات / أوتوستراد)" },
      { id: "shaalan", name: "الشعلان" },
      { id: "kafr-sousa", name: "كفر سوسة" },
      { id: "midan", name: "الميدان" },
      { id: "muhajireen", name: "المهاجرين" },
      { id: "rawda", name: "الروضة" },
      { id: "baramkeh", name: "البرامكة" },
    ],
  },
  {
    id: "rif-damascus",
    name: "ريف دمشق",
    propertyCount: 38,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0WVwRFpuMzWcv4ZHNTKBi2iNO14oZLJSDSPr8eogSyKTV0wbqkVaK2_2L_ddaQa9n7I1xq0xQ6j1Mvah-bx84lOpcT-Cseyl1o1lQuNaDDiqWOU4UQ-UmS0G0V4wFwA1BfWl2B6kTjGaGzV3YW-5YVpQavGJF3QzJ2VKghp_-CaHda0yFwMI0A26DxehUev_cQUpJQdK0_512XEqIb1jRNhJnLqkCp_si7OgMKtbckMVm9w0_399s",
    districts: [
      { id: "all", name: "كافة ريف دمشق" },
      { id: "yaafour", name: "يعفور" },
      { id: "saboura", name: "الصبورة" },
      { id: "qura-assad", name: "قرى الأسد" },
      { id: "qudsaya", name: "قدسيا" },
      { id: "jaramana", name: "جرمانا" },
      { id: "sehnaya", name: "صحنايا" },
    ],
  },
  {
    id: "aleppo",
    name: "حلب الشهباء",
    propertyCount: 28,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBar9Vj9kM1_lIlCYhGs_hFQQrcqf-lstNMYrCsxo68MCIsM43gQf4i5HuOc12J-MjLeUfWrB9ijVcOLqHI0MVHQ4M7oEz6iv_UXmLPQJ3HGtROdkURU0BWVzPs9JpeTzQQSC2fqUhMsyr_ec9yVbZEHEpi_hXgOhudKsPgEV4RA_DdsXsFqX5JEpko-93ClyXK5GmwISLzyujl5PEBBKlWqw0yoxN14LzzZvUcOsGm2vYum0SbDPVI",
    districts: [
      { id: "all", name: "كافة مناطق حلب" },
      { id: "shahba", name: "الشهباء" },
      { id: "new-aleppo", name: "حلب الجديدة" },
      { id: "mogambo", name: "الموكامبو" },
      { id: "sabil", name: "السبيل" },
    ],
  },
  {
    id: "latakia",
    name: "اللاذقية والساحل",
    propertyCount: 18,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRp9VHpaEzBhXGu9i0azr_4wkfPjiMzoaQPN8F9wYrPwbf4MV51pqa9aXipNm0V5ObCsB4WGQoYMYEXrRQsprhZXp21TYOcuJI3esK6Vh8HVIavldJCNwilqbNw3Bqj6BUmLcXUHZ05lN0PptDAYnTk_rOd5-_rkNY_cZ6eyRg67knWkoNNMBK7q7xPRwR0ZjCxFsgSCWQNImR6y84Xr7haOamoQpc4OAHxj5zXj7Y9fOmiO-5h9Te",
    districts: [
      { id: "all", name: "كافة مناطق اللاذقية" },
      { id: "corniche", name: "الكورنيش الجنوبي" },
      { id: "american", name: "مشروع الصليبة / الأميركان" },
      { id: "shati-azraq", name: "الشاطئ الأزرق" },
    ],
  },
  {
    id: "tartus",
    name: "طرطوس",
    propertyCount: 14,
    districts: [
      { id: "all", name: "كافة مناطق طرطوس" },
      { id: "waterfront", name: "الكورنيش البحري" },
      { id: "inshaat", name: "الإنشاءات" },
    ],
  },
  {
    id: "homs",
    name: "حمص",
    propertyCount: 22,
    districts: [
      { id: "all", name: "كافة مناطق حمص" },
      { id: "inshaat-homs", name: "الإنشاءات" },
      { id: "dablan", name: "الدبلان" },
      { id: "ghouta", name: "الغوطة" },
    ],
  },
];

export const PROPERTIES: Property[] = [
  {
    id: "malki-penthouse-1",
    title: "شقة فاخرة بإطلالة مفتوحة في المالكي",
    location: "دمشق، حي المالكي الراقي — محيط حديقة الجاحظ",
    governorate: "damascus",
    district: "malki",
    dealType: "sale",
    propertyType: "apartment",
    price: "$1,250,000",
    priceNumeric: 1250000,
    priceNote: "دولار أمريكي",
    isNegotiable: true,
    badges: ["للبيع", "طابو أخضر 2400 سهم"],
    badgeHighlight: "حصري لدى دعبول",
    area: "280 م²",
    bedrooms: "4 (ماستر 2)",
    bathrooms: "3 حمامات",
    floor: "الرابع (بناء حديث)",
    publishedTime: "نُشر حديثاً",
    cadastralStatus: "طابو أخضر نظامي 2400 سهم بريء الذمة",
    paymentTerms: "تحويل بنكي / نقداً",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSWtAtXRGsv70NCoiYsysetiwxVmB1ILOf8gvsDHd5dDNyawUicdD9ICCg-Xf4yYWq3tNN3UXA9Nr5aQUIkDnozAlpZ1yxfUcx2RFUnwQ-M095yb6YpOAZqVFqKj46zXQG2FXOOMetDOGSiHW9xkHSAFnzvfJIDO0iYHrY2Rs-lO7VWbcSk0wtcVEVkkQXlq-D2J4TalAyuXawmkZ3c6MoOcQJHZrX5KOfMAZ3VNtb-uWMRgBWV1jy",
    imageAlt: "صالة استقبال شقة المالكي الفاخرة",
    images: [
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSWtAtXRGsv70NCoiYsysetiwxVmB1ILOf8gvsDHd5dDNyawUicdD9ICCg-Xf4yYWq3tNN3UXA9Nr5aQUIkDnozAlpZ1yxfUcx2RFUnwQ-M095yb6YpOAZqVFqKj46zXQG2FXOOMetDOGSiHW9xkHSAFnzvfJIDO0iYHrY2Rs-lO7VWbcSk0wtcVEVkkQXlq-D2J4TalAyuXawmkZ3c6MoOcQJHZrX5KOfMAZ3VNtb-uWMRgBWV1jy",
        alt: "صالة المعيشة الرئيسية بإطلالة على حديقة الجاحظ",
        label: "صالون الاستقبال",
      },
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjC6DSezvWtw6bEi02pi1lSdKoOqAJY2BKzUSGXhxUIDr1tnOXnOUfx6kPZgwqlz7Zec70WuLD_WQsxJFORZErXDR2ojIxp5Z3nA1JX8DQoPp21_KZY1jKAk-VAC2pb3qoeP5l9gOxfG8enV9dNJAfItMRBhsuaE9TkYThAFYxLoUmnq932D8_R60xuz_nPv-dQnvG1K8VzoqJTa_MSWLqpBACoCcOn34k5t8sTKTAR0umw7bfevMP",
        alt: "تصميم الصالون الداخلي الفاخر",
        label: "جلسة الضيوف",
      },
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2D9koQZQ9wJI9F4VKENAziLC1tph9EKhIR1XmK05AW0b3iBGfTqk76zujV5iaf2ZhPdlaFQ4K_bIgv2xkE9qLYL0VPrcPxqpSm7GoHgUsPjmqAyaUW15CSkPSXWflhpJujfQhp726RoNsFi8ujVd3ur7xpczZZqoUnDQwlEGAJJCRJKU8S4uxX_CrYqxveroYTOGvjW2NrBI0DQeCgIXKBavb6br2Yz8rbONIL17pzR6N4XFifkUX",
        alt: "جناح النوم الرئيسي مع خزائن مدمجة",
        label: "جناح الماستر",
      },
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAg8Tt1qNl0beJcLB4ZVsIDLSd8o90bs5yrv2DYS0-DFl0QL1dyI1zGZpUr0jUiEwuHCRQ61LXZv6n9rSQQLnV_J7h81xkHc3vdAnyn3jcUnTudkJ3MLVrGpKC3ZjUF1ZwhiBUCYn_rMxdlav5dLE-1KNKznnLudQgFHQo6zaSpT5t1LLti4W5lKNmN5rrv-WIaB6scMYGx-RManvtsvdDHujyfNKeMJKHqeklzpJjHSVxMi8ARoGsS",
        alt: "مطبخ إيطالي مصمم بحجر طبيعي",
        label: "المطبخ الحديث",
      },
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcrOVC-f3EBaCaGIuQ3qRt1X0_T2tSoSR8nV5TskuSobCTP4BM5uBxdF3yFkR-y7LQaUAr5p0PM99pt4oCPf9rQI-SdeStZ2DabDBbqzyXfrxrmSsntF3VfC3EaDyv9QQgrEFyW0gvEqgsw5BCM0G25VmKbB0bhDWj7C7tbnegKjbqfN1m-kuGrJCsU007kCmHdIoNTVfwkF7JAIbIfaRoo4R2Flmk-rUIxlsL98EEE8Ps0Wmy3JjL",
        alt: "تراس خارجي واسع مطل على العاصمة",
        label: "التراس البانورامي",
      },
    ],
    specs: [
      { label: "المساحة الإجمالية", value: "280 م²", icon: "straighten" },
      { label: "غرف النوم", value: "4 (ماستر 2)", icon: "bed" },
      { label: "الحمامات والتواليت", value: "3 ماستر", icon: "bathtub" },
      { label: "الطابق والارتفاع", value: "الرابع (بناء 6 طوابق)", icon: "layers" },
      { label: "الوضع القانوني", value: "طابو أخضر 2400 سهم", icon: "verified_user" },
      { label: "المرآب والمواقف", value: "موقفين في القبو", icon: "garage" },
    ],
    features: [
      "إكساء معماري سوبر ديلوكس بحجر الرخام الإيطالي",
      "تدفئة وتكييف مركزي متكامل مع تحكم ذكي بكل غرفة",
      "منظومة طاقة شمسية استطاعة 15 KVA مع بطاريات ليثيوم",
      "مولدة كهربائية للبناء تعمل 24/7 بنظام ATS أوتوماتيكي",
      "مصعد أوتوماتيكي حديث مع بطاقة أمان شخصية",
      "خدمات أمن وحراسة مع كاميرات مراقبة متكاملة",
      "إطلالة مفتوحة ومحمية على حديقة الجاحظ وقاسيون",
    ],
  },
  {
    id: "malki-deluxe-penthouse",
    title: "بنتهاوس فاخر بتشطيب ديلوكس مطل على حديقة الجاحظ",
    location: "دمشق، حي المالكي الراقي، شارع جلال الدين الرومي",
    governorate: "damascus",
    district: "malki",
    dealType: "sale",
    propertyType: "apartment",
    price: "$ 620,000",
    priceNumeric: 620000,
    priceNote: "دولار أمريكي",
    isNegotiable: true,
    badges: ["للبيع", "طابو أخضر 2400 سهم"],
    area: "320 م²",
    bedrooms: "4 نوم + صالون",
    bathrooms: "3 ماستر",
    floor: "الرابع (مصعدين)",
    publishedTime: "نُشر منذ يومين",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkXjUoVuQteW8CItaXe71oa392n75UXKhpzAzRTBJPj4sEfH8n_8EgqRZbWgoSN8O9DtXehaf0mOjAEFw-OQeR8JHtYJZ1nw2wSyKV13IoLsg9yS_6FDZ1I4XlIF1u_h7fwXGon3FYid_A4NYtQ-F9Gl2SOgedY--kX0OFMWPajYDnP8tXc77gbnuseA__0chTujKJiy6fY54v0V3ClFiNCzm49-KKWDl8Yp4-uSdz-_CDgBj9zoPJ",
    imageAlt: "بنتهاوس فاخر بتشطيب ديلوكس في المالكي",
  },
  {
    id: "yaafour-luxury-palace",
    title: "قصر مصغر مع مسبح خاص وحديقة استوائية مصممة هندسياً",
    location: "ريف دمشق، مجمع يعفور السكني الراقي",
    governorate: "rif-damascus",
    district: "yaafour",
    dealType: "sale",
    propertyType: "villa",
    price: "$ 1,450,000",
    priceNumeric: 1450000,
    priceNote: "مع المفروشات",
    badges: ["للبيع الفوري", "فيلا خاصة"],
    badgeHighlight: "VIP",
    area: "1,200 م²",
    bedrooms: "5 أجنحة",
    bathrooms: "6 حمامات",
    floor: "بناء مستقل 3 طوابق",
    publishedTime: "نُشر اليوم",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0WVwRFpuMzWcv4ZHNTKBi2iNO14oZLJSDSPr8eogSyKTV0wbqkVaK2_2L_ddaQa9n7I1xq0xQ6j1Mvah-bx84lOpcT-Cseyl1o1lQuNaDDiqWOU4UQ-UmS0G0V4wFwA1BfWl2B6kTjGaGzV3YW-5YVpQavGJF3QzJ2VKghp_-CaHda0yFwMI0A26DxehUev_cQUpJQdK0_512XEqIb1jRNhJnLqkCp_si7OgMKtbckMVm9w0_399s",
    imageAlt: "فيلا فخمة مع مسبح في يعفور",
  },
  {
    id: "abu-roumaneh-duplex",
    title: "شقة دوبلكس مفروشة بالكامل بمواصفات المنظمات والسفارات",
    location: "دمشق، أبو رمانة، ساحة النجمة بالقرب من السفارات",
    governorate: "damascus",
    district: "abu-roumaneh",
    dealType: "rent",
    propertyType: "apartment",
    price: "$ 2,800",
    priceNumeric: 2800,
    priceNote: "/ شهري (عقد سنوي)",
    badges: ["للإيجار", "مقر دبلوماسي / سكني"],
    badgeHighlight: "مميز",
    area: "240 م²",
    bedrooms: "3 نوم",
    bathrooms: "3 حمامات",
    floor: "الطابق الثاني والثالث",
    publishedTime: "منذ 3 أيام",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvTg8tMz6YiqO0UMZzChDWzxwptkSYblYPgoUQVt7Z4vhwTXTqvF_uEY3VRCzLS0Fc5yBEaVsDs6s6EViJ0xQUpxwonvuGmXo0BQe-YAjx93qWIMsGRK7nNoPKniHWIf6i7uKhdJC07KTZ-ZSm5yPggJv6GRhBnq4M_Fj1mguGgsj3jZSCU2ZjKCypgTwRvOB9H269MsWm5TT6yQ9XE_dAbsiq8IJqk7JrsI7cKrHzq0FKStM3KkH5",
    imageAlt: "شقة دوبلكس مفروشة في أبو رمانة",
  },
  {
    id: "new-aleppo-commercial",
    title: "مقر إداري ومكتب تجاري متطور في حلب الجديدة",
    location: "حلب الشهباء، حلب الجديدة — الشارع التجاري",
    governorate: "aleppo",
    district: "new-aleppo",
    dealType: "sale",
    propertyType: "office",
    price: "$ 390,000",
    priceNumeric: 390000,
    priceNote: "طابو تجاري",
    badges: ["للبيع", "مقر تجاري / طبي"],
    area: "180 م²",
    bedrooms: "5 مكاتب",
    bathrooms: "2 حمام",
    floor: "الأول التجاري",
    publishedTime: "منذ أسبوع",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBar9Vj9kM1_lIlCYhGs_hFQQrcqf-lstNMYrCsxo68MCIsM43gQf4i5HuOc12J-MjLeUfWrB9ijVcOLqHI0MVHQ4M7oEz6iv_UXmLPQJ3HGtROdkURU0BWVzPs9JpeTzQQSC2fqUhMsyr_ec9yVbZEHEpi_hXgOhudKsPgEV4RA_DdsXsFqX5JEpko-93ClyXK5GmwISLzyujl5PEBBKlWqw0yoxN14LzzZvUcOsGm2vYum0SbDPVI",
    imageAlt: "مكتب ومقر تجاري في حلب الجديدة",
  },
];

export const ADMIN_PROPERTIES: AdminProperty[] = [
  {
    id: "prop-1",
    code: "DBL-104",
    title: "شقة بنتهاوس المالكي (حديقة الجاحظ)",
    location: "دمشق • المالكي",
    type: "شقة سكنية",
    price: "$1,250,000",
    deal: "للبيع",
    status: "متاح",
    date: "2026/09/25",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkXjUoVuQteW8CItaXe71oa392n75UXKhpzAzRTBJPj4sEfH8n_8EgqRZbWgoSN8O9DtXehaf0mOjAEFw-OQeR8JHtYJZ1nw2wSyKV13IoLsg9yS_6FDZ1I4XlIF1u_h7fwXGon3FYid_A4NYtQ-F9Gl2SOgedY--kX0OFMWPajYDnP8tXc77gbnuseA__0chTujKJiy6fY54v0V3ClFiNCzm49-KKWDl8Yp4-uSdz-_CDgBj9zoPJ",
  },
  {
    id: "prop-2",
    code: "DBL-108",
    title: "فيلا يعفور الملكية مع مسبح",
    location: "ريف دمشق • يعفور",
    type: "فيلا مستقلة",
    price: "$2,800,000",
    deal: "للبيع",
    status: "محجوز",
    date: "2026/09/22",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0WVwRFpuMzWcv4ZHNTKBi2iNO14oZLJSDSPr8eogSyKTV0wbqkVaK2_2L_ddaQa9n7I1xq0xQ6j1Mvah-bx84lOpcT-Cseyl1o1lQuNaDDiqWOU4UQ-UmS0G0V4wFwA1BfWl2B6kTjGaGzV3YW-5YVpQavGJF3QzJ2VKghp_-CaHda0yFwMI0A26DxehUev_cQUpJQdK0_512XEqIb1jRNhJnLqkCp_si7OgMKtbckMVm9w0_399s",
  },
  {
    id: "prop-3",
    code: "DBL-214",
    title: "دوبلكس السفارات أبو رمانة",
    location: "دمشق • أبو رمانة",
    type: "شقة دوبلكس",
    price: "$3,500/شهري",
    deal: "للإيجار",
    status: "متاح",
    date: "2026/09/18",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvTg8tMz6YiqO0UMZzChDWzxwptkSYblYPgoUQVt7Z4vhwTXTqvF_uEY3VRCzLS0Fc5yBEaVsDs6s6EViJ0xQUpxwonvuGmXo0BQe-YAjx93qWIMsGRK7nNoPKniHWIf6i7uKhdJC07KTZ-ZSm5yPggJv6GRhBnq4M_Fj1mguGgsj3jZSCU2ZjKCypgTwRvOB9H269MsWm5TT6yQ9XE_dAbsiq8IJqk7JrsI7cKrHzq0FKStM3KkH5",
  },
  {
    id: "prop-4",
    code: "DBL-089",
    title: "مقر تجاري أوتوستراد المزة",
    location: "دمشق • المزة",
    type: "مكتب تجاري",
    price: "$450,000",
    deal: "للبيع",
    status: "مباع",
    date: "2026/09/10",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBar9Vj9kM1_lIlCYhGs_hFQQrcqf-lstNMYrCsxo68MCIsM43gQf4i5HuOc12J-MjLeUfWrB9ijVcOLqHI0MVHQ4M7oEz6iv_UXmLPQJ3HGtROdkURU0BWVzPs9JpeTzQQSC2fqUhMsyr_ec9yVbZEHEpi_hXgOhudKsPgEV4RA_DdsXsFqX5JEpko-93ClyXK5GmwISLzyujl5PEBBKlWqw0yoxN14LzzZvUcOsGm2vYum0SbDPVI",
  },
];

export const CLIENT_INQUIRIES: ClientInquiry[] = [
  {
    id: "inq-1",
    clientName: "د. طارق الحكيم",
    phone: "+963 944 112 233",
    propertyTitle: "معاينة بنتهاوس المالكي",
    type: "معاينة",
    date: "اليوم • 11:30 ص",
    status: "بانتظار التواصل",
  },
  {
    id: "inq-2",
    clientName: "م. حسام قنواتي",
    phone: "+963 933 456 789",
    propertyTitle: "استفسار فيلا يعفور الملكية",
    type: "استفسار",
    date: "أمس • 04:15 م",
    status: "تم الرد",
  },
  {
    id: "inq-3",
    clientName: "السيد نبيل زيات",
    phone: "+963 991 887 766",
    propertyTitle: "طلب تفاوض سعر شقة أبو رمانة",
    type: "معاينة",
    date: "28 أيلول",
    status: "مجدول للمعاينة",
  },
];
