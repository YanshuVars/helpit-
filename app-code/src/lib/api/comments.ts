// Comments API for Post Comments
import { createClient } from "@/lib/supabase/client";
import { PostComment } from "@/types/database";

export const commentsApi = {
    // Get all comments for a post
    async getByPostId(postId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("post_comments")
            .select(`
        *,
        user:users(id, full_name, avatar_url)
      `)
            .eq("post_id", postId)
            .order("created_at", { ascending: true });

        if (error) throw error;
        return data as (PostComment & { user?: any })[];
    },

    // Create a new comment
    async create(postId: string, content: string) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
            .from("post_comments")
            .insert({
                post_id: postId,
                user_id: user.id,
                content,
            })
            .select(`
        *,
        user:users(id, full_name, avatar_url)
      `)
            .single();

        if (error) throw error;
        return data as PostComment & { user?: any };
    },

    // Create a reply to a comment
    async createReply(postId: string, parentId: string, content: string) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
            .from("post_comments")
            .insert({
                post_id: postId,
                user_id: user.id,
                parent_id: parentId,
                content,
            })
            .select(`
        *,
        user:users(id, full_name, avatar_url)
      `)
            .single();

        if (error) throw error;
        return data as PostComment & { user?: any };
    },

    // Update a comment
    async update(commentId: string, content: string) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("Not authenticated");

        // Check ownership
        const { data: existing } = await supabase
            .from("post_comments")
            .select("user_id")
            .eq("id", commentId)
            .single();

        if (!existing || existing.user_id !== user.id) {
            throw new Error("Not authorized to update this comment");
        }

        const { data, error } = await supabase
            .from("post_comments")
            .update({ content, updated_at: new Date().toISOString() })
            .eq("id", commentId)
            .select()
            .single();

        if (error) throw error;
        return data as PostComment;
    },

    // Delete a comment
    async delete(commentId: string) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("Not authenticated");

        // Check ownership
        const { data: existing } = await supabase
            .from("post_comments")
            .select("user_id")
            .eq("id", commentId)
            .single();

        if (!existing || existing.user_id !== user.id) {
            throw new Error("Not authorized to delete this comment");
        }

        const { error } = await supabase
            .from("post_comments")
            .delete()
            .eq("id", commentId);

        if (error) throw error;
    },
};
