-- ====================================================================
-- DABOUL REAL ESTATE (دعبول العقارية) - SUPABASE DATABASE FOUNDATION
-- Migration: 20261003000000_daboul_foundation.sql
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_status') THEN
        CREATE TYPE property_status AS ENUM (
            'draft',
            'available',
            'reserved',
            'sold',
            'rented',
            'hidden'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE transaction_type AS ENUM (
            'sale',
            'rent'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inquiry_status') THEN
        CREATE TYPE inquiry_status AS ENUM (
            'new',
            'contacted',
            'interested',
            'viewing',
            'deal_completed',
            'closed'
        );
    END IF;
END $$;

-- 3. CORE TABLES

-----------------------------------------------------------------------
-- 3.1 GOVERNORATES (المحافظات السورية الـ 14)
-----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS governorates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-----------------------------------------------------------------------
-- 3.2 DISTRICTS (المناطق والأحياء)
-----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    governorate_id UUID NOT NULL REFERENCES governorates(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_governorate_district_slug UNIQUE (governorate_id, slug)
);

-----------------------------------------------------------------------
-- 3.3 PROPERTIES (العقارات)
-----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ar TEXT NOT NULL,
    title_en TEXT,
    description_ar TEXT NOT NULL,
    description_en TEXT,
    property_type TEXT NOT NULL, -- e.g. apartment, villa, office, shop, land
    transaction_type transaction_type NOT NULL DEFAULT 'sale',
    governorate_id UUID NOT NULL REFERENCES governorates(id) ON DELETE RESTRICT,
    district_id UUID NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    address TEXT NOT NULL,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    price NUMERIC(14, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    area NUMERIC(10, 2) NOT NULL, -- in square meters
    bedrooms INT DEFAULT 0,
    bathrooms INT DEFAULT 0,
    floor INT,
    total_floors INT,
    orientation TEXT, -- e.g. قبلي غربي, شمالي شرقي
    legal_status TEXT, -- e.g. طابو أخضر 2400 سهم, حكم محكمة, طابو زراعي
    status property_status NOT NULL DEFAULT 'available',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_offer BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-----------------------------------------------------------------------
-- 3.4 PROPERTY IMAGES (صور العقارات)
-----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_cover BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-----------------------------------------------------------------------
-- 3.5 INQUIRIES (طلبات ومعاينات العملاء)
-----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    message TEXT NOT NULL,
    status inquiry_status NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-----------------------------------------------------------------------
-- 3.6 HOMEPAGE SECTIONS (أقسام الصفحة الرئيسية CMS)
-----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS homepage_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    title_ar TEXT NOT NULL,
    description_ar TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-----------------------------------------------------------------------
-- 3.7 HOMEPAGE SETTINGS (إعدادات الواجهة العامة)
-----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS homepage_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hero_title_ar TEXT NOT NULL,
    hero_description_ar TEXT NOT NULL,
    hero_image TEXT,
    hero_cta_text TEXT,
    hero_cta_link TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_transaction_type ON properties(transaction_type);
CREATE INDEX IF NOT EXISTS idx_properties_governorate_id ON properties(governorate_id);
CREATE INDEX IF NOT EXISTS idx_properties_district_id ON properties(district_id);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_is_featured ON properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_properties_is_offer ON properties(is_offer);

CREATE INDEX IF NOT EXISTS idx_districts_governorate_id ON districts(governorate_id);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_sort_order ON homepage_sections(sort_order);

-- 5. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
    CREATE TRIGGER trg_governorates_updated_at BEFORE UPDATE ON governorates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_districts_updated_at BEFORE UPDATE ON districts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_inquiries_updated_at BEFORE UPDATE ON inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_homepage_sections_updated_at BEFORE UPDATE ON homepage_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_homepage_settings_updated_at BEFORE UPDATE ON homepage_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 6. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS across all tables
ALTER TABLE governorates ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_settings ENABLE ROW LEVEL SECURITY;

-- 6.1 Governorates: Public read active, Admin all
CREATE POLICY "Public can view active governorates"
    ON governorates FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admin full access on governorates"
    ON governorates FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6.2 Districts: Public read active, Admin all
CREATE POLICY "Public can view active districts"
    ON districts FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admin full access on districts"
    ON districts FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6.3 Properties: Public read published/available, Admin all
CREATE POLICY "Public can view available properties"
    ON properties FOR SELECT
    USING (status = 'available');

CREATE POLICY "Admin full access on properties"
    ON properties FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6.4 Property Images: Public read for available properties, Admin all
CREATE POLICY "Public can view images for available properties"
    ON property_images FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = property_images.property_id
            AND properties.status = 'available'
        )
    );

CREATE POLICY "Admin full access on property_images"
    ON property_images FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6.5 Inquiries: Public can insert inquiries, Admin can view and manage
CREATE POLICY "Public can insert new inquiries"
    ON inquiries FOR INSERT
    WITH CHECK (
        length(trim(customer_name)) > 0 AND
        length(trim(phone)) > 0 AND
        length(trim(message)) > 0
    );

CREATE POLICY "Admin full access on inquiries"
    ON inquiries FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6.6 Homepage Sections: Public read enabled, Admin all
CREATE POLICY "Public can view enabled homepage sections"
    ON homepage_sections FOR SELECT
    USING (is_enabled = true);

CREATE POLICY "Admin full access on homepage_sections"
    ON homepage_sections FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6.7 Homepage Settings: Public read, Admin all
CREATE POLICY "Public can view homepage settings"
    ON homepage_settings FOR SELECT
    USING (true);

CREATE POLICY "Admin full access on homepage_settings"
    ON homepage_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7. SUPABASE STORAGE BUCKET CONFIGURATION
-- Note: Insert bucket definition into storage.buckets if exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'property-images',
    'property-images',
    true,
    10485760, -- 10MB limit per image
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

-- Storage RLS Policies
CREATE POLICY "Public Access for property images bucket"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'property-images');

