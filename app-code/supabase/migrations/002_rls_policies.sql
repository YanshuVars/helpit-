-- ============================================================
-- Helpit NGO Platform - Row Level Security Policies
-- Migration: 002_rls_policies.sql
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngo_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Get current user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
    SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Check if user is platform admin
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'PLATFORM_ADMIN'
    );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Check if user is NGO admin for a specific NGO
CREATE OR REPLACE FUNCTION public.is_ngo_admin(ngo_uuid UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.ngo_members
        WHERE user_id = auth.uid()
        AND ngo_id = ngo_uuid
        AND role = 'NGO_ADMIN'
    );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Check if user is NGO member (any role) for a specific NGO
CREATE OR REPLACE FUNCTION public.is_ngo_member(ngo_uuid UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.ngo_members
        WHERE user_id = auth.uid()
        AND ngo_id = ngo_uuid
    );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Check if user is NGO coordinator or admin for a specific NGO
CREATE OR REPLACE FUNCTION public.is_ngo_coordinator_or_admin(ngo_uuid UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.ngo_members
        WHERE user_id = auth.uid()
        AND ngo_id = ngo_uuid
        AND role IN ('NGO_ADMIN', 'NGO_COORDINATOR')
    );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================================
-- USERS POLICIES
-- ============================================================

-- Users can read their own profile
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT USING (id = auth.uid());

-- Platform admins can read all users
CREATE POLICY "users_select_admin" ON public.users
    FOR SELECT USING (public.is_platform_admin());

-- NGO members can read basic info of other users in their NGO
CREATE POLICY "users_select_ngo_members" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.ngo_members nm1
            JOIN public.ngo_members nm2 ON nm1.ngo_id = nm2.ngo_id
            WHERE nm1.user_id = auth.uid()
            AND nm2.user_id = users.id
        )
    );

-- Users can update their own profile
CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE USING (id = auth.uid());

-- Platform admins can update any user
CREATE POLICY "users_update_admin" ON public.users
    FOR UPDATE USING (public.is_platform_admin());

-- Users can insert their own profile (on signup)
CREATE POLICY "users_insert_own" ON public.users
    FOR INSERT WITH CHECK (id = auth.uid());

-- ============================================================
-- NGOS POLICIES
-- ============================================================

-- Anyone can read verified NGOs
CREATE POLICY "ngos_select_verified" ON public.ngos
    FOR SELECT USING (status = 'VERIFIED' AND verification_status = 'APPROVED');

-- NGO members can read their own NGO
CREATE POLICY "ngos_select_members" ON public.ngos
    FOR SELECT USING (public.is_ngo_member(id));

-- Platform admins can read all NGOs
CREATE POLICY "ngos_select_admin" ON public.ngos
    FOR SELECT USING (public.is_platform_admin());

-- NGO admins can update their NGO
CREATE POLICY "ngos_update_admin" ON public.ngos
    FOR UPDATE USING (public.is_ngo_admin(id));

-- Platform admins can update any NGO
CREATE POLICY "ngos_update_platform_admin" ON public.ngos
    FOR UPDATE USING (public.is_platform_admin());

-- Authenticated users can create NGOs
CREATE POLICY "ngos_insert_authenticated" ON public.ngos
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Platform admins can delete NGOs
CREATE POLICY "ngos_delete_admin" ON public.ngos
    FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- NGO MEMBERS POLICIES
-- ============================================================

-- NGO members can see other members of their NGO
CREATE POLICY "ngo_members_select" ON public.ngo_members
    FOR SELECT USING (public.is_ngo_member(ngo_id) OR public.is_platform_admin());

-- NGO admins can add members
CREATE POLICY "ngo_members_insert" ON public.ngo_members
    FOR INSERT WITH CHECK (public.is_ngo_admin(ngo_id) OR public.is_platform_admin());

-- NGO admins can update member roles
CREATE POLICY "ngo_members_update" ON public.ngo_members
    FOR UPDATE USING (public.is_ngo_admin(ngo_id) OR public.is_platform_admin());

-- NGO admins can remove members, members can remove themselves
CREATE POLICY "ngo_members_delete" ON public.ngo_members
    FOR DELETE USING (
        public.is_ngo_admin(ngo_id)
        OR user_id = auth.uid()
        OR public.is_platform_admin()
    );

-- ============================================================
-- HELP REQUESTS POLICIES
-- ============================================================

