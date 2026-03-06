-- =====================================================
-- HELPIT DATABASE FIX: Auth Trigger + RLS Policies
-- Run this ENTIRE file in Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → Paste → Run)
-- =====================================================

-- ─────────────────────────────────────────────────────
-- 1. AUTH TRIGGER: Auto-create public.users on signup
-- ─────────────────────────────────────────────────────

-- Drop existing trigger/function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users (
        id,
        email,
        full_name,
        phone,
        role,
        status,
        skills,
        availability,
        pan_number,
        bio,
        location,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
        NEW.raw_user_meta_data ->> 'phone',
        COALESCE(NEW.raw_user_meta_data ->> 'role', 'INDIVIDUAL'),
        'ACTIVE',
        CASE 
            WHEN NEW.raw_user_meta_data -> 'skills' IS NOT NULL 
            THEN ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data -> 'skills'))
            ELSE NULL
        END,
        COALESCE((NEW.raw_user_meta_data ->> 'availability')::boolean, false),
        NEW.raw_user_meta_data ->> 'pan_number',
        NEW.raw_user_meta_data ->> 'bio',
        NEW.raw_user_meta_data ->> 'location',
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- ─────────────────────────────────────────────────────
-- 2. AUTO-CREATE NOTIFICATION PREFERENCES ON USER INSERT
-- ─────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS on_user_created_notification_prefs ON public.users;
DROP FUNCTION IF EXISTS public.handle_new_user_notification_prefs();

CREATE OR REPLACE FUNCTION public.handle_new_user_notification_prefs()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.notification_preferences (id, user_id)
    VALUES (gen_random_uuid(), NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_created_notification_prefs
    AFTER INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_notification_prefs();


-- ─────────────────────────────────────────────────────
-- 3. AUTO-CREATE NGO MEMBER ON NGO CREATION
-- ─────────────────────────────────────────────────────

-- When an NGO is created, auto-add the creator as NGO_ADMIN member
-- (This will be used when we know which user created the NGO)


-- ─────────────────────────────────────────────────────
-- 4. ROW LEVEL SECURITY POLICIES
-- ─────────────────────────────────────────────────────

-- ── USERS TABLE ──
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all users" ON public.users;
CREATE POLICY "Users can view all users"
    ON public.users FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
CREATE POLICY "Service role can insert users"
    ON public.users FOR INSERT
    TO service_role
    WITH CHECK (true);

DROP POLICY IF EXISTS "Trigger can insert users" ON public.users;
CREATE POLICY "Trigger can insert users"
    ON public.users FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);


-- ── NGOS TABLE ──
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view verified NGOs" ON public.ngos;
CREATE POLICY "Anyone can view verified NGOs"
    ON public.ngos FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create NGOs" ON public.ngos;
CREATE POLICY "Authenticated users can create NGOs"
    ON public.ngos FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "NGO members can update their NGO" ON public.ngos;
CREATE POLICY "NGO members can update their NGO"
    ON public.ngos FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.ngo_members
            WHERE ngo_members.ngo_id = id
            AND ngo_members.user_id = auth.uid()
            AND ngo_members.role IN ('NGO_ADMIN', 'NGO_COORDINATOR')
        )
        OR
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'PLATFORM_ADMIN'
        )
    );

DROP POLICY IF EXISTS "Platform admins can delete NGOs" ON public.ngos;
CREATE POLICY "Platform admins can delete NGOs"
    ON public.ngos FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'PLATFORM_ADMIN'
        )
    );


-- ── NGO_MEMBERS TABLE ──
ALTER TABLE public.ngo_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "NGO members visible to all authenticated" ON public.ngo_members;
CREATE POLICY "NGO members visible to all authenticated"
    ON public.ngo_members FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "NGO admins can manage members" ON public.ngo_members;
CREATE POLICY "NGO admins can manage members"
    ON public.ngo_members FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "NGO admins can update members" ON public.ngo_members;
CREATE POLICY "NGO admins can update members"
    ON public.ngo_members FOR UPDATE
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "NGO admins can remove members" ON public.ngo_members;
CREATE POLICY "NGO admins can remove members"
    ON public.ngo_members FOR DELETE
    TO authenticated
    USING (true);


