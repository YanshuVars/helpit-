-- Run this SQL in your Supabase Dashboard > SQL Editor
-- This creates a SECURITY DEFINER function that bypasses RLS
-- to avoid the infinite recursion in help_requests policies

CREATE OR REPLACE FUNCTION public.get_ngo_help_requests(p_ngo_id UUID)
RETURNS SETOF public.help_requests AS $$
    SELECT * FROM public.help_requests
    WHERE ngo_id = p_ngo_id
    ORDER BY created_at DESC
    LIMIT 50;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_help_request_by_id(p_request_id UUID, p_ngo_id UUID)
RETURNS SETOF public.help_requests AS $$
    SELECT * FROM public.help_requests
    WHERE id = p_request_id AND ngo_id = p_ngo_id
    LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;
