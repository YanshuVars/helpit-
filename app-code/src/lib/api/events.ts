// Events API for Event management
import { createClient } from "@/lib/supabase/client";
import { Event, EventRegistration } from "@/types/database";

export const eventsApi = {
    // Get all events for an NGO
    async getByNgoId(ngoId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("ngo_id", ngoId)
            .order("start_date", { ascending: true });

        if (error) throw error;
        return data as Event[];
    },

    // Get a single event by ID
    async getById(eventId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("events")
            .select(`
        *,
        ngo:ngos(id, name, slug, logo_url)
      `)
            .eq("id", eventId)
            .single();

        if (error) throw error;
        return data as Event & { ngo?: any };
    },

    // Create a new event
    async create(eventData: Partial<Event>) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("Not authenticated");

        // Get NGO ID for the user
        const { data: ngoData } = await supabase
            .from("ngo_members")
            .select("ngo_id")
            .eq("user_id", user.id)
            .single();

        if (!ngoData?.ngo_id) {
            throw new Error("You must be an NGO member to create events");
        }

        const { data, error } = await supabase
            .from("events")
            .insert({
                ...eventData,
                ngo_id: ngoData.ngo_id,
                created_by: user.id,
            })
            .select()
            .single();

        if (error) throw error;
        return data as Event;
    },

    // Update an event
    async update(eventId: string, eventData: Partial<Event>) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("events")
            .update({ ...eventData, updated_at: new Date().toISOString() })
            .eq("id", eventId)
            .select()
            .single();

        if (error) throw error;
        return data as Event;
    },

    // Delete an event
    async delete(eventId: string) {
        const supabase = createClient();
        const { error } = await supabase
            .from("events")
            .delete()
            .eq("id", eventId);

        if (error) throw error;
    },

    // Register for an event
    async register(eventId: string) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
            .from("event_registrations")
            .insert({
                event_id: eventId,
                user_id: user.id,
                status: "REGISTERED",
            })
            .select(`
        *,
        user:users(id, full_name, avatar_url)
      `)
            .single();

        if (error) throw error;
        return data as EventRegistration & { user?: any };
    },

    // Cancel registration
    async cancelRegistration(eventId: string) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("Not authenticated");

        const { error } = await supabase
            .from("event_registrations")
            .update({ status: "CANCELLED" })
            .eq("event_id", eventId)
            .eq("user_id", user.id);

        if (error) throw error;
    },

    // Get user's registration for an event
    async getUserRegistration(eventId: string) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return null;

        const { data, error } = await supabase
            .from("event_registrations")
            .select("*")
            .eq("event_id", eventId)
            .eq("user_id", user.id)
            .single();

        if (error && error.code !== "PGRST116") throw error;
        return data as EventRegistration | null;
    },

    // Get all registrations for an event (for NGO)
    async getEventRegistrations(eventId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("event_registrations")
            .select(`
        *,
        user:users(id, full_name, email, phone, avatar_url)
      `)
            .eq("event_id", eventId)
            .order("registered_at", { ascending: false });

        if (error) throw error;
        return data as (EventRegistration & { user?: any })[];
    },

    // Mark attendance
    async markAttendance(userId: string, eventId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("event_registrations")
            .update({
                status: "ATTENDED",
                attended_at: new Date().toISOString(),
            })
            .eq("event_id", eventId)
            .eq("user_id", userId)
            .select()
            .single();

        if (error) throw error;
        return data as EventRegistration;
    },

    // Get all public upcoming events
    async getUpcomingEvents(limit: number = 20) {
        const supabase = createClient();
        const today = new Date().toISOString().split("T")[0];

        const { data, error } = await supabase
            .from("events")
            .select(`
        *,
        ngo:ngos(id, name, slug, logo_url, city)
      `)
            .eq("visibility", "PUBLIC")
            .eq("status", "UPCOMING")
            .gte("start_date", today)
            .order("start_date", { ascending: true })
            .limit(limit);

        if (error) throw error;
        return data as (Event & { ngo?: any })[];
    },

    // Get events user has registered for
    async getUserRegistrations() {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return [];

        const { data, error } = await supabase
            .from("event_registrations")
            .select(`
        *,
        event:events(*,
          ngo:ngos(id, name, slug, logo_url)
        )
      `)
            .eq("user_id", user.id)
            .neq("status", "CANCELLED")
            .order("registered_at", { ascending: false });

        if (error) throw error;
        return data as (EventRegistration & { event?: Event & { ngo?: any } })[];
    },
};
