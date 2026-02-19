-- ============================================================
-- Helpit NGO Platform - Seed Data
-- seed.sql
-- ============================================================
-- NOTE: This seed data is for development/testing purposes only.
-- Run this AFTER running all migrations.
-- The auth.users entries need to be created via Supabase Auth API
-- or the Supabase dashboard before running this seed.

-- ============================================================
-- SAMPLE NGOs (without auth dependency for testing)
-- ============================================================

-- Insert sample NGOs (these will need real user IDs in production)
-- For testing, we'll use placeholder UUIDs

-- Sample NGO 1: Food Relief Foundation
INSERT INTO public.ngos (
    id,
    name,
    slug,
    description,
    email,
    phone,
    address,
    city,
    state,
    pincode,
    country,
    registration_number,
    categories,
    tags,
    status,
    verification_status,
    has_80g,
    has_12a,
    plan,
    social_links
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Food Relief Foundation',
    'food-relief-foundation',
    'We work to eliminate hunger and food insecurity in urban and rural communities across India.',
    'contact@foodrelief.org',
    '+91-9876543210',
    '123 Relief Road, Sector 5',
    'Mumbai',
    'Maharashtra',
    '400001',
    'India',
    'NGO/MH/2020/001',
    ARRAY['FOOD', 'EMERGENCY'],
    ARRAY['hunger', 'food-security', 'community'],
    'VERIFIED',
    'APPROVED',
    TRUE,
    TRUE,
    'STANDARD',
    '{"facebook": "https://facebook.com/foodrelief", "twitter": "https://twitter.com/foodrelief"}'::JSONB
) ON CONFLICT (id) DO NOTHING;

-- Sample NGO 2: Medical Aid Society
INSERT INTO public.ngos (
    id,
    name,
    slug,
    description,
    email,
    phone,
    address,
    city,
    state,
    pincode,
    country,
    registration_number,
    categories,
    tags,
    status,
    verification_status,
    has_80g,
    has_12a,
    plan,
    social_links
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    'Medical Aid Society',
    'medical-aid-society',
    'Providing free medical care and health education to underprivileged communities.',
    'info@medicalaid.org',
    '+91-9876543211',
    '456 Health Street',
    'Delhi',
    'Delhi',
    '110001',
    'India',
    'NGO/DL/2019/002',
    ARRAY['MEDICAL', 'EDUCATION'],
    ARRAY['healthcare', 'medical', 'community-health'],
    'VERIFIED',
    'APPROVED',
    TRUE,
    TRUE,
    'PREMIUM',
    '{"website": "https://medicalaid.org", "instagram": "https://instagram.com/medicalaid"}'::JSONB
) ON CONFLICT (id) DO NOTHING;

-- Sample NGO 3: Education for All
INSERT INTO public.ngos (
    id,
    name,
    slug,
    description,
    email,
    phone,
    address,
    city,
    state,
    pincode,
    country,
    registration_number,
    categories,
    tags,
    status,
    verification_status,
    has_80g,
    plan,
    social_links
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    'Education for All',
    'education-for-all',
    'Empowering children through quality education and skill development programs.',
    'hello@educationforall.org',
    '+91-9876543212',
    '789 Learning Lane',
    'Bangalore',
    'Karnataka',
    '560001',
    'India',
    'NGO/KA/2021/003',
    ARRAY['EDUCATION', 'CHILD_CARE'],
    ARRAY['education', 'children', 'skills'],
    'VERIFIED',
    'APPROVED',
    TRUE,
    'FREE',
    '{"linkedin": "https://linkedin.com/company/educationforall"}'::JSONB
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SAMPLE HELP REQUESTS (for testing without auth)
-- ============================================================

-- Note: These require valid ngo_id and created_by (user_id)
-- In a real scenario, these would be created by authenticated users

-- ============================================================
-- SAMPLE EVENTS
-- ============================================================

INSERT INTO public.events (
    id,
    ngo_id,
    created_by,
    title,
    description,
    event_type,
    start_date,
    end_date,
    location_type,
    venue_name,
    address,
    city,
    state,
    max_attendees,
    status,
    visibility
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000001', -- Placeholder user ID
    'Annual Food Drive 2026',
    'Join us for our annual food drive to collect non-perishable food items for families in need.',
    'FUNDRAISER',
    CURRENT_DATE + INTERVAL '7 days',
    CURRENT_DATE + INTERVAL '7 days',
    'PHYSICAL',
    'Community Center',
    '123 Relief Road, Sector 5',
    'Mumbai',
    'Maharashtra',
    500,
    'UPCOMING',
    'PUBLIC'
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- VERIFICATION: Check tables were created
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE 'Seed data inserted successfully';
    RAISE NOTICE 'NGOs: %', (SELECT COUNT(*) FROM public.ngos);
    RAISE NOTICE 'Events: %', (SELECT COUNT(*) FROM public.events);
END $$;