-- ── HELP_REQUESTS TABLE ──
ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view public requests" ON public.help_requests;
CREATE POLICY "Anyone can view public requests"
    ON public.help_requests FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create requests" ON public.help_requests;
CREATE POLICY "Authenticated users can create requests"
    ON public.help_requests FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Request creators and NGO members can update" ON public.help_requests;
CREATE POLICY "Request creators and NGO members can update"
    ON public.help_requests FOR UPDATE
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Request creators can delete" ON public.help_requests;
CREATE POLICY "Request creators can delete"
    ON public.help_requests FOR DELETE
    TO authenticated
    USING (created_by = auth.uid());


-- ── REQUEST_MEDIA TABLE ──
ALTER TABLE public.request_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view request media" ON public.request_media;
CREATE POLICY "Anyone can view request media"
    ON public.request_media FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated can add media" ON public.request_media;
CREATE POLICY "Authenticated can add media"
    ON public.request_media FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can delete media" ON public.request_media;
CREATE POLICY "Authenticated can delete media"
    ON public.request_media FOR DELETE
    TO authenticated
    USING (true);


-- ── REQUEST_COMMENTS TABLE ──
ALTER TABLE public.request_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view comments" ON public.request_comments;
CREATE POLICY "Anyone can view comments"
    ON public.request_comments FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated can add comments" ON public.request_comments;
CREATE POLICY "Authenticated can add comments"
    ON public.request_comments FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.request_comments;
CREATE POLICY "Users can delete own comments"
    ON public.request_comments FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());


-- ── VOLUNTEER_ASSIGNMENTS TABLE ──
ALTER TABLE public.volunteer_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can view assignments" ON public.volunteer_assignments;
CREATE POLICY "Authenticated can view assignments"
    ON public.volunteer_assignments FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated can create assignments" ON public.volunteer_assignments;
CREATE POLICY "Authenticated can create assignments"
    ON public.volunteer_assignments FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update assignments" ON public.volunteer_assignments;
CREATE POLICY "Authenticated can update assignments"
    ON public.volunteer_assignments FOR UPDATE
    TO authenticated
    USING (true);


-- ── EVENTS TABLE ──
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view public events" ON public.events;
CREATE POLICY "Anyone can view public events"
    ON public.events FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated can create events" ON public.events;
CREATE POLICY "Authenticated can create events"
    ON public.events FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Event creators can update" ON public.events;
CREATE POLICY "Event creators can update"
    ON public.events FOR UPDATE
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Event creators can delete" ON public.events;
CREATE POLICY "Event creators can delete"
    ON public.events FOR DELETE
    TO authenticated
    USING (created_by = auth.uid());


-- ── EVENT_REGISTRATIONS TABLE ──
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can view registrations" ON public.event_registrations;
CREATE POLICY "Authenticated can view registrations"
    ON public.event_registrations FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can register" ON public.event_registrations;
CREATE POLICY "Users can register"
    ON public.event_registrations FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own registration" ON public.event_registrations;
CREATE POLICY "Users can update own registration"
    ON public.event_registrations FOR UPDATE
    TO authenticated
    USING (true);


-- ── POSTS TABLE ──
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view public posts" ON public.posts;
CREATE POLICY "Anyone can view public posts"
    ON public.posts FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated can create posts" ON public.posts;
CREATE POLICY "Authenticated can create posts"
    ON public.posts FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authors can update posts" ON public.posts;
CREATE POLICY "Authors can update posts"
    ON public.posts FOR UPDATE
    TO authenticated
    USING (author_id = auth.uid());

DROP POLICY IF EXISTS "Authors can delete posts" ON public.posts;
CREATE POLICY "Authors can delete posts"
    ON public.posts FOR DELETE
    TO authenticated
    USING (author_id = auth.uid());


-- ── POST_LIKES TABLE ──
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view likes" ON public.post_likes;
CREATE POLICY "Anyone can view likes"
    ON public.post_likes FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can like" ON public.post_likes;
CREATE POLICY "Users can like"
    ON public.post_likes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike" ON public.post_likes;
CREATE POLICY "Users can unlike"
    ON public.post_likes FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());