CREATE POLICY "Admin upload access for property images bucket"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Admin update access for property images bucket"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'property-images');

CREATE POLICY "Admin delete access for property images bucket"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'property-images');

-- ====================================================================
-- 8. SEED DATA
-- ====================================================================

-- 8.1 Seed the 14 Syrian Governorates
INSERT INTO governorates (name_ar, name_en, slug, is_active)
VALUES
    ('دمشق', 'Damascus', 'damascus', true),
    ('ريف دمشق', 'Rif Damascus', 'rif-damascus', true),
    ('حلب', 'Aleppo', 'aleppo', true),
    ('حمص', 'Homs', 'homs', true),
    ('حماة', 'Hama', 'hama', true),
    ('اللاذقية', 'Latakia', 'latakia', true),
    ('طرطوس', 'Tartus', 'tartus', true),
    ('إدلب', 'Idlib', 'idlib', true),
    ('درعا', 'Daraa', 'daraa', true),
    ('السويداء', 'As-Suwayda', 'sweida', true),
    ('القنيطرة', 'Quneitra', 'quneitra', true),
    ('دير الزور', 'Deir ez-Zor', 'deir-ez-zor', true),
    ('الرقة', 'Raqqa', 'raqqa', true),
    ('الحسكة', 'Al-Hasakah', 'hasakah', true)
ON CONFLICT (slug) DO UPDATE SET
    name_ar = EXCLUDED.name_ar,
    name_en = EXCLUDED.name_en,
    is_active = EXCLUDED.is_active;

-- 8.2 Seed Explicit Districts Migrated From Existing Project Data
DO $$
DECLARE
    damascus_id UUID;
    rif_damascus_id UUID;
    aleppo_id UUID;
    latakia_id UUID;
    tartus_id UUID;
    homs_id UUID;