-- Anyone can read public requests
CREATE POLICY "help_requests_select_public" ON public.help_requests
    FOR SELECT USING (visibility = 'PUBLIC');

-- NGO members can read their NGO's requests
CREATE POLICY "help_requests_select_ngo" ON public.help_requests
    FOR SELECT USING (public.is_ngo_member(ngo_id));

-- Volunteers can read requests assigned to them
CREATE POLICY "help_requests_select_volunteer" ON public.help_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.volunteer_assignments
            WHERE request_id = help_requests.id
            AND volunteer_id = auth.uid()
        )
    );

-- Platform admins can read all requests
CREATE POLICY "help_requests_select_admin" ON public.help_requests
    FOR SELECT USING (public.is_platform_admin());

-- NGO members can create requests for their NGO
CREATE POLICY "help_requests_insert" ON public.help_requests
    FOR INSERT WITH CHECK (public.is_ngo_member(ngo_id));

-- NGO coordinators/admins can update requests
CREATE POLICY "help_requests_update" ON public.help_requests
    FOR UPDATE USING (
        public.is_ngo_coordinator_or_admin(ngo_id)
        OR public.is_platform_admin()
    );

-- NGO admins can delete requests
CREATE POLICY "help_requests_delete" ON public.help_requests
    FOR DELETE USING (
        public.is_ngo_admin(ngo_id)
        OR public.is_platform_admin()
    );

-- ============================================================
-- REQUEST MEDIA POLICIES
-- ============================================================

-- Anyone can read media for public requests
CREATE POLICY "request_media_select" ON public.request_media
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.help_requests hr
            WHERE hr.id = request_media.request_id
            AND (hr.visibility = 'PUBLIC' OR public.is_ngo_member(hr.ngo_id))
        )
    );

-- NGO members can upload media
CREATE POLICY "request_media_insert" ON public.request_media
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.help_requests hr
            WHERE hr.id = request_media.request_id
            AND public.is_ngo_member(hr.ngo_id)
        )
    );

-- NGO coordinators/admins can delete media
CREATE POLICY "request_media_delete" ON public.request_media
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.help_requests hr
            WHERE hr.id = request_media.request_id
            AND public.is_ngo_coordinator_or_admin(hr.ngo_id)
        )
        OR public.is_platform_admin()
    );

-- ============================================================
-- REQUEST COMMENTS POLICIES
-- ============================================================

-- Anyone can read comments on public requests
CREATE POLICY "request_comments_select" ON public.request_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.help_requests hr
            WHERE hr.id = request_comments.request_id
            AND (hr.visibility = 'PUBLIC' OR public.is_ngo_member(hr.ngo_id))
        )
    );

-- Authenticated users can comment on public requests
CREATE POLICY "request_comments_insert" ON public.request_comments
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
        AND user_id = auth.uid()
    );

-- Users can update their own comments
CREATE POLICY "request_comments_update" ON public.request_comments
    FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own comments, NGO admins can delete any
CREATE POLICY "request_comments_delete" ON public.request_comments
    FOR DELETE USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.help_requests hr
            WHERE hr.id = request_comments.request_id
            AND public.is_ngo_admin(hr.ngo_id)
        )
        OR public.is_platform_admin()
    );

-- ============================================================
-- VOLUNTEER ASSIGNMENTS POLICIES
-- ============================================================

-- Volunteers can see their own assignments
CREATE POLICY "volunteer_assignments_select_own" ON public.volunteer_assignments
    FOR SELECT USING (volunteer_id = auth.uid());

-- NGO members can see assignments for their requests
CREATE POLICY "volunteer_assignments_select_ngo" ON public.volunteer_assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.help_requests hr
            WHERE hr.id = volunteer_assignments.request_id
            AND public.is_ngo_member(hr.ngo_id)
        )
    );

-- Platform admins can see all assignments
CREATE POLICY "volunteer_assignments_select_admin" ON public.volunteer_assignments
    FOR SELECT USING (public.is_platform_admin());

-- NGO coordinators/admins can create assignments
CREATE POLICY "volunteer_assignments_insert" ON public.volunteer_assignments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.help_requests hr
            WHERE hr.id = volunteer_assignments.request_id
            AND public.is_ngo_coordinator_or_admin(hr.ngo_id)
        )
    );

-- Volunteers can update their own assignments (accept/complete)
-- NGO coordinators/admins can update any assignment
CREATE POLICY "volunteer_assignments_update" ON public.volunteer_assignments
    FOR UPDATE USING (
        volunteer_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.help_requests hr
            WHERE hr.id = volunteer_assignments.request_id
            AND public.is_ngo_coordinator_or_admin(hr.ngo_id)
        )
        OR public.is_platform_admin()
    );

