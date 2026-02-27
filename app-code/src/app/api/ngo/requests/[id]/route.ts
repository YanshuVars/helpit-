import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

// GET /api/ngo/requests/[id]?ngo_id=xxx
// Uses admin client to bypass RLS infinite recursion
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
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

        const admin = createAdminClient();

        const { data, error } = await admin
            .from('help_requests')
            .select('*')
            .eq('id', id)
            .eq('ngo_id', ngoId)
            .single();

        if (error) {
            console.error('Error fetching request:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (err: any) {
        console.error('API error:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/ngo/requests/[id] — update a request
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
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

        // Verify coordinator/admin role
        const { data: membership } = await supabase
            .from('ngo_members')
            .select('id, role')
            .eq('user_id', user.id)
            .eq('ngo_id', ngoId)
            .limit(1);

        if (!membership || membership.length === 0) {
            return NextResponse.json({ error: 'Not a member of this NGO' }, { status: 403 });
        }

        const role = membership[0].role;
        if (role !== 'NGO_ADMIN' && role !== 'NGO_COORDINATOR') {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const admin = createAdminClient();
        const { ngo_id: _, ...updateData } = body;
        updateData.updated_at = new Date().toISOString();

        const { error } = await admin
            .from('help_requests')
            .update(updateData)
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/ngo/requests/[id]?ngo_id=xxx
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
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

        // Verify admin role
        const { data: membership } = await supabase
            .from('ngo_members')
            .select('id, role')
            .eq('user_id', user.id)
            .eq('ngo_id', ngoId)
            .limit(1);

        if (!membership || membership.length === 0 || membership[0].role !== 'NGO_ADMIN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const admin = createAdminClient();
        const { error } = await admin.from('help_requests').delete().eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