BEGIN
    SELECT id INTO damascus_id FROM governorates WHERE slug = 'damascus';
    SELECT id INTO rif_damascus_id FROM governorates WHERE slug = 'rif-damascus';
    SELECT id INTO aleppo_id FROM governorates WHERE slug = 'aleppo';
    SELECT id INTO latakia_id FROM governorates WHERE slug = 'latakia';
    SELECT id INTO tartus_id FROM governorates WHERE slug = 'tartus';
    SELECT id INTO homs_id FROM governorates WHERE slug = 'homs';

    -- Damascus Districts
    IF damascus_id IS NOT NULL THEN
        INSERT INTO districts (governorate_id, name_ar, name_en, slug) VALUES
            (damascus_id, 'المالكي', 'Al-Malki', 'malki'),
            (damascus_id, 'أبو رمانة', 'Abu Roumaneh', 'abu-roumaneh'),
            (damascus_id, 'المزة (فيلات / أوتوستراد)', 'Al-Mazzeh', 'mazzeh'),
            (damascus_id, 'الشعلان', 'Al-Shaalan', 'shaalan'),
            (damascus_id, 'كفر سوسة', 'Kfar Souseh', 'kafr-sousa'),
            (damascus_id, 'الميدان', 'Al-Midan', 'midan'),
            (damascus_id, 'المهاجرين', 'Al-Muhajireen', 'muhajireen'),
            (damascus_id, 'الروضة', 'Al-Rawda', 'rawda'),
            (damascus_id, 'البرامكة', 'Al-Baramkeh', 'baramkeh')
        ON CONFLICT (governorate_id, slug) DO NOTHING;
    END IF;

    -- Rif Damascus Districts
    IF rif_damascus_id IS NOT NULL THEN
        INSERT INTO districts (governorate_id, name_ar, name_en, slug) VALUES
            (rif_damascus_id, 'يعفور', 'Yaafour', 'yaafour'),
            (rif_damascus_id, 'الصبورة', 'Al-Saboura', 'saboura'),
            (rif_damascus_id, 'قرى الأسد', 'Qura Al-Assad', 'qura-assad'),
            (rif_damascus_id, 'قدسيا', 'Qudsaya', 'qudsaya'),
            (rif_damascus_id, 'جرمانا', 'Jaramana', 'jaramana'),
            (rif_damascus_id, 'صحنايا', 'Sehnaya', 'sehnaya')
        ON CONFLICT (governorate_id, slug) DO NOTHING;
    END IF;

    -- Aleppo Districts
    IF aleppo_id IS NOT NULL THEN
        INSERT INTO districts (governorate_id, name_ar, name_en, slug) VALUES
            (aleppo_id, 'الشهباء', 'Al-Shahba', 'shahba'),
            (aleppo_id, 'حلب الجديدة', 'New Aleppo', 'new-aleppo'),
            (aleppo_id, 'الموكامبو', 'Al-Mogambo', 'mogambo'),
            (aleppo_id, 'السبيل', 'Al-Sabil', 'sabil')
        ON CONFLICT (governorate_id, slug) DO NOTHING;
    END IF;

    -- Latakia Districts
    IF latakia_id IS NOT NULL THEN
        INSERT INTO districts (governorate_id, name_ar, name_en, slug) VALUES
            (latakia_id, 'الكورنيش الجنوبي', 'South Corniche', 'corniche'),
            (latakia_id, 'مشروع الصليبة / الأميركان', 'American Project', 'american'),
            (latakia_id, 'الشاطئ الأزرق', 'Blue Beach', 'shati-azraq')
        ON CONFLICT (governorate_id, slug) DO NOTHING;
    END IF;

    -- Tartus Districts
    IF tartus_id IS NOT NULL THEN
        INSERT INTO districts (governorate_id, name_ar, name_en, slug) VALUES
            (tartus_id, 'الكورنيش البحري', 'Maritime Corniche', 'waterfront'),
            (tartus_id, 'الإنشاءات', 'Al-Inshaat', 'inshaat')
        ON CONFLICT (governorate_id, slug) DO NOTHING;
    END IF;

    -- Homs Districts
    IF homs_id IS NOT NULL THEN
        INSERT INTO districts (governorate_id, name_ar, name_en, slug) VALUES
            (homs_id, 'الإنشاءات', 'Al-Inshaat', 'inshaat-homs'),
            (homs_id, 'الدبلان', 'Al-Dablan', 'dablan'),
            (homs_id, 'الغوطة', 'Al-Ghouta', 'ghouta')
        ON CONFLICT (governorate_id, slug) DO NOTHING;
    END IF;
