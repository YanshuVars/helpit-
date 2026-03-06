import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// GET /api/ngo/requests?ngo_id=xxx
// Uses admin client to bypass RLS infinite recursion on help_requests
export async function GET(req: NextRequest) {
    try {
        // Verify the user is authenticated
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const ngoId = searchParams.get('ngo_id');

        if (!ngoId) {
            return NextResponse.json({ error: 'ngo_id is required' }, { status: 400 });
        }

        // Verify the user is a member of this NGO
        const { data: membership } = await supabase
            .from('ngo_members')
            .select('id, role')
            .eq('user_id', user.id)
            .eq('ngo_id', ngoId)
            .limit(1);

        if (!membership || membership.length === 0) {
            return NextResponse.json({ error: 'Not a member of this NGO' }, { status: 403 });
        }

        // Use admin client to bypass RLS for help_requests
        const admin = createAdminClient();

        const { data, error } = await admin
            .from('help_requests')
            .select('id, title, description, category, urgency, status, location, address, city, state, pincode, volunteers_needed, volunteers_assigned, visibility, created_at, updated_at, deadline')
            .eq('ngo_id', ngoId)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Error fetching help_requests:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data: data || [] });
    } catch (err: any) {
        console.error('API error:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}

// POST /api/ngo/requests — create a new request
export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const ngoId = body.ngo_id;

        if (!ngoId) {
            return NextResponse.json({ error: 'ngo_id is required' }, { status: 400 });
        }

        // Verify membership
        const { data: membership } = await supabase
            .from('ngo_members')
            .select('id, role')
            .eq('user_id', user.id)
            .eq('ngo_id', ngoId)
            .limit(1);

        if (!membership || membership.length === 0) {
            return NextResponse.json({ error: 'Not a member of this NGO' }, { status: 403 });
        }

        const admin = createAdminClient();

        // Whitelist allowed fields — prevent injection of ngo_id, status, etc.
        const allowedFields = {
            ngo_id: ngoId, // always use verified ngoId, not from body
            created_by: user.id, // required NOT NULL column
            title: body.title,
            description: body.description || null,
            category: body.category || null,
            urgency: body.urgency || 'MEDIUM',
            status: 'OPEN', // always start as OPEN
            location: body.location || null,
            address: body.address || null,
            city: body.city || null,
            state: body.state || null,
            pincode: body.pincode || null,
            volunteers_needed: body.volunteers_needed || 1,
            visibility: body.visibility || 'PUBLIC',
            deadline: body.deadline || null,
        };

        if (!allowedFields.title) {
            return NextResponse.json({ error: 'title is required' }, { status: 400 });
        }

        const { error } = await admin.from('help_requests').insert(allowedFields);

        if (error) {
            console.error('Error creating request:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