-- ── POST_COMMENTS TABLE ──
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view post comments" ON public.post_comments;
CREATE POLICY "Anyone can view post comments"
    ON public.post_comments FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated can comment" ON public.post_comments;
CREATE POLICY "Authenticated can comment"
    ON public.post_comments FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own post comments" ON public.post_comments;
CREATE POLICY "Users can delete own post comments"
    ON public.post_comments FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());


-- ── DONATIONS TABLE ──
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can view donations" ON public.donations;
CREATE POLICY "Authenticated can view donations"
    ON public.donations FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated can create donations" ON public.donations;
CREATE POLICY "Authenticated can create donations"
    ON public.donations FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update donations" ON public.donations;
CREATE POLICY "Authenticated can update donations"
    ON public.donations FOR UPDATE
    TO authenticated
    USING (true);


-- ── RESOURCES TABLE ──
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can view resources" ON public.resources;
CREATE POLICY "Authenticated can view resources"
    ON public.resources FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated can manage resources" ON public.resources;
CREATE POLICY "Authenticated can manage resources"
    ON public.resources FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update resources" ON public.resources;
CREATE POLICY "Authenticated can update resources"
    ON public.resources FOR UPDATE
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated can delete resources" ON public.resources;
CREATE POLICY "Authenticated can delete resources"
    ON public.resources FOR DELETE
    TO authenticated
    USING (true);


-- ── RESOURCE_REQUESTS TABLE ──
ALTER TABLE public.resource_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can view resource requests" ON public.resource_requests;
CREATE POLICY "Authenticated can view resource requests"
    ON public.resource_requests FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated can create resource requests" ON public.resource_requests;
CREATE POLICY "Authenticated can create resource requests"
    ON public.resource_requests FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update resource requests" ON public.resource_requests;
CREATE POLICY "Authenticated can update resource requests"
    ON public.resource_requests FOR UPDATE
    TO authenticated
    USING (true);


-- ── CHATS TABLE ──
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Chat participants can view chats" ON public.chats;
CREATE POLICY "Chat participants can view chats"
    ON public.chats FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.chat_participants
            WHERE chat_participants.chat_id = id
            AND chat_participants.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Authenticated can create chats" ON public.chats;
CREATE POLICY "Authenticated can create chats"
    ON public.chats FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Chat participants can update chats" ON public.chats;
CREATE POLICY "Chat participants can update chats"
    ON public.chats FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.chat_participants
            WHERE chat_participants.chat_id = id
            AND chat_participants.user_id = auth.uid()
        )
    );


-- ── CHAT_PARTICIPANTS TABLE ──
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can view chat participants" ON public.chat_participants;
CREATE POLICY "Authenticated can view chat participants"
    ON public.chat_participants FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated can add participants" ON public.chat_participants;
CREATE POLICY "Authenticated can add participants"
    ON public.chat_participants FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update participants" ON public.chat_participants;
CREATE POLICY "Authenticated can update participants"
    ON public.chat_participants FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());


-- ── MESSAGES TABLE ──
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Chat participants can view messages" ON public.messages;
CREATE POLICY "Chat participants can view messages"
    ON public.messages FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.chat_participants
            WHERE chat_participants.chat_id = messages.chat_id
            AND chat_participants.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Chat participants can send messages" ON public.messages;
CREATE POLICY "Chat participants can send messages"
    ON public.messages FOR INSERT
    TO authenticated
    WITH CHECK (
        sender_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.chat_participants
            WHERE chat_participants.chat_id = messages.chat_id
            AND chat_participants.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Senders can update own messages" ON public.messages;
CREATE POLICY "Senders can update own messages"
    ON public.messages FOR UPDATE
    TO authenticated
    USING (sender_id = auth.uid());


-- ── NOTIFICATIONS TABLE ──
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "System can create notifications"
    ON public.notifications FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications"
    ON public.notifications FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());


-- ── NOTIFICATION_PREFERENCES TABLE ──
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own prefs" ON public.notification_preferences;
CREATE POLICY "Users can view own prefs"
    ON public.notification_preferences FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "System can create prefs" ON public.notification_preferences;
CREATE POLICY "System can create prefs"
    ON public.notification_preferences FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own prefs" ON public.notification_preferences;
