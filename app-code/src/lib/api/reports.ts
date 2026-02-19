// Reports API for Moderation
import { createClient } from "@/lib/supabase/client";
import { Report } from "@/types/database";

export const reportsApi = {
    // Get all reports (admin only)
    async getAll(filters?: {
        status?: string;
        priority?: string;
        type?: string;
    }) {
        const supabase = createClient();

        let query = supabase
            .from("reports")
            .select(`
        *,
        reporter:users!reports_reporter_id_fkey(id, full_name, avatar_url),
        reportedUser:users!reports_reported_user_id_fkey(id, full_name, email),
        reportedNgo:ngos!reports_reported_ngo_id_fkey(id, name, slug)
      `)
            .order("created_at", { ascending: false });

        if (filters?.status && filters.status !== "ALL") {
            query = query.eq("status", filters.status);
        }
        if (filters?.priority && filters.priority !== "ALL") {
            query = query.eq("priority", filters.priority);
        }
        if (filters?.type && filters.type !== "ALL") {
            query = query.eq("reported_entity_type", filters.type.replace("_", "").toUpperCase());
        }

        const { data, error } = await query;

        if (error) throw error;
        return data as any[];
    },

    // Get report by ID
    async getById(id: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("reports")
            .select(`
        *,
        reporter:users!reports_reporter_id_fkey(id, full_name, email, avatar_url),
        reportedUser:users!reports_reported_user_id_fkey(id, full_name, email, role),
        reportedNgo:ngos!reports_reported_ngo_id_fkey(id, name, slug, email)
      `)
            .eq("id", id)
            .single();

        if (error) throw error;
        return data as any;
    },

    // Create a report
    async create(reportData: {
        reported_entity_type: "USER" | "NGO" | "POST" | "REQUEST";
        reported_user_id?: string;
        reported_ngo_id?: string;
        reported_post_id?: string;
        reported_request_id?: string;
        reason: string;
        description?: string;
        evidence_urls?: string[];
    }) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
            .from("reports")
            .insert({
                ...reportData,
                reporter_id: user.id,
            })
            .select()
            .single();

        if (error) throw error;
        return data as Report;
    },

    // Update report status
    async updateStatus(id: string, status: string, resolutionNotes?: string) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
            .from("reports")
            .update({
                status,
                resolution_notes: resolutionNotes,
                resolved_by: user.id,
                resolved_at: status === "RESOLVED" || status === "DISMISSED" ? new Date().toISOString() : null,
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data as Report;
    },

    // Assign report to user
    async assignTo(id: string, userId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("reports")
            .update({
                assigned_to: userId,
                status: "IN_REVIEW",
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data as Report;
    },

    // Get report counts by status
    async getCounts() {
        const supabase = createClient();

        const { data: pending } = await supabase
            .from("reports")
            .select("*", { count: "exact", head: true })
            .eq("status", "PENDING");

        const { data: inReview } = await supabase
            .from("reports")
            .select("*", { count: "exact", head: true })
            .eq("status", "IN_REVIEW");

        const { data: resolved } = await supabase
            .from("reports")
            .select("*", { count: "exact", head: true })
            .eq("status", "RESOLVED");

        const { data: highPriority } = await supabase
            .from("reports")
            .select("*", { count: "exact", head: true })
            .eq("priority", "HIGH")
            .neq("status", "RESOLVED")
            .neq("status", "DISMISSED");

        return {
            pending: pending?.length || 0,
            inReview: inReview?.length || 0,
            resolved: resolved?.length || 0,
            highPriority: highPriority?.length || 0,
        };
    },
};
