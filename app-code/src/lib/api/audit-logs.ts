// Audit Logs API
import { createClient } from "@/lib/supabase/client";
import { AuditLog } from "@/types/database";

export const auditLogsApi = {
    // Get all audit logs (admin only)
    async getAll(filters?: {
        category?: string;
        action?: string;
        startDate?: string;
        endDate?: string;
        limit?: number;
        offset?: number;
    }) {
        const supabase = createClient();

        let query = supabase
            .from("audit_logs")
            .select(`
        *,
        actor:users(id, full_name, avatar_url)
      `)
            .order("created_at", { ascending: false });

        if (filters?.category && filters.category !== "ALL") {
            query = query.eq("category", filters.category);
        }
        if (filters?.action) {
            query = query.ilike("action", `%${filters.action}%`);
        }
        if (filters?.startDate) {
            query = query.gte("created_at", filters.startDate);
        }
        if (filters?.endDate) {
            query = query.lte("created_at", filters.endDate);
        }
        if (filters?.limit) {
            query = query.range(
                filters.offset || 0,
                (filters.offset || 0) + filters.limit - 1
            );
        }

        const { data, error } = await query;

        if (error) throw error;
        return data as (AuditLog & { actor?: any })[];
    },

    // Get audit logs by category
    async getByCategory(category: string, limit: number = 50) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("audit_logs")
            .select(`
        *,
        actor:users(id, full_name, avatar_url)
      `)
            .eq("category", category)
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data as (AuditLog & { actor?: any })[];
    },

    // Get audit logs for a specific target
    async getByTarget(targetType: string, targetId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("audit_logs")
            .select(`
        *,
        actor:users(id, full_name, avatar_url)
      `)
            .eq("target_type", targetType)
            .eq("target_id", targetId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as (AuditLog & { actor?: any })[];
    },

    // Get audit logs by actor
    async getByActor(actorId: string, limit: number = 50) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("audit_logs")
            .select("*")
            .eq("actor_id", actorId)
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data as AuditLog[];
    },

    // Log an action (for internal use)
    async logAction(action: string, category: string, details?: string, metadata?: Record<string, any>) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from("audit_logs")
            .insert({
                actor_id: user?.id || null,
                actor_role: user?.role || null,
                action,
                category,
                details,
                metadata: metadata || {},
            })
            .select()
            .single();

        if (error) throw error;
        return data as AuditLog;
    },

    // Get recent activity count by category
    async getActivityCounts() {
        const supabase = createClient();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const categories = ["USER_MANAGEMENT", "NGO_MANAGEMENT", "DONATION", "MODERATION", "PLATFORM"];
        const counts: Record<string, number> = {};

        for (const category of categories) {
            const { data } = await supabase
                .from("audit_logs")
                .select("*", { count: "exact", head: true })
                .eq("category", category)
                .gte("created_at", sevenDaysAgo.toISOString());

            counts[category] = data?.length || 0;
        }

        return counts;
    },
};
