import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient, createAdminClient } from '@/lib/supabase/server';

/**
 * POST /api/auth/ensure-user
 * Ensures a user row exists in public.users after signup.
 * Uses the service role to bypass RLS.
 * SECURITY: Validates that caller is authenticated and can only create their own row.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, email, full_name, role, phone, skills, availability } = body;

        if (!id || !email) {
            return NextResponse.json({ error: 'Missing required fields: id, email' }, { status: 400 });
        }

        // Validate allowed roles — prevent privilege escalation
        const ALLOWED_ROLES = ['DONOR', 'INDIVIDUAL', 'VOLUNTEER', 'NGO_ADMIN'];
        if (role && !ALLOWED_ROLES.includes(role)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 403 });
        }

        // Authenticate: verify the caller's session matches the requested user ID
        const serverSupabase = await createServerClient();
        const { data: { user: authUser } } = await serverSupabase.auth.getUser();

        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized — no active session' }, { status: 401 });
        }

        if (authUser.id !== id) {
            return NextResponse.json({ error: 'Forbidden — cannot create user row for another user' }, { status: 403 });
        }

        const supabase = createAdminClient();

        // Check if user already exists
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('id', id)
            .single();

        if (existing) {
            return NextResponse.json({ message: 'User already exists', user: existing });
        }

        // Create the user row
        const { data: newUser, error } = await supabase
            .from('users')
            .insert({
                id,
                email,
                full_name: full_name || email,
                role: role || 'INDIVIDUAL',
                phone: phone || null,
                status: 'ACTIVE',
                skills: skills || null,
                availability: availability ?? false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error('[ensure-user] Insert error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'User created', user: newUser });
    } catch (err) {
        console.error('[ensure-user] Error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