END $$;

-- 8.3 Seed Homepage Sections
INSERT INTO homepage_sections (section_key, title_ar, description_ar, is_enabled, sort_order, configuration)
VALUES
    ('hero', 'الواجهة الرئيسية والبحث', 'بنر العاصمة مع محرك الفلترة والبحث', true, 1, '{"show_deal_tabs": true, "show_price_chips": true}'::jsonb),
    ('special_offers', 'عروض حصرية مميزة', 'فرص عقارية مختارة لفترة محدودة (CMS حي)', true, 2, '{"limit": 3, "badge": "CMS حي"}'::jsonb),
    ('featured_properties', 'عقارات مميزة مختارة', 'عقارات مدققة وموثقة قانونياً من فريق دعبول', true, 3, '{"limit": 4, "show_specs": true}'::jsonb),
    ('locations', 'استكشف حسب المحافظة', 'تغطية شاملة لأهم المدن والمراكز الاستثمارية السورية', true, 4, '{"columns": 2}'::jsonb),
    ('property_types', 'تصفح حسب نوع العقار', 'شقق، فلل، مكاتب، محلات، أراضٍ', true, 5, '{"horizontal_scroll": true}'::jsonb),
    ('why_daboul', 'لماذا تختار دعبول العقارية؟', 'أعمدة الثقة، المصداقية، والتوثيق القانوني', true, 6, '{"pillars_count": 4}'::jsonb),
    ('latest_properties', 'أحدث العقارات المضافة', 'أحدث العروض المسجلة في السجل اليومي', true, 7, '{"limit": 6}'::jsonb),
    ('cta_banner', 'بانر إضافة عقار', 'دعوة الملاك لإضافة وتأجير عقاراتهم', true, 8, '{"button_text": "أضف عقارك الآن مجاناً"}'::jsonb)
ON CONFLICT (section_key) DO UPDATE SET
    title_ar = EXCLUDED.title_ar,
    description_ar = EXCLUDED.description_ar,
    is_enabled = EXCLUDED.is_enabled,
    sort_order = EXCLUDED.sort_order;

-- 8.4 Seed Homepage Settings
INSERT INTO homepage_settings (hero_title_ar, hero_description_ar, hero_image, hero_cta_text, hero_cta_link)
SELECT
    'اكتشف عقارك القادم في سوريا',
    'مجموعة مميزة من العقارات للبيع والإيجار في مختلف المحافظات السورية بأعلى معايير المصداقية والاحترافية المعمارية.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBRp9VHpaEzBhXGu9i0azr_4wkfPjiMzoaQPN8F9wYrPwbf4MV51pqa9aXipNm0V5ObCsB4WGQoYMYEXrRQsprhZXp21TYOcuJI3esK6Vh8HVIavldJCNwilqbNw3Bqj6BUmLcXUHZ05lN0PptDAYnTk_rOd5-_rkNY_cZ6eyRg67knWkoNNMBK7q7xPRwR0ZjCxFsgSCWQNImR6y84Xr7haOamoQpc4OAHxj5zXj7Y9fOmiO-5h9Te',
    'استكشف العقارات',
    '#search-engine'
WHERE NOT EXISTS (SELECT 1 FROM homepage_settings);