-- ============================================================
-- EVENTS POLICIES
-- ============================================================

-- Anyone can read public events
CREATE POLICY "events_select_public" ON public.events
    FOR SELECT USING (visibility = 'PUBLIC');

-- NGO members can read their NGO's events
CREATE POLICY "events_select_ngo" ON public.events
    FOR SELECT USING (public.is_ngo_member(ngo_id));

-- Platform admins can read all events
CREATE POLICY "events_select_admin" ON public.events
    FOR SELECT USING (public.is_platform_admin());

-- NGO coordinators/admins can create events
CREATE POLICY "events_insert" ON public.events
    FOR INSERT WITH CHECK (public.is_ngo_coordinator_or_admin(ngo_id));

-- NGO coordinators/admins can update events
CREATE POLICY "events_update" ON public.events
    FOR UPDATE USING (
        public.is_ngo_coordinator_or_admin(ngo_id)
        OR public.is_platform_admin()
    );

-- NGO admins can delete events
CREATE POLICY "events_delete" ON public.events
    FOR DELETE USING (
        public.is_ngo_admin(ngo_id)
        OR public.is_platform_admin()
    );

-- ============================================================
-- EVENT REGISTRATIONS POLICIES
-- ============================================================

-- Users can see their own registrations
CREATE POLICY "event_registrations_select_own" ON public.event_registrations
    FOR SELECT USING (user_id = auth.uid());

-- NGO members can see registrations for their events
CREATE POLICY "event_registrations_select_ngo" ON public.event_registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_registrations.event_id
            AND public.is_ngo_member(e.ngo_id)
        )
    );

-- Authenticated users can register for events
CREATE POLICY "event_registrations_insert" ON public.event_registrations
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
        AND user_id = auth.uid()
    );

-- Users can update their own registrations (cancel)
CREATE POLICY "event_registrations_update" ON public.event_registrations
    FOR UPDATE USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_registrations.event_id
            AND public.is_ngo_coordinator_or_admin(e.ngo_id)
        )
    );

-- ============================================================
-- POSTS POLICIES
-- ============================================================

-- Anyone can read public posts
CREATE POLICY "posts_select_public" ON public.posts
    FOR SELECT USING (visibility = 'PUBLIC');

-- NGO members can read their NGO's posts
CREATE POLICY "posts_select_ngo" ON public.posts
    FOR SELECT USING (public.is_ngo_member(ngo_id));

-- Platform admins can read all posts
CREATE POLICY "posts_select_admin" ON public.posts
    FOR SELECT USING (public.is_platform_admin());

-- NGO members can create posts
CREATE POLICY "posts_insert" ON public.posts
    FOR INSERT WITH CHECK (
        public.is_ngo_member(ngo_id)
        AND author_id = auth.uid()
    );

-- Post authors and NGO admins can update posts
CREATE POLICY "posts_update" ON public.posts
    FOR UPDATE USING (
        author_id = auth.uid()
        OR public.is_ngo_admin(ngo_id)
        OR public.is_platform_admin()
    );

-- Post authors and NGO admins can delete posts
CREATE POLICY "posts_delete" ON public.posts
    FOR DELETE USING (
        author_id = auth.uid()
        OR public.is_ngo_admin(ngo_id)
        OR public.is_platform_admin()
    );

-- ============================================================
-- POST LIKES POLICIES
-- ============================================================

-- Anyone can read likes on public posts
CREATE POLICY "post_likes_select" ON public.post_likes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.posts p
            WHERE p.id = post_likes.post_id
            AND p.visibility = 'PUBLIC'
        )
    );

-- Authenticated users can like posts
CREATE POLICY "post_likes_insert" ON public.post_likes
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
        AND user_id = auth.uid()
    );

-- Users can unlike (delete their own likes)
CREATE POLICY "post_likes_delete" ON public.post_likes
    FOR DELETE USING (user_id = auth.uid());

-- ============================================================
-- POST COMMENTS POLICIES
-- ============================================================

-- Anyone can read comments on public posts
CREATE POLICY "post_comments_select" ON public.post_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.posts p
            WHERE p.id = post_comments.post_id
            AND p.visibility = 'PUBLIC'
        )
    );

-- Authenticated users can comment
CREATE POLICY "post_comments_insert" ON public.post_comments
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
        AND user_id = auth.uid()
    );

