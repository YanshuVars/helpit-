-- =====================================================
-- HELPIT SEED DATA
-- Run this AFTER the auth trigger SQL has been executed.
-- Paste into Supabase SQL Editor → Run
-- =====================================================
-- NOTE: Since user creation goes through auth.users → trigger → public.users,
-- you should create test accounts by registering through the app UI.
-- This seed data creates sample NGOs, requests, events, etc. that will
-- be linked to actual users once they exist.

-- However, we CAN seed data for tables that don't strictly need an auth user
-- or we can reference existing auth users if any exist.

-- ─────────────────────────────────────────────────────
-- STEP 1: Check if any users exist, if not show a message
-- ─────────────────────────────────────────────────────

DO $$
DECLARE
    user_count INTEGER;
    first_user_id UUID;
BEGIN
    SELECT COUNT(*) INTO user_count FROM public.users;
    
    IF user_count = 0 THEN
        RAISE NOTICE 'No users found in public.users table. Please register at least one user through the app first, then re-run this seed script.';
        RAISE NOTICE 'Register users at: http://localhost:3000/register/volunteer, /register/ngo, /register/individual';
        RETURN;
    END IF;

    -- Get the first user to use as creator/owner
    SELECT id INTO first_user_id FROM public.users ORDER BY created_at ASC LIMIT 1;

    -- ─────────────────────────────────────────────────
    -- SEED NGOs
    -- ─────────────────────────────────────────────────
    INSERT INTO public.ngos (id, name, slug, description, categories, status, email, phone, website, address, city, state, country, pincode, registration_number, created_at, updated_at)
    VALUES
        (gen_random_uuid(), 'Hope Foundation', 'hope-foundation', 'Empowering communities through education and healthcare', ARRAY['EDUCATION'], 'VERIFIED'::ngo_status, 'contact@hopefoundation.org', '9876543001', 'https://hopefoundation.org', '123 MG Road', 'Mumbai', 'Maharashtra', 'India', '400001', 'REG-HF-001', NOW(), NOW()),
        (gen_random_uuid(), 'Green Earth Initiative', 'green-earth-initiative', 'Environmental conservation and sustainable development', ARRAY['ENVIRONMENT'], 'VERIFIED'::ngo_status, 'info@greenearth.org', '9876543002', 'https://greenearth.org', '456 Park Street', 'Delhi', 'Delhi', 'India', '110001', 'REG-GE-002', NOW(), NOW()),
        (gen_random_uuid(), 'Shelter For All', 'shelter-for-all', 'Providing housing and support to homeless individuals', ARRAY['SHELTER'], 'VERIFIED'::ngo_status, 'help@shelterforall.org', '9876543003', 'https://shelterforall.org', '789 Anna Nagar', 'Chennai', 'Tamil Nadu', 'India', '600040', 'REG-SA-003', NOW(), NOW()),
        (gen_random_uuid(), 'Feed The Hungry', 'feed-the-hungry', 'Fighting hunger through food distribution and nutrition programs', ARRAY['FOOD'], 'VERIFIED'::ngo_status, 'meals@feedthehungry.org', '9876543004', 'https://feedthehungry.org', '321 Brigade Road', 'Bangalore', 'Karnataka', 'India', '560001', 'REG-FH-004', NOW(), NOW()),
        (gen_random_uuid(), 'Health First NGO', 'health-first-ngo', 'Affordable healthcare for underserved communities', ARRAY['MEDICAL'], 'VERIFIED'::ngo_status, 'care@healthfirst.org', '9876543005', 'https://healthfirst.org', '654 Banjara Hills', 'Hyderabad', 'Telangana', 'India', '500034', 'REG-HFN-005', NOW(), NOW())
    ON CONFLICT DO NOTHING;

    -- Add creator as NGO_ADMIN member of  first NGO
    INSERT INTO public.ngo_members (id, ngo_id, user_id, role, joined_at)
    SELECT gen_random_uuid(), ngos.id, first_user_id, 'NGO_ADMIN'::user_role, NOW()
    FROM public.ngos
    ORDER BY created_at ASC LIMIT 1
    ON CONFLICT DO NOTHING;

    -- ─────────────────────────────────────────────────
    -- SEED HELP REQUESTS
    -- ─────────────────────────────────────────────────
    INSERT INTO public.help_requests (id, title, description, category, urgency, status, ngo_id, created_by, location, volunteers_needed, created_at, updated_at)
    SELECT
        gen_random_uuid(),
        titles.title,
        titles.description,
        titles.category::request_category,
        titles.urgency::request_urgency,
        titles.status::request_status,
        (SELECT id FROM public.ngos ORDER BY created_at ASC LIMIT 1),
        first_user_id,
        titles.location,
        titles.volunteers_needed,
        NOW() - (titles.days_ago || ' days')::interval,
        NOW()
    FROM (VALUES
        ('School Supplies Needed', 'We need notebooks, pens, and textbooks for 200 students in rural Maharashtra', 'EDUCATION', 'HIGH', 'OPEN', 'Nashik District, Maharashtra', 5, 2),
        ('Medical Camp Volunteers', 'Seeking 15 volunteers for a weekend medical camp serving tribal communities', 'MEDICAL', 'MEDIUM', 'OPEN', 'Pune Outskirts, Maharashtra', 15, 5),
        ('Food Distribution Drive', 'Weekly food packets needed for 100 families in flood-affected areas', 'FOOD', 'CRITICAL', 'IN_PROGRESS', 'Kolhapur, Maharashtra', 10, 1),
        ('Blankets for Winter', 'Collecting 500 blankets for homeless shelters before winter', 'SHELTER', 'HIGH', 'OPEN', 'Old Delhi, Delhi', 8, 7),
        ('Tree Plantation Drive', 'Volunteers needed for planting 1000 trees in deforested areas', 'ENVIRONMENT', 'LOW', 'OPEN', 'Aarey Colony, Mumbai', 20, 10)
    ) AS titles(title, description, category, urgency, status, location, volunteers_needed, days_ago)
    ON CONFLICT DO NOTHING;

    -- ─────────────────────────────────────────────────
    -- SEED EVENTS
    -- ─────────────────────────────────────────────────
    INSERT INTO public.events (id, title, description, ngo_id, event_type, status, start_date, end_date, venue_name, location_type, max_attendees, created_by, created_at, updated_at)
    SELECT
        gen_random_uuid(),
        events.title,
        events.description,
        (SELECT id FROM public.ngos ORDER BY created_at ASC LIMIT 1),
        events.event_type::event_type,
        events.status::event_status,
        (NOW() + (events.days_ahead || ' days')::interval)::date,
        (NOW() + (events.days_ahead || ' days')::interval + interval '4 hours')::date,
        events.venue,
        'PHYSICAL',
        events.max_p,
        first_user_id,
        NOW(),
        NOW()
    FROM (VALUES
        ('Annual Charity Gala', 'Join us for an evening of fundraising and community building with live music and dinner', 'FUNDRAISER', 'UPCOMING', 14, 'Taj Hotel, Mumbai', 200),
        ('Community Clean-Up Day', 'Help us clean up local parks and beaches. Gloves and bags provided', 'VOLUNTEER_DRIVE', 'UPCOMING', 7, 'Juhu Beach, Mumbai', 100),
        ('Education Workshop', 'Free computer literacy workshop for underprivileged youth aged 15-25', 'TRAINING', 'UPCOMING', 21, 'Community Center, Pune', 50),
        ('Health Awareness Camp', 'Free health checkups, blood pressure monitoring, and nutrition counseling', 'AWARENESS', 'UPCOMING', 10, 'Town Hall, Delhi', 300),
        ('Tree Plantation Marathon', 'Plant 5000 trees in a single day challenge. Refreshments provided', 'VOLUNTEER_DRIVE', 'UPCOMING', 30, 'Sanjay Gandhi Park, Mumbai', 500)
    ) AS events(title, description, event_type, status, days_ahead, venue, max_p)
    ON CONFLICT DO NOTHING;

    -- ─────────────────────────────────────────────────
    -- SEED POSTS (NGO updates)
    -- ─────────────────────────────────────────────────
    INSERT INTO public.posts (id, title, content, ngo_id, author_id, post_type, visibility, published_at, created_at, updated_at)
    SELECT
        gen_random_uuid(),
        posts.title,
        posts.content,
        (SELECT id FROM public.ngos ORDER BY created_at ASC LIMIT 1),
        first_user_id,
        'UPDATE',
        'PUBLIC',
        NOW() - (posts.days_ago || ' days')::interval,
        NOW() - (posts.days_ago || ' days')::interval,
        NOW()
    FROM (VALUES
        ('Our Impact Report 2025', 'We are proud to share that in 2025, we reached over 50,000 beneficiaries across 12 states. Our education programs helped 5,000 children get access to quality schooling, and our healthcare camps served 15,000 patients.', 3),
        ('Volunteer Spotlight: Making a Difference', 'This month we celebrate our star volunteers who have dedicated over 500 hours collectively to our cause. Their tireless efforts in organizing food drives and tutoring sessions have transformed communities.', 7),
        ('New Partnership Announcement', 'We are thrilled to announce our partnership with Tech4Good Foundation to bring digital literacy programs to 100 villages across rural India. Together, we aim to train 10,000 people in basic computer skills.', 1)
    ) AS posts(title, content, days_ago)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Seed data inserted successfully! Created 5 NGOs, 5 help requests, 5 events, and 3 posts.';
END;
$$;
