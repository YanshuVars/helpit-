import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// POST /api/volunteer/apply — apply for an opportunity (bypasses RLS)
export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { request_id } = await req.json();
        if (!request_id) {
            return NextResponse.json({ error: 'request_id is required' }, { status: 400 });
        }

        const admin = createAdminClient();

        // Check if already applied
        const { data: existing } = await admin.from('volunteer_assignments')
            .select('id').eq('volunteer_id', user.id).eq('request_id', request_id).limit(1);

        if (existing && existing.length > 0) {
            return NextResponse.json({ error: 'Already applied', alreadyApplied: true }, { status: 409 });
        }

        // Insert assignment
        const { data, error } = await admin.from('volunteer_assignments').insert({
            request_id,
            volunteer_id: user.id,
            assigned_by: user.id,
            status: 'PENDING',
        }).select('id').single();

        if (error) {
            console.error('Apply error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (err: any) {
        console.error('Volunteer apply API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
