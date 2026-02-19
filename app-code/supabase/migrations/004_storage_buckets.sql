-- ============================================================
-- Helpit NGO Platform - Storage Buckets Setup
-- Migration: 004_storage_buckets.sql
-- ============================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('avatars', 'avatars', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('ngo-logos', 'ngo-logos', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('ngo-covers', 'ngo-covers', TRUE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('ngo-documents', 'ngo-documents', FALSE, 20971520, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
    ('request-media', 'request-media', TRUE, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']),
    ('post-media', 'post-media', TRUE, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']),
    ('event-covers', 'event-covers', TRUE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('chat-media', 'chat-media', FALSE, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE POLICIES
-- ============================================================

-- AVATARS bucket policies
CREATE POLICY "avatars_select_public" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert_own" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::TEXT
    );

CREATE POLICY "avatars_update_own" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::TEXT
    );

CREATE POLICY "avatars_delete_own" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::TEXT
    );

-- NGO LOGOS bucket policies
CREATE POLICY "ngo_logos_select_public" ON storage.objects
    FOR SELECT USING (bucket_id = 'ngo-logos');

CREATE POLICY "ngo_logos_insert_ngo_admin" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'ngo-logos'
        AND auth.uid() IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM public.ngo_members nm
            WHERE nm.user_id = auth.uid()
            AND nm.ngo_id = (storage.foldername(name))[1]::UUID
            AND nm.role = 'NGO_ADMIN'
        )
    );

CREATE POLICY "ngo_logos_update_ngo_admin" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'ngo-logos'
        AND auth.uid() IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM public.ngo_members nm
            WHERE nm.user_id = auth.uid()
            AND nm.ngo_id = (storage.foldername(name))[1]::UUID
            AND nm.role = 'NGO_ADMIN'
        )
    );

CREATE POLICY "ngo_logos_delete_ngo_admin" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'ngo-logos'
        AND auth.uid() IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM public.ngo_members nm
            WHERE nm.user_id = auth.uid()
            AND nm.ngo_id = (storage.foldername(name))[1]::UUID
            AND nm.role = 'NGO_ADMIN'
        )
    );

-- NGO COVERS bucket policies
CREATE POLICY "ngo_covers_select_public" ON storage.objects
    FOR SELECT USING (bucket_id = 'ngo-covers');

CREATE POLICY "ngo_covers_insert_ngo_admin" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'ngo-covers'
        AND auth.uid() IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM public.ngo_members nm
            WHERE nm.user_id = auth.uid()
            AND nm.ngo_id = (storage.foldername(name))[1]::UUID
            AND nm.role IN ('NGO_ADMIN', 'NGO_COORDINATOR')
        )
    );

CREATE POLICY "ngo_covers_update_ngo_admin" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'ngo-covers'
        AND auth.uid() IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM public.ngo_members nm
            WHERE nm.user_id = auth.uid()
            AND nm.ngo_id = (storage.foldername(name))[1]::UUID
            AND nm.role IN ('NGO_ADMIN', 'NGO_COORDINATOR')
        )
    );

-- NGO DOCUMENTS bucket policies (private)
CREATE POLICY "ngo_documents_select_ngo_admin" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'ngo-documents'
        AND (
            EXISTS (
                SELECT 1 FROM public.ngo_members nm
                WHERE nm.user_id = auth.uid()
                AND nm.ngo_id = (storage.foldername(name))[1]::UUID
            )
            OR EXISTS (
                SELECT 1 FROM public.users u
                WHERE u.id = auth.uid()
                AND u.role = 'PLATFORM_ADMIN'
            )
        )
    );

CREATE POLICY "ngo_documents_insert_ngo_admin" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'ngo-documents'
        AND auth.uid() IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM public.ngo_members nm
            WHERE nm.user_id = auth.uid()
            AND nm.ngo_id = (storage.foldername(name))[1]::UUID
            AND nm.role = 'NGO_ADMIN'
        )
    );

-- REQUEST MEDIA bucket policies
CREATE POLICY "request_media_select_public" ON storage.objects
    FOR SELECT USING (bucket_id = 'request-media');

CREATE POLICY "request_media_insert_ngo_member" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'request-media'
        AND auth.uid() IS NOT NULL
    );

CREATE POLICY "request_media_delete_ngo_member" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'request-media'
        AND auth.uid() IS NOT NULL
    );

-- POST MEDIA bucket policies
CREATE POLICY "post_media_select_public" ON storage.objects
    FOR SELECT USING (bucket_id = 'post-media');

CREATE POLICY "post_media_insert_ngo_member" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'post-media'
        AND auth.uid() IS NOT NULL
    );

CREATE POLICY "post_media_delete_ngo_member" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'post-media'
        AND auth.uid() IS NOT NULL
    );

-- EVENT COVERS bucket policies
CREATE POLICY "event_covers_select_public" ON storage.objects
    FOR SELECT USING (bucket_id = 'event-covers');

CREATE POLICY "event_covers_insert_ngo_member" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'event-covers'
        AND auth.uid() IS NOT NULL
    );

-- CHAT MEDIA bucket policies (private)
CREATE POLICY "chat_media_select_participant" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'chat-media'
        AND auth.uid() IS NOT NULL
    );

CREATE POLICY "chat_media_insert_participant" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'chat-media'
        AND auth.uid() IS NOT NULL
    );
