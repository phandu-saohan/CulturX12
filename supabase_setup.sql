-- ============================================================
-- CulturX™ — Supabase Production Setup Script
-- Version: 2.0 | Run in: Supabase SQL Editor
-- ============================================================
-- HƯỚNG DẪN:
--   1. Đăng nhập Supabase Dashboard → SQL Editor
--   2. Paste toàn bộ script này vào và nhấn RUN
--   3. Sau khi xong → vào Authentication > Users > tạo user admin
-- ============================================================


-- ============================================================
-- BƯỚC 1: XÓA BẢNG CŨ NẾU TỒN TẠI (chạy lại an toàn)
-- ============================================================

DROP TABLE IF EXISTS public.culturx_store CASCADE;


-- ============================================================
-- BƯỚC 2: TẠO BẢNG CHÍNH culturx_store
-- (toàn bộ dữ liệu app lưu theo key-value JSONB)
-- ============================================================

CREATE TABLE public.culturx_store (
    key         TEXT        PRIMARY KEY,
    value       JSONB       NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tự động cập nhật updated_at khi upsert
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_culturx_store_updated_at
    BEFORE UPDATE ON public.culturx_store
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Index để tăng tốc query theo key
CREATE INDEX IF NOT EXISTS idx_culturx_store_key ON public.culturx_store (key);
CREATE INDEX IF NOT EXISTS idx_culturx_store_updated ON public.culturx_store (updated_at DESC);


-- ============================================================
-- BƯỚC 3: BẬT ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.culturx_store ENABLE ROW LEVEL SECURITY;

-- Policy 1: Cho phép đọc công khai (public website load data)
CREATE POLICY "public_read_store"
    ON public.culturx_store
    FOR SELECT
    USING (true);

-- Policy 2: Chỉ user đã đăng nhập mới được ghi (CMS admin)
CREATE POLICY "authenticated_write_store"
    ON public.culturx_store
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Policy 3: Service role bypass (cho backend API nếu cần)
CREATE POLICY "service_role_bypass"
    ON public.culturx_store
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');


-- ============================================================
-- BƯỚC 4: SEED DỮ LIỆU MẶC ĐỊNH
-- (hệ thống sẽ load từ đây khi khởi động lần đầu)
-- ============================================================

-- 4.1 Site Data (sẽ được CMS ghi đè, đây là placeholder)
INSERT INTO public.culturx_store (key, value) VALUES (
    'site_data',
    '{}'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- 4.2 Bookings (rỗng ban đầu)
INSERT INTO public.culturx_store (key, value) VALUES (
    'bookings',
    '[]'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- 4.3 Enquiries (rỗng ban đầu)
INSERT INTO public.culturx_store (key, value) VALUES (
    'enquiries',
    '[]'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- 4.4 Orders (rỗng ban đầu)
INSERT INTO public.culturx_store (key, value) VALUES (
    'orders',
    '[]'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- 4.5 Articles (rỗng ban đầu, CMS sẽ tạo)
INSERT INTO public.culturx_store (key, value) VALUES (
    'articles',
    '[]'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- 4.6 Payment Config (mặc định bật tất cả phương thức)
INSERT INTO public.culturx_store (key, value) VALUES (
    'payment_config',
    '{
        "card": {
            "enabled": true,
            "title": "Credit/Debit Card",
            "details": "Card payments via secure gateway"
        },
        "afterpay": {
            "enabled": true,
            "title": "Afterpay AU",
            "details": "Buy now, pay later split into 4"
        },
        "payid": {
            "enabled": true,
            "title": "PayID / Osko",
            "details": "Direct bank transfer to email account",
            "payidEmail": "finance@culturx.com.au",
            "businessAbn": "84 657 788 884"
        },
        "apple_google_pay": {
            "enabled": true,
            "title": "Smart Wallet",
            "details": "Express Apple & Google integrations"
        },
        "paypal": {
            "enabled": true,
            "title": "PayPal AU",
            "details": "Direct checkout with premium buyer protection",
            "paypalEmail": "billing@culturx.com.au"
        }
    }'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- 4.7 App Settings (cấu hình webapp toàn cục)
INSERT INTO public.culturx_store (key, value) VALUES (
    'app_settings',
    '{
        "brand": {
            "name": "CULTURX™",
            "tagline": "Internal. External. Optimized.",
            "domain": "https://culturx.com.au",
            "logoText": "CULTURX™",
            "faviconEmoji": "🧬",
            "faviconUrl": "",
            "primaryColor": "#4f46e5"
        },
        "contact": {
            "email": "GP@Culturx.com.au",
            "phone": "+61 457 788 884",
            "address": "Collins Street",
            "city": "Melbourne",
            "state": "Victoria",
            "country": "Australia",
            "founderName": "Gabriela Popa",
            "founderTitle": "Founder"
        },
        "localization": {
            "currency": "AUD",
            "currencySymbol": "$",
            "locale": "en-AU",
            "timezone": "Australia/Melbourne",
            "targetCity": "Melbourne",
            "targetRegion": "Victoria"
        },
        "integrations": {
            "stripePublicKey": "",
            "googleAnalyticsId": "",
            "googleSearchConsoleId": "",
            "facebookPixelId": "",
            "supabaseUrl": "https://ayvnxquhmbyvljfmsdtq.supabase.co",
            "supabaseAnonKey": ""
        },
        "store": {
            "enableShop": true,
            "enableBodyworks": true,
            "enableArticles": true,
            "enableConcierge": true,
            "maintenanceMode": false,
            "maintenanceMessage": "We are currently upgrading our systems. Check back soon."
        },
        "social": {
            "instagram": "https://instagram.com/culturx",
            "facebook": "",
            "linkedin": "",
            "tiktok": "",
            "youtube": ""
        },
        "notifications": {
            "adminEmail": "GP@Culturx.com.au",
            "adminEmailAlerts": true,
            "orderConfirmEmail": true,
            "bookingConfirmEmail": true,
            "enquiryAlertEmail": true
        }
    }'::jsonb
) ON CONFLICT (key) DO NOTHING;


-- ============================================================
-- BƯỚC 5: GRANT QUYỀN CHO ANON VÀ AUTHENTICATED ROLE
-- ============================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.culturx_store TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.culturx_store TO authenticated;


-- ============================================================
-- BƯỚC 6: HELPER VIEW — Xem nhanh trạng thái data
-- ============================================================

CREATE OR REPLACE VIEW public.culturx_store_summary AS
SELECT
    key,
    updated_at,
    CASE
        WHEN jsonb_typeof(value) = 'array'  THEN jsonb_array_length(value)::text || ' items'
        WHEN jsonb_typeof(value) = 'object' THEN (SELECT count(*)::text || ' fields' FROM jsonb_object_keys(value))
        ELSE 'scalar'
    END AS data_summary,
    pg_size_pretty(octet_length(value::text)::bigint) AS data_size
FROM public.culturx_store
ORDER BY key;

GRANT SELECT ON public.culturx_store_summary TO authenticated;


-- ============================================================
-- BƯỚC 7: KIỂM TRA — Chạy sau khi setup xong
-- ============================================================

-- Xem tất cả keys đã được tạo:
SELECT * FROM public.culturx_store_summary;

-- Xem RLS policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies WHERE tablename = 'culturx_store';


-- ============================================================
-- ✅ SETUP HOÀN TẤT
-- ============================================================
-- Sau khi chạy script này:
--
-- [1] TẠO ADMIN USER:
--     Supabase Dashboard → Authentication → Users
--     → "Add User" → nhập email + password của admin
--     → Bật "Auto Confirm" để không cần verify email
--
-- [2] CẤU HÌNH ENVIRONMENT VARIABLES trên Vercel:
--     NEXT_PUBLIC_SUPABASE_URL     = https://ayvnxquhmbyvljfmsdtq.supabase.co
--     NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = <anon key từ Project Settings>
--
-- [3] Nếu dùng Stripe:
--     STRIPE_SECRET_KEY = sk_live_...  (server-side only)
--     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
--
-- [4] Test kết nối: Mở app → CMS → System Backups
--     Nếu thấy "Successfully synchronized" trong console = OK ✓
-- ============================================================
