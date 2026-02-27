-- =====================================================
-- HELPIT FIX: Auth Trigger Repair (Enum Cast Fix)
-- Run this in Supabase SQL Editor to fix signup
-- =====================================================

-- Drop the broken trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate with proper enum casts
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users (
        id,
        email,
        full_name,
        phone,
        role,
        status,
        skills,
        availability,
        pan_number,
        bio,
        location,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data ->> 'phone',
        COALESCE(NEW.raw_user_meta_data ->> 'role', 'INDIVIDUAL')::user_role,
        'ACTIVE'::user_status,
        CASE 
            WHEN NEW.raw_user_meta_data -> 'skills' IS NOT NULL 
                 AND jsonb_typeof(NEW.raw_user_meta_data -> 'skills') = 'array'
            THEN ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data -> 'skills'))
            ELSE NULL
        END,
        COALESCE((NEW.raw_user_meta_data ->> 'availability')::boolean, false),
        NEW.raw_user_meta_data ->> 'pan_number',
        NEW.raw_user_meta_data ->> 'bio',
        NEW.raw_user_meta_data ->> 'location',
        NOW(),
        NOW()
    );
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't block signup
        RAISE WARNING 'handle_new_user trigger error: % %', SQLERRM, SQLSTATE;
        RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Verify: check enum type names exist
SELECT typname FROM pg_type WHERE typname IN ('user_role', 'user_status');
