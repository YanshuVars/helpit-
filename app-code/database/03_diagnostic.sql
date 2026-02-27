-- =====================================================
-- HELPIT FIX: Auth Trigger Diagnostic & Repair
-- Run this in Supabase SQL Editor
-- =====================================================

-- STEP 1: See actual columns of users table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;