-- Users can update their own comments
CREATE POLICY "post_comments_update" ON public.post_comments
    FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own comments, NGO admins can delete any
CREATE POLICY "post_comments_delete" ON public.post_comments
    FOR DELETE USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.posts p
            WHERE p.id = post_comments.post_id
            AND public.is_ngo_admin(p.ngo_id)
        )
        OR public.is_platform_admin()
    );

-- ============================================================
-- DONATIONS POLICIES
-- ============================================================

-- Donors can see their own donations
CREATE POLICY "donations_select_own" ON public.donations
    FOR SELECT USING (donor_id = auth.uid());

-- NGO members can see donations to their NGO
CREATE POLICY "donations_select_ngo" ON public.donations
    FOR SELECT USING (public.is_ngo_member(ngo_id));

-- Platform admins can see all donations
CREATE POLICY "donations_select_admin" ON public.donations
    FOR SELECT USING (public.is_platform_admin());

-- Authenticated users can create donations
CREATE POLICY "donations_insert" ON public.donations
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
        OR donor_id IS NULL -- Allow anonymous donations
    );

-- Donors can update their own pending donations
CREATE POLICY "donations_update_own" ON public.donations
    FOR UPDATE USING (
        donor_id = auth.uid()
        AND status = 'PENDING'
    );

-- Platform admins can update any donation
CREATE POLICY "donations_update_admin" ON public.donations
    FOR UPDATE USING (public.is_platform_admin());

-- ============================================================
-- RESOURCES POLICIES
-- ============================================================

-- NGO members can see their NGO's resources
CREATE POLICY "resources_select" ON public.resources
    FOR SELECT USING (
        public.is_ngo_member(ngo_id)
        OR public.is_platform_admin()
    );

-- NGO coordinators/admins can manage resources
CREATE POLICY "resources_insert" ON public.resources
    FOR INSERT WITH CHECK (public.is_ngo_coordinator_or_admin(ngo_id));

CREATE POLICY "resources_update" ON public.resources
    FOR UPDATE USING (
        public.is_ngo_coordinator_or_admin(ngo_id)
        OR public.is_platform_admin()
    );

CREATE POLICY "resources_delete" ON public.resources
    FOR DELETE USING (
        public.is_ngo_admin(ngo_id)
        OR public.is_platform_admin()
    );

-- ============================================================
-- RESOURCE REQUESTS POLICIES
-- ============================================================

-- NGO members can see resource requests for their NGO's resources
CREATE POLICY "resource_requests_select" ON public.resource_requests
    FOR SELECT USING (
        requested_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.resources r
            WHERE r.id = resource_requests.resource_id
            AND public.is_ngo_member(r.ngo_id)
        )
        OR public.is_platform_admin()
    );

-- NGO members can create resource requests
CREATE POLICY "resource_requests_insert" ON public.resource_requests
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
        AND requested_by = auth.uid()
    );

-- NGO coordinators/admins can update resource requests
CREATE POLICY "resource_requests_update" ON public.resource_requests
    FOR UPDATE USING (
        requested_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.resources r
            WHERE r.id = resource_requests.resource_id
            AND public.is_ngo_coordinator_or_admin(r.ngo_id)
        )
        OR public.is_platform_admin()
    );

-- ============================================================
-- CHATS POLICIES
-- ============================================================

-- Chat participants can see their chats
CREATE POLICY "chats_select" ON public.chats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_participants cp
            WHERE cp.chat_id = chats.id
            AND cp.user_id = auth.uid()
        )
        OR public.is_platform_admin()
    );

-- Authenticated users can create chats
CREATE POLICY "chats_insert" ON public.chats
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
        AND created_by = auth.uid()
    );

-- Chat creators can update their chats
CREATE POLICY "chats_update" ON public.chats
    FOR UPDATE USING (
        created_by = auth.uid()
        OR public.is_platform_admin()
    );

-- ============================================================
-- CHAT PARTICIPANTS POLICIES
-- ============================================================

-- Chat participants can see other participants
CREATE POLICY "chat_participants_select" ON public.chat_participants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_participants cp
            WHERE cp.chat_id = chat_participants.chat_id
            AND cp.user_id = auth.uid()
        )
        OR public.is_platform_admin()
    );

-- Chat creators can add participants
CREATE POLICY "chat_participants_insert" ON public.chat_participants
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chats c
            WHERE c.id = chat_participants.chat_id
            AND c.created_by = auth.uid()
        )
        OR user_id = auth.uid() -- Users can add themselves
    );

