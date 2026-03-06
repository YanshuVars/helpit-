import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// GET /api/volunteer/assignments — fetch volunteer assignments (bypasses RLS to avoid recursion)
export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const admin = createAdminClient();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status') || 'ALL';
        const type = searchParams.get('type') || 'own';
        const limit = parseInt(searchParams.get('limit') || '20');

        let data: any[] | null = null;
        let error: any = null;

        if (type === 'completed') {
            const result = await admin.from('volunteer_assignments')
                .select('hours_logged, request_id')
                .eq('volunteer_id', user.id)
                .eq('status', 'COMPLETED')
                .limit(limit);
            data = result.data;
            error = result.error;
        } else {
            let query = admin.from('volunteer_assignments')
                .select('id, status, hours_logged, request_id, created_at')
                .eq('volunteer_id', user.id)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (status !== 'ALL') {
                if (status.includes(',')) {
                    query = query.in('status', status.split(','));
                } else {
                    query = query.eq('status', status);
                }
            }

            const result = await query;
            data = result.data;
            error = result.error;
        }

        if (error) {
            console.error('Error fetching volunteer assignments:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data: data || [] });
    } catch (err: any) {
        console.error('Volunteer assignments API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
