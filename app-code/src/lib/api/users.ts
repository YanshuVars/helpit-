// User API Helper Functions
import { createClient } from '@/lib/supabase/client';
import type { User, UserInsert, UserUpdate, UserRole } from '@/types/database';

// ============================================
// AUTH FUNCTIONS
// ============================================

export async function signUp(email: string, password: string, userData: Partial<UserInsert>) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: userData.full_name,
                role: userData.role || 'INDIVIDUAL',
            },
        },
    });

    if (error) throw error;
    return data;
}

export async function signIn(email: string, password: string) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

export async function signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getCurrentUser() {
    const supabase = createClient();

    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return null;

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

    if (error) throw error;
    return user as User;
}

export async function getSession() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

export async function resetPassword(email: string) {
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
}

export async function updatePassword(newPassword: string) {
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) throw error;
}

// ============================================
// USER CRUD FUNCTIONS
// ============================================

export async function getUserById(id: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as User;
}

export async function updateUser(id: string, updates: UserUpdate) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as User;
}

export async function updateUserProfile(updates: Partial<User>) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    return updateUser(authUser.id, updates);
}

export async function uploadAvatar(file: File) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${authUser.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

    await updateUser(authUser.id, { avatar_url: publicUrl });

    return publicUrl;
}

// ============================================
// USER ROLE FUNCTIONS
// ============================================

export async function getUserRole(): Promise<UserRole | null> {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return null;

    const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', authUser.id)
        .single();

    if (error) throw error;
    return data.role as UserRole;
}

export async function isPlatformAdmin(): Promise<boolean> {
    const role = await getUserRole();
    return role === 'PLATFORM_ADMIN';
}

export async function isNgoMember(ngoId: string): Promise<boolean> {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return false;

    const { data, error } = await supabase
        .from('ngo_members')
        .select('id')
        .eq('user_id', authUser.id)
        .eq('ngo_id', ngoId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
}

export async function isNgoAdmin(ngoId: string): Promise<boolean> {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return false;

    const { data, error } = await supabase
        .from('ngo_members')
        .select('role')
        .eq('user_id', authUser.id)
        .eq('ngo_id', ngoId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.role === 'NGO_ADMIN';
}

// ============================================
// VOLUNTEER SPECIFIC FUNCTIONS
// ============================================

export async function getVolunteerStats() {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    // Get assignment stats
    const { data: assignments } = await supabase
        .from('volunteer_assignments')
        .select('status, hours_logged')
        .eq('volunteer_id', authUser.id);

    const totalAssignments = assignments?.length || 0;
    const completedAssignments = assignments?.filter((a: { status: string }) => a.status === 'COMPLETED').length || 0;
    const totalHours = assignments?.reduce((sum: number, a: { hours_logged: number | null }) => sum + (a.hours_logged || 0), 0) || 0;

    // Get achievements count
    const { count: achievementsCount } = await supabase
        .from('achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authUser.id);

    return {
        totalAssignments,
        completedAssignments,
        totalHours,
        achievementsCount: achievementsCount || 0,
    };
}

export async function updateVolunteerSkills(skills: string[]) {
    return updateUserProfile({ skills });
}

export async function updateVolunteerAvailability(availability: boolean, availabilityHours?: Record<string, unknown>) {
    return updateUserProfile({
        availability,
        availability_hours: availabilityHours || null,
    });
}

// ============================================
// DONOR SPECIFIC FUNCTIONS
// ============================================

export async function getDonorStats() {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

  const { data: donations } = await supabase
    .from('donations')
    .select('amount, status')
    .eq('donor_id', authUser.id);
  
  const totalDonations = donations?.filter((d: { status: string }) => d.status === 'COMPLETED').length || 0;
  const totalAmount = donations
    ?.filter((d: { status: string }) => d.status === 'COMPLETED')
    .reduce((sum: number, d: { amount: number }) => sum + d.amount, 0) || 0;

    // Get following count
    const { count: followingCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', authUser.id);

    return {
        totalDonations,
        totalAmount,
        followingCount: followingCount || 0,
    };
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

export async function getAllUsers(options?: {
    role?: UserRole;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
}) {
    const supabase = createClient();
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabase
        .from('users')
        .select('*', { count: 'exact' });

    if (options?.role) {
        query = query.eq('role', options.role);
    }

    if (options?.status) {
        query = query.eq('status', options.status);
    }

    if (options?.search) {
        query = query.or(`full_name.ilike.%${options.search}%,email.ilike.%${options.search}%`);
    }

    const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
        users: data as User[],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
    };
}

export async function updateUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED') {
    return updateUser(userId, { status } as UserUpdate);
}

export async function updateUserRole(userId: string, role: UserRole) {
    return updateUser(userId, { role } as UserUpdate);
}