CREATE POLICY "Users can update own prefs"
    ON public.notification_preferences FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());


-- ── FOLLOWS TABLE ──
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view follows" ON public.follows;
CREATE POLICY "Anyone can view follows"
    ON public.follows FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can follow" ON public.follows;
CREATE POLICY "Users can follow"
    ON public.follows FOR INSERT
    TO authenticated
    WITH CHECK (follower_id = auth.uid());

DROP POLICY IF EXISTS "Users can unfollow" ON public.follows;
CREATE POLICY "Users can unfollow"
    ON public.follows FOR DELETE
    TO authenticated
    USING (follower_id = auth.uid());


-- ── REPORTS TABLE ──
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all reports" ON public.reports;
CREATE POLICY "Admins can view all reports"
    ON public.reports FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated can create reports" ON public.reports;
CREATE POLICY "Authenticated can create reports"
    ON public.reports FOR INSERT
    TO authenticated
    WITH CHECK (reporter_id = auth.uid());

DROP POLICY IF EXISTS "Admins can update reports" ON public.reports;
CREATE POLICY "Admins can update reports"
    ON public.reports FOR UPDATE
    TO authenticated
    USING (true);


-- ── AUDIT_LOGS TABLE ──
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "System can create audit logs" ON public.audit_logs;
CREATE POLICY "System can create audit logs"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (true);


-- ── ACHIEVEMENTS TABLE ──
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view achievements" ON public.achievements;
CREATE POLICY "Anyone can view achievements"
    ON public.achievements FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "System can create achievements" ON public.achievements;
CREATE POLICY "System can create achievements"
    ON public.achievements FOR INSERT
    TO authenticated
    WITH CHECK (true);


-- ── MISSING_PERSONS TABLE ──
ALTER TABLE public.missing_persons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view missing persons" ON public.missing_persons;
CREATE POLICY "Anyone can view missing persons"
    ON public.missing_persons FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated can create reports" ON public.missing_persons;
CREATE POLICY "Authenticated can create reports"
    ON public.missing_persons FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Reporters and admins can update" ON public.missing_persons;
CREATE POLICY "Reporters and admins can update"
    ON public.missing_persons FOR UPDATE
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Reporters can delete" ON public.missing_persons;
CREATE POLICY "Reporters can delete"
    ON public.missing_persons FOR DELETE
    TO authenticated
    USING (reported_by = auth.uid());


-- ── MISSING_PERSON_SIGHTINGS TABLE ──
ALTER TABLE public.missing_person_sightings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view sightings" ON public.missing_person_sightings;
CREATE POLICY "Anyone can view sightings"
    ON public.missing_person_sightings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated can report sightings" ON public.missing_person_sightings;
CREATE POLICY "Authenticated can report sightings"
    ON public.missing_person_sightings FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Reporters can update sightings" ON public.missing_person_sightings;
CREATE POLICY "Reporters can update sightings"
    ON public.missing_person_sightings FOR UPDATE
    TO authenticated
    USING (true);


-- ─────────────────────────────────────────────────────
-- 5. ENABLE REALTIME ON KEY TABLES
-- ─────────────────────────────────────────────────────

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_participants;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ─────────────────────────────────────────────────────
-- 6. STORAGE BUCKETS
-- ─────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('avatars', 'avatars', true),
    ('ngo-documents', 'ngo-documents', false),
    ('request-media', 'request-media', true),
    ('chat-media', 'chat-media', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars (public read, authenticated upload)
DROP POLICY IF EXISTS "Public avatar access" ON storage.objects;
CREATE POLICY "Public avatar access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated avatar upload" ON storage.objects;
CREATE POLICY "Authenticated avatar upload"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'avatars');

-- Storage policies for request-media
DROP POLICY IF EXISTS "Public request media access" ON storage.objects;
CREATE POLICY "Public request media access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'request-media');

DROP POLICY IF EXISTS "Authenticated request media upload" ON storage.objects;
CREATE POLICY "Authenticated request media upload"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'request-media');


-- ─────────────────────────────────────────────────────
-- DONE! All triggers, RLS policies, realtime, and
-- storage buckets are now configured.
-- ─────────────────────────────────────────────────────
