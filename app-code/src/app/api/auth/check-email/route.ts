import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

const ROLE_LABELS: Record<string, string> = {
    PLATFORM_ADMIN: 'Admin',
    NGO_ADMIN: 'NGO',
    NGO_COORDINATOR: 'NGO',
    NGO_MEMBER: 'NGO',
    VOLUNTEER: 'Volunteer',
    DONOR: 'Donor/Individual',
    INDIVIDUAL: 'Donor/Individual',
};

/**
 * POST /api/auth/check-email
 * Checks if an email is already registered. Uses admin client to bypass RLS.
 * Returns { exists: boolean, roleLabel?: string }
 */
export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const supabase = createAdminClient();
        const { data } = await supabase
            .from('users')
            .select('role')
            .eq('email', email.trim().toLowerCase())
            .limit(1);

        if (data && data.length > 0) {
            return NextResponse.json({
                exists: true,
                roleLabel: ROLE_LABELS[data[0].role] || data[0].role,
            });
        }

        return NextResponse.json({ exists: false });
    } catch (err) {
        console.error('[check-email] Error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
