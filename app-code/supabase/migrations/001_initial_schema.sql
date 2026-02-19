-- ============================================================
-- Helpit NGO Platform - Initial Database Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM (
    'PLATFORM_ADMIN',
    'NGO_ADMIN',
    'NGO_COORDINATOR',
    'NGO_MEMBER',
    'VOLUNTEER',
    'DONOR',
    'INDIVIDUAL'
);

CREATE TYPE user_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'PENDING',
    'SUSPENDED'
);

CREATE TYPE ngo_status AS ENUM (
    'PENDING',
    'VERIFIED',
    'SUSPENDED'
);

CREATE TYPE verification_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);

CREATE TYPE subscription_plan AS ENUM (
    'FREE',
    'STANDARD',
    'PREMIUM'
);

CREATE TYPE request_category AS ENUM (
    'FOOD',
    'MEDICAL',
    'SHELTER',
    'EDUCATION',
    'CLOTHING',
    'EMERGENCY',
    'ENVIRONMENT',
    'ELDERLY_CARE',
    'CHILD_CARE',
    'DISABILITY_SUPPORT',
    'OTHER'
);

CREATE TYPE request_urgency AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);

CREATE TYPE request_status AS ENUM (
    'OPEN',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'CLOSED'
);

CREATE TYPE assignment_status AS ENUM (
    'PENDING',
    'ACCEPTED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);

CREATE TYPE event_type AS ENUM (
    'FUNDRAISER',
    'VOLUNTEER_DRIVE',
    'AWARENESS',
    'COMMUNITY',
    'TRAINING'
);

CREATE TYPE event_status AS ENUM (
    'UPCOMING',
    'ONGOING',
    'COMPLETED',
    'CANCELLED'
);

CREATE TYPE donation_status AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
);

CREATE TYPE payment_method AS ENUM (
    'UPI',
    'CARD',
    'NET_BANKING',
    'WALLET'
);

CREATE TYPE chat_type AS ENUM (
    'NGO_TO_NGO',
    'VOLUNTEER_TO_NGO',
    'GROUP',
    'SUPPORT'
);

CREATE TYPE notification_type AS ENUM (
    'NEW_REQUEST',
    'STATUS_UPDATE',
    'ASSIGNMENT',
    'MESSAGE',
    'DONATION',
    'FOLLOW',
    'VERIFICATION',
    'SYSTEM'
);

CREATE TYPE report_status AS ENUM (
    'PENDING',
    'IN_REVIEW',
    'RESOLVED',
    'DISMISSED'
);

CREATE TYPE report_priority AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH'
);

-- ============================================================
-- TABLES
-- ============================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'INDIVIDUAL',
    status user_status NOT NULL DEFAULT 'ACTIVE',
    bio TEXT,
    location TEXT,
    coordinates JSONB, -- { type: 'Point', coordinates: [lng, lat] }

    -- Volunteer-specific
    skills TEXT[],
    availability BOOLEAN NOT NULL DEFAULT FALSE,
    availability_hours JSONB,

    -- Donor-specific
    pan_number TEXT,

    -- Timestamps
    email_verified_at TIMESTAMPTZ,
    last_active_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NGOs table
CREATE TABLE IF NOT EXISTS public.ngos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,

    -- Contact
    email TEXT NOT NULL,
    phone TEXT,
    website TEXT,

    -- Address
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    country TEXT NOT NULL DEFAULT 'India',
    coordinates JSONB,

    -- Registration
    registration_number TEXT NOT NULL,
    registration_date DATE,
    registration_certificate_url TEXT,

    -- Tax exemption
    has_80g BOOLEAN NOT NULL DEFAULT FALSE,
    _80g_certificate_url TEXT,
    has_12a BOOLEAN NOT NULL DEFAULT FALSE,
    _12a_certificate_url TEXT,
    pan_number TEXT,

    -- Categories
    categories TEXT[] NOT NULL DEFAULT '{}',
    tags TEXT[] NOT NULL DEFAULT '{}',

    -- Status
    status ngo_status NOT NULL DEFAULT 'PENDING',
    verification_status verification_status NOT NULL DEFAULT 'PENDING',
    verification_notes TEXT,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.users(id),

    -- Subscription
    plan subscription_plan NOT NULL DEFAULT 'FREE',
    plan_started_at TIMESTAMPTZ,
    plan_ends_at TIMESTAMPTZ,

    -- Social
    social_links JSONB NOT NULL DEFAULT '{}',

    -- Stats (denormalized for performance)
    total_volunteers INTEGER NOT NULL DEFAULT 0,
    total_donations INTEGER NOT NULL DEFAULT 0,
    total_requests_resolved INTEGER NOT NULL DEFAULT 0,
    rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NGO Members
CREATE TABLE IF NOT EXISTS public.ngo_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ngo_id UUID NOT NULL REFERENCES public.ngos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'NGO_MEMBER',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    invited_by UUID REFERENCES public.users(id),
    UNIQUE(ngo_id, user_id)
);

