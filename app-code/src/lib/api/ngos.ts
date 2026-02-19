// NGO API Helper Functions
import { createClient } from '@/lib/supabase/client';
import type {
    Ngo,
    NgoInsert,
    NgoUpdate,
    NgoMember,
    HelpRequest,
    Post,
    Event,
    Donation,
    Resource,
    RequestCategory,
    RequestStatus,
    NgoStatus,
    VerificationStatus,
} from '@/types/database';

// ============================================
// NGO CRUD FUNCTIONS
// ============================================

export async function getNgoById(id: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('ngos')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as Ngo;
}

export async function getNgoBySlug(slug: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('ngos')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) throw error;
    return data as Ngo;
}

export async function createNgo(ngo: NgoInsert) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('ngos')
        .insert(ngo)
        .select()
        .single();

    if (error) throw error;
    return data as Ngo;
}

export async function updateNgo(id: string, updates: NgoUpdate) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('ngos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Ngo;
}

export async function deleteNgo(id: string) {
    const supabase = createClient();

    const { error } = await supabase
        .from('ngos')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// ============================================
// NGO LISTING & SEARCH
// ============================================

export async function getNgos(options?: {
    status?: NgoStatus;
    category?: string;
    city?: string;
    state?: string;
    search?: string;
    verified?: boolean;
    page?: number;
    limit?: number;
}) {
    const supabase = createClient();
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabase
        .from('ngos')
        .select('*', { count: 'exact' });

    if (options?.status) {
        query = query.eq('status', options.status);
    }

    if (options?.verified) {
        query = query.eq('verification_status', 'APPROVED');
    }

    if (options?.category) {
        query = query.contains('categories', [options.category]);
    }

    if (options?.city) {
        query = query.ilike('city', `%${options.city}%`);
    }

    if (options?.state) {
        query = query.ilike('state', `%${options.state}%`);
    }

    if (options?.search) {
        query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
    }

    const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
        ngos: data as Ngo[],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
    };
}

export async function getFeaturedNgos(limit: number = 6) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('ngos')
        .select('*')
        .eq('status', 'VERIFIED')
        .eq('verification_status', 'APPROVED')
        .order('rating', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data as Ngo[];
}

export async function searchNgosByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 50,
    limit: number = 20
) {
    const supabase = createClient();

    // Use PostGIS to find NGOs within radius
    const { data, error } = await supabase.rpc('search_ngos_by_location', {
        lat: latitude,
        lng: longitude,
        radius_km: radiusKm,
        result_limit: limit,
    });

    if (error) {
        // Fallback to basic query if RPC doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
            .from('ngos')
            .select('*')
            .eq('status', 'VERIFIED')
            .limit(limit);

        if (fallbackError) throw fallbackError;
        return fallbackData as Ngo[];
    }

    return data as Ngo[];
}

// ============================================
// NGO MEMBERS
// ============================================

export async function getNgoMembers(ngoId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('ngo_members')
        .select(`
      *,
      user:users(*)
    `)
        .eq('ngo_id', ngoId)
        .order('joined_at', { ascending: true });

    if (error) throw error;
    return data as (NgoMember & { user: { id: string; full_name: string; email: string; avatar_url: string | null } })[];
}

export async function addNgoMember(ngoId: string, userId: string, role: 'NGO_ADMIN' | 'NGO_COORDINATOR' | 'NGO_MEMBER' = 'NGO_MEMBER') {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('ngo_members')
        .insert({
            ngo_id: ngoId,
            user_id: userId,
            role,
        })
        .select()
        .single();

    if (error) throw error;
    return data as NgoMember;
}

export async function updateNgoMemberRole(ngoId: string, userId: string, role: 'NGO_ADMIN' | 'NGO_COORDINATOR' | 'NGO_MEMBER') {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('ngo_members')
        .update({ role })
        .eq('ngo_id', ngoId)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) throw error;
    return data as NgoMember;
}

export async function removeNgoMember(ngoId: string, userId: string) {
    const supabase = createClient();

    const { error } = await supabase
        .from('ngo_members')
        .delete()
        .eq('ngo_id', ngoId)
        .eq('user_id', userId);

    if (error) throw error;
}

export async function getCurrentUserNgo() {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return null;

    const { data, error } = await supabase
        .from('ngo_members')
        .select(`
      *,
      ngo:ngos(*)
    `)
        .eq('user_id', authUser.id)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as (NgoMember & { ngo: Ngo }) | null;
}

// ============================================
// NGO HELP REQUESTS
// ============================================

