// Help Request API Helper Functions
import { createClient } from '@/lib/supabase/client';
import type {
    HelpRequest,
    HelpRequestInsert,
    HelpRequestUpdate,
    RequestMedia,
    RequestComment,
    VolunteerAssignment,
    RequestCategory,
    RequestStatus,
    RequestUrgency,
    AssignmentStatus,
} from '@/types/database';

// ============================================
// REQUEST CRUD FUNCTIONS
// ============================================

export async function getRequestById(id: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('help_requests')
        .select(`
      *,
      ngo:ngos(id, name, logo_url),
      creator:users(id, full_name, avatar_url),
      media:request_media(*),
      assignments:volunteer_assignments(
        *,
        volunteer:users(id, full_name, avatar_url)
      )
    `)
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as HelpRequest & {
        ngo: { id: string; name: string; logo_url: string | null };
        creator: { id: string; full_name: string; avatar_url: string | null };
        media: RequestMedia[];
        assignments: (VolunteerAssignment & {
            volunteer: { id: string; full_name: string; avatar_url: string | null };
        })[];
    };
}

export async function createRequest(request: HelpRequestInsert) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('help_requests')
        .insert(request)
        .select()
        .single();

    if (error) throw error;
    return data as HelpRequest;
}

export async function updateRequest(id: string, updates: HelpRequestUpdate) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('help_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as HelpRequest;
}

export async function deleteRequest(id: string) {
    const supabase = createClient();

    const { error } = await supabase
        .from('help_requests')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// ============================================
// REQUEST LISTING & SEARCH
// ============================================

export async function getRequests(options?: {
    ngoId?: string;
    status?: RequestStatus;
    category?: RequestCategory;
    urgency?: RequestUrgency;
    city?: string;
    search?: string;
    page?: number;
    limit?: number;
}) {
    const supabase = createClient();
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabase
        .from('help_requests')
        .select(`
      *,
      ngo:ngos(id, name, logo_url)
    `, { count: 'exact' });

    if (options?.ngoId) {
        query = query.eq('ngo_id', options.ngoId);
    }

    if (options?.status) {
        query = query.eq('status', options.status);
    }

    if (options?.category) {
        query = query.eq('category', options.category);
    }

    if (options?.urgency) {
        query = query.eq('urgency', options.urgency);
    }

    if (options?.city) {
        query = query.ilike('city', `%${options.city}%`);
    }

    if (options?.search) {
        query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
    }

    const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
        requests: data as (HelpRequest & { ngo: { id: string; name: string; logo_url: string | null } })[],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
    };
}

export async function getPublicRequests(options?: {
    category?: RequestCategory;
    urgency?: RequestUrgency;
    city?: string;
    page?: number;
    limit?: number;
}) {
    const supabase = createClient();
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabase
        .from('help_requests')
        .select(`
      *,
      ngo:ngos(id, name, logo_url)
    `, { count: 'exact' })
        .eq('visibility', 'PUBLIC')
        .in('status', ['OPEN', 'IN_PROGRESS']);

    if (options?.category) {
        query = query.eq('category', options.category);
    }

    if (options?.urgency) {
        query = query.eq('urgency', options.urgency);
    }

    if (options?.city) {
        query = query.ilike('city', `%${options.city}%`);
    }

    const { data, error, count } = await query
        .order('urgency', { ascending: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
        requests: data as (HelpRequest & { ngo: { id: string; name: string; logo_url: string | null } })[],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
    };
}

export async function getUrgentRequests(limit: number = 5) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('help_requests')
        .select(`
      *,
      ngo:ngos(id, name, logo_url)
    `)
        .eq('visibility', 'PUBLIC')
        .eq('status', 'OPEN')
        .in('urgency', ['CRITICAL', 'HIGH'])
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data as (HelpRequest & { ngo: { id: string; name: string; logo_url: string | null } })[];
}

// ============================================
// REQUEST STATUS MANAGEMENT
// ============================================

