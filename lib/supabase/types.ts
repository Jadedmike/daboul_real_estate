export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PropertyStatus =
  | "draft"
  | "available"
  | "reserved"
  | "sold"
  | "rented"
  | "hidden";

export type TransactionType = "sale" | "rent";

export type InquiryStatus =
  | "new"
  | "contacted"
  | "interested"
  | "viewing"
  | "deal_completed"
  | "closed";

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      governorates: {
        Row: {
          id: string;
          name_ar: string;
          name_en: string;
          slug: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name_ar: string;
          name_en: string;
          slug: string;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name_ar?: string;
          name_en?: string;
          slug?: string;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      districts: {
        Row: {
          id: string;
          governorate_id: string;
          name_ar: string;
          name_en: string;
          slug: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          governorate_id: string;
          name_ar: string;
          name_en: string;
          slug: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          governorate_id?: string;
          name_ar?: string;
          name_en?: string;
          slug?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      properties: {
        Row: {
          id: string;
          title_ar: string;
          title_en: string | null;
          description_ar: string;
          description_en: string | null;
          property_type: string;
          transaction_type: TransactionType;
          governorate_id: string;
          district_id: string;
          address: string;
          latitude: number | null;
          longitude: number | null;
          price: number;
          currency: string;
          area: number;
          bedrooms: number;
          bathrooms: number;
          floor: number | null;
          total_floors: number | null;
          orientation: string | null;
          legal_status: string | null;
          status: PropertyStatus;
          is_featured: boolean;
          is_offer: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title_ar: string;
          title_en?: string | null;
          description_ar: string;
          description_en?: string | null;
          property_type: string;
          transaction_type?: TransactionType;
          governorate_id: string;
          district_id: string;
          address: string;
          latitude?: number | null;
          longitude?: number | null;
          price: number;
          currency?: string;
          area: number;
          bedrooms?: number;
          bathrooms?: number;
          floor?: number | null;
          total_floors?: number | null;
          orientation?: string | null;
          legal_status?: string | null;
          status?: PropertyStatus;
          is_featured?: boolean;
          is_offer?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title_ar?: string;
          title_en?: string | null;
          description_ar?: string;
          description_en?: string | null;
          property_type?: string;
          transaction_type?: TransactionType;
          governorate_id?: string;
          district_id?: string;
          address?: string;
          latitude?: number | null;
          longitude?: number | null;
          price?: number;
          currency?: string;
          area?: number;
          bedrooms?: number;
          bathrooms?: number;
          floor?: number | null;
          total_floors?: number | null;
          orientation?: string | null;
          legal_status?: string | null;
          status?: PropertyStatus;
          is_featured?: boolean;
          is_offer?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      property_images: {
        Row: {
          id: string;
          property_id: string;
          storage_path: string;
          public_url: string;
          alt_text: string | null;
          sort_order: number;
          is_cover: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          storage_path: string;
          public_url: string;
          alt_text?: string | null;
          sort_order?: number;
          is_cover?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          storage_path?: string;
          public_url?: string;
          alt_text?: string | null;
          sort_order?: number;
          is_cover?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      inquiries: {
        Row: {
          id: string;
          property_id: string | null;
          customer_name: string;
          phone: string;
          whatsapp: string | null;
          email: string | null;
          message: string;
          status: InquiryStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id?: string | null;
          customer_name: string;
          phone: string;
          whatsapp?: string | null;
          email?: string | null;
          message: string;
          status?: InquiryStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string | null;
          customer_name?: string;
          phone?: string;
          whatsapp?: string | null;
          email?: string | null;
          message?: string;
          status?: InquiryStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      homepage_sections: {
        Row: {
          id: string;
          section_key: string;
          title_ar: string;
          description_ar: string | null;
          is_enabled: boolean;
          sort_order: number;
          configuration: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          title_ar: string;
          description_ar?: string | null;
          is_enabled?: boolean;
          sort_order?: number;
          configuration?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_key?: string;
          title_ar?: string;
          description_ar?: string | null;
          is_enabled?: boolean;
          sort_order?: number;
          configuration?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      homepage_settings: {
        Row: {
          id: string;
          hero_title_ar: string;
          hero_description_ar: string;
          hero_image: string | null;
          hero_cta_text: string | null;
          hero_cta_link: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hero_title_ar: string;
          hero_description_ar: string;
          hero_image?: string | null;
          hero_cta_text?: string | null;
          hero_cta_link?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hero_title_ar?: string;
          hero_description_ar?: string;
          hero_image?: string | null;
          hero_cta_text?: string | null;
          hero_cta_link?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

export type AdminUser = Database["public"]["Tables"]["admin_users"]["Row"];
export type AdminUserInsert = Database["public"]["Tables"]["admin_users"]["Insert"];
export type AdminUserUpdate = Database["public"]["Tables"]["admin_users"]["Update"];

export type Governorate = Database["public"]["Tables"]["governorates"]["Row"];
export type GovernorateInsert = Database["public"]["Tables"]["governorates"]["Insert"];
export type GovernorateUpdate = Database["public"]["Tables"]["governorates"]["Update"];

export type District = Database["public"]["Tables"]["districts"]["Row"];
export type DistrictInsert = Database["public"]["Tables"]["districts"]["Insert"];
export type DistrictUpdate = Database["public"]["Tables"]["districts"]["Update"];

export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];
export type PropertyUpdate = Database["public"]["Tables"]["properties"]["Update"];

export type PropertyImage = Database["public"]["Tables"]["property_images"]["Row"];
export type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];
export type HomepageSection = Database["public"]["Tables"]["homepage_sections"]["Row"];
export type HomepageSettings = Database["public"]["Tables"]["homepage_settings"]["Row"];