-- Help Requests
CREATE TABLE IF NOT EXISTS public.help_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ngo_id UUID NOT NULL REFERENCES public.ngos(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.users(id),

    -- Content
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category request_category NOT NULL,
    urgency request_urgency NOT NULL DEFAULT 'MEDIUM',

    -- Status
    status request_status NOT NULL DEFAULT 'OPEN',

    -- Location
    location TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    coordinates JSONB,

    -- Requirements
    volunteers_needed INTEGER NOT NULL DEFAULT 1,
    volunteers_assigned INTEGER NOT NULL DEFAULT 0,
    estimated_hours INTEGER,
    deadline TIMESTAMPTZ,

    -- Visibility
    visibility TEXT NOT NULL DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'PRIVATE', 'NGO_ONLY')),

    -- Timestamps
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Request Media
CREATE TABLE IF NOT EXISTS public.request_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.help_requests(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('image', 'video', 'document')),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    is_evidence BOOLEAN NOT NULL DEFAULT FALSE,
    coordinates JSONB,
    taken_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Request Comments
CREATE TABLE IF NOT EXISTS public.request_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.help_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.request_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Volunteer Assignments
CREATE TABLE IF NOT EXISTS public.volunteer_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.help_requests(id) ON DELETE CASCADE,
    volunteer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    assigned_by UUID NOT NULL REFERENCES public.users(id),
    status assignment_status NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    hours_logged DECIMAL(5,2),
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ngo_id UUID NOT NULL REFERENCES public.ngos(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.users(id),

    -- Content
    title TEXT NOT NULL,
    description TEXT,
    event_type event_type NOT NULL,
    cover_image_url TEXT,

    -- Timing
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,

    -- Location
    location_type TEXT NOT NULL DEFAULT 'PHYSICAL' CHECK (location_type IN ('PHYSICAL', 'VIRTUAL', 'HYBRID')),
    venue_name TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    coordinates JSONB,
    virtual_link TEXT,

    -- Capacity
    max_attendees INTEGER,
    current_attendees INTEGER NOT NULL DEFAULT 0,
    registration_deadline DATE,

    -- Status
    status event_status NOT NULL DEFAULT 'UPCOMING',
    visibility TEXT NOT NULL DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'PRIVATE')),

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Event Registrations
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'REGISTERED' CHECK (status IN ('REGISTERED', 'ATTENDED', 'CANCELLED')),
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    attended_at TIMESTAMPTZ,
    UNIQUE(event_id, user_id)
);

-- Posts
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ngo_id UUID NOT NULL REFERENCES public.ngos(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.users(id),

    -- Content
    title TEXT,
    content TEXT NOT NULL,
    post_type TEXT NOT NULL DEFAULT 'UPDATE' CHECK (post_type IN ('UPDATE', 'ANNOUNCEMENT', 'STORY', 'IMPACT')),

    -- Media
    media_urls TEXT[] NOT NULL DEFAULT '{}',

    -- Engagement
    likes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,

    -- Visibility
    visibility TEXT NOT NULL DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'PRIVATE')),

    -- Timestamps
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Post Likes
CREATE TABLE IF NOT EXISTS public.post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Post Comments
CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Donations
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ngo_id UUID NOT NULL REFERENCES public.ngos(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,

    -- Amount
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',

    -- Recurring
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    recurring_frequency TEXT CHECK (recurring_frequency IN ('MONTHLY', 'QUARTERLY', 'YEARLY')),
    recurring_parent_id UUID REFERENCES public.donations(id),

    -- Donor info (for anonymous/guest)
    donor_name TEXT,
    donor_email TEXT,
    donor_phone TEXT,
    donor_pan TEXT,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    message TEXT,

    -- Payment
    payment_method payment_method,
    payment_id TEXT,
    order_id TEXT,
    status donation_status NOT NULL DEFAULT 'PENDING',

    -- Receipt
    receipt_number TEXT UNIQUE,
    receipt_sent_at TIMESTAMPTZ,

    -- Timestamps
    completed_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Resources
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ngo_id UUID NOT NULL REFERENCES public.ngos(id) ON DELETE CASCADE,

    -- Content
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('FOOD', 'MEDICAL', 'CLOTHING', 'EQUIPMENT', 'VEHICLE', 'OTHER')),
    quantity INTEGER NOT NULL DEFAULT 0,
    unit TEXT,

    -- Location
    storage_location TEXT,

    -- Status
    min_quantity INTEGER NOT NULL DEFAULT 0,
    is_low_stock BOOLEAN NOT NULL DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Resource Requests
CREATE TABLE IF NOT EXISTS public.resource_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    request_id UUID REFERENCES public.help_requests(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'FULFILLED', 'CANCELLED')),
    notes TEXT,
    requested_by UUID NOT NULL REFERENCES public.users(id),
    approved_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chats