export async function getNgoRequests(ngoId: string, options?: {
    status?: RequestStatus;
    category?: RequestCategory;
    page?: number;
    limit?: number;
}) {
    const supabase = createClient();
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabase
        .from('help_requests')
        .select('*', { count: 'exact' })
        .eq('ngo_id', ngoId);

    if (options?.status) {
        query = query.eq('status', options.status);
    }

    if (options?.category) {
        query = query.eq('category', options.category);
    }

    const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
        requests: data as HelpRequest[],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
    };
}

// ============================================
// NGO STATS
// ============================================

export async function getNgoStats(ngoId: string) {
    const supabase = createClient();

    // Get request stats
    const { data: requests } = await supabase
        .from('help_requests')
        .select('status')
        .eq('ngo_id', ngoId);

    const openRequests = requests?.filter((r: { status: string }) => r.status === 'OPEN').length || 0;
    const inProgressRequests = requests?.filter((r: { status: string }) => r.status === 'IN_PROGRESS').length || 0;
    const completedRequests = requests?.filter((r: { status: string }) => r.status === 'COMPLETED').length || 0;

    // Get volunteer count
    const { count: volunteerCount } = await supabase
        .from('ngo_members')
        .select('*', { count: 'exact', head: true })
        .eq('ngo_id', ngoId);

    // Get donation stats
    const { data: donations } = await supabase
        .from('donations')
        .select('amount, status')
        .eq('ngo_id', ngoId);

    const totalDonations = donations?.filter((d: { status: string }) => d.status === 'COMPLETED').length || 0;
    const totalAmount = donations
        ?.filter((d: { status: string }) => d.status === 'COMPLETED')
        .reduce((sum: number, d: { amount: number }) => sum + d.amount, 0) || 0;

    return {
        openRequests,
        inProgressRequests,
        completedRequests,
        volunteerCount: volunteerCount || 0,
        totalDonations,
        totalAmount,
    };
}

// ============================================
// NGO DOCUMENTS
// ============================================

export async function uploadNgoDocument(ngoId: string, documentType: string, file: File) {
    const supabase = createClient();

    const fileExt = file.name.split('.').pop();
    const fileName = `${ngoId}/${documentType}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('ngo-documents')
        .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from('ngo-documents')
        .getPublicUrl(fileName);

    // Update NGO record with document URL
    const updateField = documentType === 'registration'
        ? 'registration_certificate_url'
        : documentType === '80g'
            ? '_80g_certificate_url'
            : documentType === '12a'
                ? '_12a_certificate_url'
                : null;

    if (updateField) {
        await updateNgo(ngoId, { [updateField]: publicUrl } as NgoUpdate);
    }

    return publicUrl;
}

export async function uploadNgoLogo(ngoId: string, file: File) {
    const supabase = createClient();

    const fileExt = file.name.split('.').pop();
    const fileName = `${ngoId}/logo.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('ngo-logos')
        .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from('ngo-logos')
        .getPublicUrl(fileName);

    await updateNgo(ngoId, { logo_url: publicUrl });

    return publicUrl;
}

// ============================================
// NGO VERIFICATION (Admin)
// ============================================

export async function verifyNgo(ngoId: string, notes?: string) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('ngos')
        .update({
            verification_status: 'APPROVED',
            status: 'VERIFIED',
            verified_at: new Date().toISOString(),
            verified_by: authUser.id,
            verification_notes: notes,
        })
        .eq('id', ngoId)
        .select()
        .single();

    if (error) throw error;
    return data as Ngo;
}

export async function rejectNgo(ngoId: string, reason: string) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('ngos')
        .update({
            verification_status: 'REJECTED',
            verified_at: new Date().toISOString(),
            verified_by: authUser.id,
            verification_notes: reason,
        })
        .eq('id', ngoId)
        .select()
        .single();

    if (error) throw error;
    return data as Ngo;
}

export async function suspendNgo(ngoId: string, reason: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('ngos')
        .update({
            status: 'SUSPENDED',
            verification_notes: reason,
        })
        .eq('id', ngoId)
        .select()
        .single();

    if (error) throw error;
    return data as Ngo;
}

// ============================================
// FOLLOW NGO
// ============================================

export async function followNgo(ngoId: string) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('follows')
        .insert({
            follower_id: authUser.id,
            following_ngo_id: ngoId,
        });

    if (error) throw error;
}

export async function unfollowNgo(ngoId: string) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', authUser.id)
        .eq('following_ngo_id', ngoId);

    if (error) throw error;
}

export async function isFollowingNgo(ngoId: string): Promise<boolean> {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return false;

    const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', authUser.id)
        .eq('following_ngo_id', ngoId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
}

export async function getFollowedNgos() {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('follows')
        .select(`
      created_at,
      ngo:ngos(*)
    `)
        .eq('follower_id', authUser.id)
        .order('created_at', { ascending: false });

    if (error) throw error;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as unknown) as Array<{ created_at: string; ngo: Ngo }>;
}
