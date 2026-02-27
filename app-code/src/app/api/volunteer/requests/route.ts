import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// GET /api/volunteer/requests — fetch open help_requests for volunteers (bypasses RLS)
export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const admin = createAdminClient();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status') || 'OPEN';
        const limit = parseInt(searchParams.get('limit') || '20');

        let query = admin.from('help_requests')
            .select(`
                id, title, description, category, urgency, status, location, 
                address, city, state, coordinates, volunteers_needed, volunteers_assigned,
                deadline, visibility, created_at,
                ngo:ngos(id, name, logo_url)
            `)
            .eq('visibility', 'PUBLIC')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (status !== 'ALL') {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching volunteer requests:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data: data || [] });
    } catch (err: any) {
        console.error('Volunteer requests API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
