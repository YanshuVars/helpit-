// Missing Persons API
import { createClient } from "@/lib/supabase/client";
import { MissingPerson, MissingPersonSighting } from "@/types/database";

export const missingPersonsApi = {
    // Get all verified missing persons (public)
    async getAll(limit: number = 50, offset: number = 0) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("missing_persons")
            .select("*")
            .eq("is_verified", true)
            .eq("status", "MISSING")
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return data as MissingPerson[];
    },

    // Get a single missing person by ID
    async getById(id: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("missing_persons")
            .select(`
        *,
        ngo:ngos(id, name, slug, logo_url, phone, email),
        reporter:users(id, full_name)
      `)
            .eq("id", id)
            .single();

        if (error) throw error;
        return data as MissingPerson & { ngo?: any; reporter?: any };
    },

    // Create a new missing person report
    async create(personData: Partial<MissingPerson>) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("Not authenticated");

        // Get NGO ID if user is NGO member
        let ngoId = null;
        const { data: ngoData } = await supabase
            .from("ngo_members")
            .select("ngo_id")
            .eq("user_id", user.id)
            .single();

        if (ngoData?.ngo_id) {
            ngoId = ngoData.ngo_id;
        }

        const { data, error } = await supabase
            .from("missing_persons")
            .insert({
                ...personData,
                reported_by: user.id,
                ngo_id: ngoId,
            })
            .select()
            .single();

        if (error) throw error;
        return data as MissingPerson;
    },

    // Update a missing person report
    async update(id: string, personData: Partial<MissingPerson>) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("missing_persons")
            .update({ ...personData, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data as MissingPerson;
    },

    // Delete a missing person report
    async delete(id: string) {
        const supabase = createClient();
        const { error } = await supabase
            .from("missing_persons")
            .delete()
            .eq("id", id);

        if (error) throw error;
    },

    // Search missing persons
    async search(query: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("missing_persons")
            .select("*")
            .eq("is_verified", true)
            .eq("status", "MISSING")
            .or(`full_name.ilike.%${query}%,last_seen_city.ilike.%${query}%,last_seen_state.ilike.%${query}%`)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as MissingPerson[];
    },

    // Get missing persons by city/state
    async getByLocation(city?: string, state?: string) {
        const supabase = createClient();
        let query = supabase
            .from("missing_persons")
            .select("*")
            .eq("is_verified", true)
            .eq("status", "MISSING");

        if (city) {
            query = query.ilike("last_seen_city", `%${city}%`);
        }
        if (state) {
            query = query.ilike("last_seen_state", `%${state}%`);
        }

        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) throw error;
        return data as MissingPerson[];
    },

    // Get user's reported missing persons
    async getUserReported() {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return [];

        const { data, error } = await supabase
            .from("missing_persons")
            .select("*")
            .eq("reported_by", user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as MissingPerson[];
    },

    // Get NGO's missing persons
    async getByNgo(ngoId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("missing_persons")
            .select("*")
            .eq("ngo_id", ngoId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as MissingPerson[];
    },

    // Report a sighting
    async reportSighting(sightingData: Partial<MissingPersonSighting>) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
            .from("missing_person_sightings")
            .insert({
                ...sightingData,
                reported_by: user.id,
            })
            .select()
            .single();

        if (error) throw error;
        return data as MissingPersonSighting;
    },

    // Get sightings for a missing person
    async getSightings(missingPersonId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("missing_person_sightings")
            .select(`
        *,
        reporter:users(id, full_name, avatar_url)
      `)
            .eq("missing_person_id", missingPersonId)
            .order("sighting_date", { ascending: false });

        if (error) throw error;
        return data as (MissingPersonSighting & { reporter?: any })[];
    },

    // Verify a missing person (admin/NGO)
    async verify(id: string) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
            .from("missing_persons")
            .update({
                is_verified: true,
                verified_by: user.id,
                verified_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data as MissingPerson;
    },

    // Mark as found/resolved
    async resolve(id: string, resolutionNotes: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("missing_persons")
            .update({
                status: "FOUND",
                resolved_at: new Date().toISOString(),
                resolution_notes: resolutionNotes,
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data as MissingPerson;
    },
};
