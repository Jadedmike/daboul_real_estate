-- ====================================================================
-- DABOUL REAL ESTATE (دعبول العقارية) - PHASE 3: ADMIN AUTH & SECURITY
-- Migration: 20261003000001_admin_auth_security.sql
-- ====================================================================

-- 1. ADMIN USERS TABLE (حساب المشرف الوحيد للنظام)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_admin_users_user_id UNIQUE (user_id),
    CONSTRAINT uq_admin_users_email UNIQUE (email)
);

-- Enforce exactly one active administrator in the entire system at DB level
CREATE UNIQUE INDEX IF NOT EXISTS uq_single_active_admin
    ON public.admin_users (is_active)
    WHERE is_active = true;

-- Automated updated_at trigger
DO $$ BEGIN
    CREATE TRIGGER trg_admin_users_updated_at
        BEFORE UPDATE ON public.admin_users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. SECURITY DEFINER FUNCTION FOR ADMIN CHECK
-- Runs with elevated privileges to check if current caller's auth.uid() is the active admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.admin_users
        WHERE user_id = auth.uid()
          AND is_active = true
    );
$$;

-- Grant execution to all callers (the function safely checks auth.uid())
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 3. ENABLE RLS ON ADMIN_USERS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can read their own record
DROP POLICY IF EXISTS "Admin can read own admin record" ON public.admin_users;
CREATE POLICY "Admin can read own admin record"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND is_active = true);

-- Admins can update their own record
DROP POLICY IF EXISTS "Admin can update own admin record" ON public.admin_users;
CREATE POLICY "Admin can update own admin record"
    ON public.admin_users FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4. REPLACE PERMISSIVE "TO authenticated" POLICIES FROM PHASE 2
-- Revoke generic authenticated write access and restrict strictly to verified admin

-- 4.1 GOVERNORATES
DROP POLICY IF EXISTS "Admin full access on governorates" ON public.governorates;
CREATE POLICY "Admin full access on governorates"
    ON public.governorates FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4.2 DISTRICTS
DROP POLICY IF EXISTS "Admin full access on districts" ON public.districts;
CREATE POLICY "Admin full access on districts"
    ON public.districts FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4.3 PROPERTIES
-- Drop old permissive admin policy
DROP POLICY IF EXISTS "Admin full access on properties" ON public.properties;
-- Admin can perform all operations (including viewing drafts/hidden)
CREATE POLICY "Admin full access on properties"
    ON public.properties FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4.4 PROPERTY IMAGES
DROP POLICY IF EXISTS "Admin full access on property_images" ON public.property_images;
CREATE POLICY "Admin full access on property_images"
    ON public.property_images FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4.5 INQUIRIES
DROP POLICY IF EXISTS "Admin full access on inquiries" ON public.inquiries;
CREATE POLICY "Admin full access on inquiries"
    ON public.inquiries FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4.6 HOMEPAGE SECTIONS
DROP POLICY IF EXISTS "Admin full access on homepage_sections" ON public.homepage_sections;
CREATE POLICY "Admin full access on homepage_sections"
    ON public.homepage_sections FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4.7 HOMEPAGE SETTINGS
DROP POLICY IF EXISTS "Admin full access on homepage_settings" ON public.homepage_settings;
CREATE POLICY "Admin full access on homepage_settings"
    ON public.homepage_settings FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4.8 STORAGE BUCKET POLICIES (property-images)
DROP POLICY IF EXISTS "Admin upload access for property images bucket" ON storage.objects;
CREATE POLICY "Admin upload access for property images bucket"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'property-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admin update access for property images bucket" ON storage.objects;
CREATE POLICY "Admin update access for property images bucket"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'property-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admin delete access for property images bucket" ON storage.objects;
CREATE POLICY "Admin delete access for property images bucket"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'property-images' AND public.is_admin());

-- 5. CONVENIENCE FUNCTION TO LINK FIRST ADMIN USER
-- Usage: SELECT link_first_admin_by_email('admin@daboul-realestate.sy');
CREATE OR REPLACE FUNCTION public.link_first_admin_by_email(admin_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_user_id UUID;
BEGIN
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE lower(email) = lower(admin_email);

    IF target_user_id IS NULL THEN
        RETURN 'Error: No user found in auth.users with email: ' || admin_email;
    END IF;

    -- Deactivate any previous admin records
    UPDATE public.admin_users SET is_active = false WHERE is_active = true;

    INSERT INTO public.admin_users (user_id, email, is_active)
    VALUES (target_user_id, admin_email, true)
    ON CONFLICT (user_id) DO UPDATE SET
        is_active = true,
        email = admin_email,
        updated_at = now();

    RETURN 'Success: User ' || admin_email || ' linked as active administrator.';
END;
$$;