CREATE TABLE IF NOT EXISTS public.chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_type chat_type NOT NULL,
    name TEXT,
    description TEXT,
    avatar_url TEXT,
    created_by UUID NOT NULL REFERENCES public.users(id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_message_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chat Participants
CREATE TABLE IF NOT EXISTS public.chat_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    ngo_id UUID REFERENCES public.ngos(id) ON DELETE SET NULL,
    last_read_at TIMESTAMPTZ,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(chat_id, user_id)
);

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'TEXT' CHECK (message_type IN ('TEXT', 'IMAGE', 'FILE', 'LOCATION')),
    media_url TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    reply_to UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    is_edited BOOLEAN NOT NULL DEFAULT FALSE,
    edited_at TIMESTAMPTZ,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    notification_type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    data JSONB NOT NULL DEFAULT '{}',
    action_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notification Preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,

    -- Push
    push_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    push_new_requests BOOLEAN NOT NULL DEFAULT TRUE,
    push_assignments BOOLEAN NOT NULL DEFAULT TRUE,
    push_messages BOOLEAN NOT NULL DEFAULT TRUE,
    push_donations BOOLEAN NOT NULL DEFAULT TRUE,

    -- Email
    email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_new_requests BOOLEAN NOT NULL DEFAULT TRUE,
    email_assignments BOOLEAN NOT NULL DEFAULT TRUE,
    email_messages BOOLEAN NOT NULL DEFAULT FALSE,
    email_donations BOOLEAN NOT NULL DEFAULT TRUE,
    email_newsletter BOOLEAN NOT NULL DEFAULT FALSE,

    -- Quiet hours
    quiet_hours_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    quiet_hours_start TIME,
    quiet_hours_end TIME,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Follows (User follows NGO)
CREATE TABLE IF NOT EXISTS public.follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    following_ngo_id UUID NOT NULL REFERENCES public.ngos(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(follower_id, following_ngo_id)
);

-- Reports
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

    -- Reported entity
    reported_entity_type TEXT NOT NULL CHECK (reported_entity_type IN ('USER', 'NGO', 'POST', 'REQUEST')),
    reported_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reported_ngo_id UUID REFERENCES public.ngos(id) ON DELETE SET NULL,
    reported_post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
    reported_request_id UUID REFERENCES public.help_requests(id) ON DELETE SET NULL,

    -- Details
    reason TEXT NOT NULL,
    description TEXT,
    evidence_urls TEXT[] NOT NULL DEFAULT '{}',

    -- Status
    status report_status NOT NULL DEFAULT 'PENDING',
    priority report_priority NOT NULL DEFAULT 'MEDIUM',

    -- Resolution
    assigned_to UUID REFERENCES public.users(id),
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES public.users(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Actor
    actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    actor_role TEXT,

    -- Action
    action TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('USER_MANAGEMENT', 'NGO_MANAGEMENT', 'DONATION', 'MODERATION', 'PLATFORM')),

    -- Target
    target_type TEXT,
    target_id UUID,

    -- Details
    details TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',

    -- Request info
    ip_address INET,
    user_agent TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Achievements
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);

-- NGOs
CREATE INDEX IF NOT EXISTS idx_ngos_slug ON public.ngos(slug);
CREATE INDEX IF NOT EXISTS idx_ngos_status ON public.ngos(status);
CREATE INDEX IF NOT EXISTS idx_ngos_verification_status ON public.ngos(verification_status);
CREATE INDEX IF NOT EXISTS idx_ngos_city ON public.ngos(city);
CREATE INDEX IF NOT EXISTS idx_ngos_state ON public.ngos(state);

-- NGO Members
CREATE INDEX IF NOT EXISTS idx_ngo_members_ngo_id ON public.ngo_members(ngo_id);
CREATE INDEX IF NOT EXISTS idx_ngo_members_user_id ON public.ngo_members(user_id);

-- Help Requests
CREATE INDEX IF NOT EXISTS idx_help_requests_ngo_id ON public.help_requests(ngo_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_status ON public.help_requests(status);
CREATE INDEX IF NOT EXISTS idx_help_requests_category ON public.help_requests(category);
CREATE INDEX IF NOT EXISTS idx_help_requests_urgency ON public.help_requests(urgency);
CREATE INDEX IF NOT EXISTS idx_help_requests_created_by ON public.help_requests(created_by);
CREATE INDEX IF NOT EXISTS idx_help_requests_city ON public.help_requests(city);

-- Volunteer Assignments
CREATE INDEX IF NOT EXISTS idx_volunteer_assignments_request_id ON public.volunteer_assignments(request_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_assignments_volunteer_id ON public.volunteer_assignments(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_assignments_status ON public.volunteer_assignments(status);

-- Events
CREATE INDEX IF NOT EXISTS idx_events_ngo_id ON public.events(ngo_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);

-- Posts
CREATE INDEX IF NOT EXISTS idx_posts_ngo_id ON public.posts(ngo_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_visibility ON public.posts(visibility);

-- Donations
CREATE INDEX IF NOT EXISTS idx_donations_ngo_id ON public.donations(ngo_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);

-- Messages
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);

-- Follows
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_ngo_id ON public.follows(following_ngo_id);

-- Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_category ON public.audit_logs(category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Reports
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON public.reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