export async function updateRequestStatus(id: string, status: RequestStatus) {
    const supabase = createClient();

    const updates: Record<string, unknown> = { status };

    if (status === 'IN_PROGRESS') {
        updates.started_at = new Date().toISOString();
    } else if (status === 'COMPLETED') {
        updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
        .from('help_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as HelpRequest;
}

export async function startRequest(id: string) {
    return updateRequestStatus(id, 'IN_PROGRESS');
}

export async function completeRequest(id: string) {
    return updateRequestStatus(id, 'COMPLETED');
}

export async function cancelRequest(id: string) {
    return updateRequestStatus(id, 'CANCELLED');
}

// ============================================
// REQUEST MEDIA
// ============================================

export async function uploadRequestMedia(requestId: string, file: File, caption?: string) {
    const supabase = createClient();

    const fileExt = file.name.split('.').pop();
    const fileName = `${requestId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('request-media')
        .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from('request-media')
        .getPublicUrl(fileName);

    const mediaType = file.type.startsWith('image/') ? 'image'
        : file.type.startsWith('video/') ? 'video'
            : 'document';

    const { data, error } = await supabase
        .from('request_media')
        .insert({
            request_id: requestId,
            type: mediaType,
            url: publicUrl,
            caption,
        })
        .select()
        .single();

    if (error) throw error;
    return data as RequestMedia;
}

export async function deleteRequestMedia(mediaId: string) {
    const supabase = createClient();

    // Get media info first
    const { data: media } = await supabase
        .from('request_media')
        .select('url')
        .eq('id', mediaId)
        .single();

    if (media) {
        // Extract path from URL
        const url = new URL(media.url);
        const path = url.pathname.split('/request-media/')[1];

        if (path) {
            await supabase.storage
                .from('request-media')
                .remove([path]);
        }
    }

    const { error } = await supabase
        .from('request_media')
        .delete()
        .eq('id', mediaId);

    if (error) throw error;
}

// ============================================
// REQUEST COMMENTS
// ============================================

export async function getRequestComments(requestId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('request_comments')
        .select(`
      *,
      user:users(id, full_name, avatar_url)
    `)
        .eq('request_id', requestId)
        .is('parent_id', null)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data as (RequestComment & { user: { id: string; full_name: string; avatar_url: string | null } })[];
}

export async function createRequestComment(requestId: string, content: string, parentId?: string) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('request_comments')
        .insert({
            request_id: requestId,
            user_id: authUser.id,
            content,
            parent_id: parentId || null,
        })
        .select(`
      *,
      user:users(id, full_name, avatar_url)
    `)
        .single();

    if (error) throw error;
    return data as RequestComment & { user: { id: string; full_name: string; avatar_url: string | null } };
}

export async function deleteRequestComment(commentId: string) {
    const supabase = createClient();

    const { error } = await supabase
        .from('request_comments')
        .delete()
        .eq('id', commentId);

    if (error) throw error;
}

// ============================================
// VOLUNTEER ASSIGNMENTS
// ============================================

export async function assignVolunteer(requestId: string, volunteerId: string, notes?: string) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('volunteer_assignments')
        .insert({
            request_id: requestId,
            volunteer_id: volunteerId,
            assigned_by: authUser.id,
            notes,
        })
        .select()
        .single();

    if (error) throw error;

    // Update volunteers_assigned count
    await supabase.rpc('increment_volunteers_assigned', { request_id: requestId });

    return data as VolunteerAssignment;
}

export async function updateAssignmentStatus(assignmentId: string, status: AssignmentStatus, feedback?: string, rating?: number) {
    const supabase = createClient();

    const updates: Partial<VolunteerAssignment> = { status };

    if (status === 'IN_PROGRESS') {
        updates.started_at = new Date().toISOString();
    } else if (status === 'COMPLETED') {
        updates.completed_at = new Date().toISOString();
        if (feedback) updates.feedback = feedback;
        if (rating) updates.rating = rating;
    }

    const { data, error } = await supabase
        .from('volunteer_assignments')
        .update(updates)
        .eq('id', assignmentId)
        .select()
        .single();

    if (error) throw error;
    return data as VolunteerAssignment;
}

export async function acceptAssignment(assignmentId: string) {
    return updateAssignmentStatus(assignmentId, 'ACCEPTED');
}

export async function startAssignment(assignmentId: string) {
    return updateAssignmentStatus(assignmentId, 'IN_PROGRESS');
}

export async function completeAssignment(assignmentId: string, hoursLogged: number, feedback?: string, rating?: number) {
    const supabase = createClient();

    const updates: Partial<VolunteerAssignment> = {
        status: 'COMPLETED',
        completed_at: new Date().toISOString(),
        hours_logged: hoursLogged,
    };

    if (feedback) updates.feedback = feedback;
    if (rating) updates.rating = rating;

    const { data, error } = await supabase
        .from('volunteer_assignments')
        .update(updates)
        .eq('id', assignmentId)
        .select()
        .single();

    if (error) throw error;
    return data as VolunteerAssignment;
}

export async function cancelAssignment(assignmentId: string) {
    return updateAssignmentStatus(assignmentId, 'CANCELLED');
}

export async function getVolunteerAssignments(volunteerId?: string, options?: {
    status?: AssignmentStatus;
    page?: number;
    limit?: number;
}) {
    const supabase = createClient();
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabase
        .from('volunteer_assignments')
        .select(`
      *,
      request:help_requests(
        *,
        ngo:ngos(id, name, logo_url)
      )
    `, { count: 'exact' });

    if (volunteerId) {
        query = query.eq('volunteer_id', volunteerId);
    }

    if (options?.status) {
        query = query.eq('status', options.status);
    }

    const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
        assignments: data as (VolunteerAssignment & {
            request: HelpRequest & { ngo: { id: string; name: string; logo_url: string | null } };
        })[],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
    };
}

export async function getCurrentUserAssignments(options?: {
    status?: AssignmentStatus;
    page?: number;
    limit?: number;
}) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    return getVolunteerAssignments(authUser.id, options);
}

// ============================================
// VOLUNTEER OPPORTUNITIES
// ============================================

export async function getVolunteerOpportunities(options?: {
    category?: RequestCategory;
    city?: string;
    lat?: number;
    lng?: number;
    radiusKm?: number;
    page?: number;
    limit?: number;
}) {
    const supabase = createClient();
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabase
        .from('help_requests')
        .select(`
      *,
      ngo:ngos(id, name, logo_url, city, state)
    `, { count: 'exact' })
        .eq('visibility', 'PUBLIC')
        .eq('status', 'OPEN')
        .gt('volunteers_needed', supabase.raw('volunteers_assigned'));

    if (options?.category) {
        query = query.eq('category', options.category);
    }

    if (options?.city) {
        query = query.ilike('city', `%${options.city}%`);
    }

    const { data, error, count } = await query
        .order('urgency', { ascending: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
        opportunities: data as (HelpRequest & { ngo: { id: string; name: string; logo_url: string | null; city: string | null; state: string | null } })[],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
    };
}