-- Participants can update their own read status
CREATE POLICY "chat_participants_update" ON public.chat_participants
    FOR UPDATE USING (user_id = auth.uid());

-- ============================================================
-- MESSAGES POLICIES
-- ============================================================

-- Chat participants can read messages
CREATE POLICY "messages_select" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_participants cp
            WHERE cp.chat_id = messages.chat_id
            AND cp.user_id = auth.uid()
        )
        OR public.is_platform_admin()
    );

-- Chat participants can send messages
CREATE POLICY "messages_insert" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chat_participants cp
            WHERE cp.chat_id = messages.chat_id
            AND cp.user_id = auth.uid()
        )
        AND sender_id = auth.uid()
    );

-- Message senders can edit/delete their messages
CREATE POLICY "messages_update" ON public.messages
    FOR UPDATE USING (sender_id = auth.uid());

-- ============================================================
-- NOTIFICATIONS POLICIES
-- ============================================================

-- Users can only see their own notifications
CREATE POLICY "notifications_select" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

-- System can insert notifications (service role)
CREATE POLICY "notifications_insert" ON public.notifications
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR auth.role() = 'service_role');

-- Users can update their own notifications (mark as read)
CREATE POLICY "notifications_update" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "notifications_delete" ON public.notifications
    FOR DELETE USING (user_id = auth.uid());

-- ============================================================
-- NOTIFICATION PREFERENCES POLICIES
-- ============================================================

-- Users can see their own preferences
CREATE POLICY "notification_preferences_select" ON public.notification_preferences
    FOR SELECT USING (user_id = auth.uid());

-- Users can create their own preferences
CREATE POLICY "notification_preferences_insert" ON public.notification_preferences
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own preferences
CREATE POLICY "notification_preferences_update" ON public.notification_preferences
    FOR UPDATE USING (user_id = auth.uid());

-- ============================================================
-- FOLLOWS POLICIES
-- ============================================================

-- Anyone can see follows (for follower counts)
CREATE POLICY "follows_select" ON public.follows
    FOR SELECT USING (TRUE);

-- Authenticated users can follow NGOs
CREATE POLICY "follows_insert" ON public.follows
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
        AND follower_id = auth.uid()
    );

-- Users can unfollow
CREATE POLICY "follows_delete" ON public.follows
    FOR DELETE USING (follower_id = auth.uid());

-- ============================================================
-- REPORTS POLICIES
-- ============================================================

-- Reporters can see their own reports
CREATE POLICY "reports_select_own" ON public.reports
    FOR SELECT USING (reporter_id = auth.uid());

-- Platform admins can see all reports
CREATE POLICY "reports_select_admin" ON public.reports
    FOR SELECT USING (public.is_platform_admin());

-- Authenticated users can create reports
CREATE POLICY "reports_insert" ON public.reports
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
        AND reporter_id = auth.uid()
    );

-- Platform admins can update reports (review/resolve)
CREATE POLICY "reports_update" ON public.reports
    FOR UPDATE USING (public.is_platform_admin());

-- ============================================================
-- AUDIT LOGS POLICIES
-- ============================================================

-- Platform admins can see all audit logs
CREATE POLICY "audit_logs_select_admin" ON public.audit_logs
    FOR SELECT USING (public.is_platform_admin());

-- NGO admins can see audit logs for their NGO
CREATE POLICY "audit_logs_select_ngo" ON public.audit_logs
    FOR SELECT USING (
        actor_id = auth.uid()
        OR (
            target_type = 'NGO'
            AND EXISTS (
                SELECT 1 FROM public.ngo_members nm
                WHERE nm.user_id = auth.uid()
                AND nm.ngo_id = audit_logs.target_id
                AND nm.role = 'NGO_ADMIN'
            )
        )
    );

-- System can insert audit logs
CREATE POLICY "audit_logs_insert" ON public.audit_logs
    FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- ACHIEVEMENTS POLICIES
-- ============================================================

-- Users can see their own achievements
CREATE POLICY "achievements_select_own" ON public.achievements
    FOR SELECT USING (user_id = auth.uid());

-- Platform admins can see all achievements
CREATE POLICY "achievements_select_admin" ON public.achievements
    FOR SELECT USING (public.is_platform_admin());

-- System can insert achievements
CREATE POLICY "achievements_insert" ON public.achievements
    FOR INSERT WITH CHECK (TRUE);
