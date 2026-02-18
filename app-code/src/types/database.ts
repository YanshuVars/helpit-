// Database Types for Helpit NGO Platform
// Generated from Supabase schema

// ============================================
// ENUMS
// ============================================

export type UserRole =
    | 'PLATFORM_ADMIN'
    | 'NGO_ADMIN'
    | 'NGO_COORDINATOR'
    | 'NGO_MEMBER'
    | 'VOLUNTEER'
    | 'DONOR'
    | 'INDIVIDUAL';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';

export type NgoStatus = 'PENDING' | 'VERIFIED' | 'SUSPENDED';

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type SubscriptionPlan = 'FREE' | 'STANDARD' | 'PREMIUM';

export type RequestCategory =
    | 'FOOD'
    | 'MEDICAL'
    | 'SHELTER'
    | 'EDUCATION'
    | 'CLOTHING'
    | 'EMERGENCY'
    | 'ENVIRONMENT'
    | 'ELDERLY_CARE'
    | 'CHILD_CARE'
    | 'DISABILITY_SUPPORT'
    | 'OTHER';

export type RequestUrgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RequestStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'CLOSED';

export type AssignmentStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type EventType = 'FUNDRAISER' | 'VOLUNTEER_DRIVE' | 'AWARENESS' | 'COMMUNITY' | 'TRAINING';

export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export type DonationStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET';

export type ChatType = 'NGO_TO_NGO' | 'VOLUNTEER_TO_NGO' | 'GROUP' | 'SUPPORT';

export type NotificationType =
    | 'NEW_REQUEST'
    | 'STATUS_UPDATE'
    | 'ASSIGNMENT'
    | 'MESSAGE'
    | 'DONATION'
    | 'FOLLOW'
    | 'VERIFICATION'
    | 'SYSTEM';

export type ReportStatus = 'PENDING' | 'IN_REVIEW' | 'RESOLVED' | 'DISMISSED';

export type ReportPriority = 'LOW' | 'MEDIUM' | 'HIGH';

// ============================================
// TABLE ROW TYPES
// ============================================

export interface User {
    id: string;
    email: string;
    full_name: string;
    phone: string | null;
    avatar_url: string | null;
    role: UserRole;
    status: UserStatus;
    bio: string | null;
    location: string | null;
    coordinates: GeolocationPoint | null;

    // Volunteer-specific
    skills: string[] | null;
    availability: boolean;
    availability_hours: AvailabilityHours | null;

    // Donor-specific
    pan_number: string | null;

    // Timestamps
    email_verified_at: string | null;
    last_active_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Ngo {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logo_url: string | null;
    cover_image_url: string | null;

    // Contact
    email: string;
    phone: string | null;
    website: string | null;

    // Address
    address: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    country: string;
    coordinates: GeolocationPoint | null;

    // Registration
    registration_number: string;
    registration_date: string | null;
    registration_certificate_url: string | null;

    // Tax exemption
    has_80g: boolean;
    _80g_certificate_url: string | null;
    has_12a: boolean;
    _12a_certificate_url: string | null;
    pan_number: string | null;

    // Categories
    categories: string[];
    tags: string[];

    // Status
    status: NgoStatus;
    verification_status: VerificationStatus;
    verification_notes: string | null;
    verified_at: string | null;
    verified_by: string | null;

    // Subscription
    plan: SubscriptionPlan;
    plan_started_at: string | null;
    plan_ends_at: string | null;

    // Social
    social_links: SocialLinks;

    // Stats
    total_volunteers: number;
    total_donations: number;
    total_requests_resolved: number;
    rating: number;

    // Timestamps
    created_at: string;
    updated_at: string;
}

export interface NgoMember {
    id: string;
    ngo_id: string;
    user_id: string;
    role: UserRole;
    joined_at: string;
    invited_by: string | null;

    // Relations
    ngo?: Ngo;
    user?: User;
}

export interface HelpRequest {
    id: string;
    ngo_id: string;
    created_by: string;

    // Content
    title: string;
    description: string;
    category: RequestCategory;
    urgency: RequestUrgency;

    // Status
    status: RequestStatus;

    // Location
    location: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    coordinates: GeolocationPoint | null;

    // Requirements
    volunteers_needed: number;
    volunteers_assigned: number;
    estimated_hours: number | null;
    deadline: string | null;

    // Visibility
    visibility: 'PUBLIC' | 'PRIVATE' | 'NGO_ONLY';

    // Timestamps
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;

    // Relations
    ngo?: Ngo;
    creator?: User;
    media?: RequestMedia[];
    comments?: RequestComment[];
    assignments?: VolunteerAssignment[];
}

export interface RequestMedia {
    id: string;
    request_id: string;
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnail_url: string | null;
    caption: string | null;
    is_evidence: boolean;
    coordinates: GeolocationPoint | null;
    taken_at: string | null;
    created_at: string;
}

export interface RequestComment {
    id: string;
    request_id: string;
    user_id: string;
    parent_id: string | null;
    content: string;
    created_at: string;
    updated_at: string;

    // Relations
    user?: User;
    replies?: RequestComment[];
}

export interface VolunteerAssignment {
    id: string;
    request_id: string;
    volunteer_id: string;
    assigned_by: string;
    status: AssignmentStatus;
    notes: string | null;
    started_at: string | null;
    completed_at: string | null;
    hours_logged: number | null;
    feedback: string | null;
    rating: number | null;
    created_at: string;
    updated_at: string;

    // Relations
    request?: HelpRequest;
    volunteer?: User;
    assigner?: User;
}

export interface Event {
    id: string;
    ngo_id: string;
    created_by: string;

    // Content
    title: string;
    description: string | null;
    event_type: EventType;
    cover_image_url: string | null;

    // Timing
    start_date: string;
    end_date: string;
    start_time: string | null;
    end_time: string | null;

    // Location
    location_type: 'PHYSICAL' | 'VIRTUAL' | 'HYBRID';
    venue_name: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    coordinates: GeolocationPoint | null;
    virtual_link: string | null;

    // Capacity
    max_attendees: number | null;
    current_attendees: number;
    registration_deadline: string | null;

    // Status
    status: EventStatus;
    visibility: 'PUBLIC' | 'PRIVATE';

    // Timestamps
    created_at: string;
    updated_at: string;

    // Relations
    ngo?: Ngo;
    registrations?: EventRegistration[];
}

export interface EventRegistration {
    id: string;
    event_id: string;
    user_id: string;
    status: 'REGISTERED' | 'ATTENDED' | 'CANCELLED';
    registered_at: string;
    attended_at: string | null;

    // Relations
    event?: Event;
    user?: User;
}

export interface Post {
    id: string;
    ngo_id: string;
    author_id: string;

    // Content
    title: string | null;
    content: string;
    post_type: 'UPDATE' | 'ANNOUNCEMENT' | 'STORY' | 'IMPACT';

    // Media
    media_urls: string[];

    // Engagement
    likes_count: number;
    comments_count: number;

    // Visibility
    visibility: 'PUBLIC' | 'PRIVATE';

    // Timestamps
    published_at: string | null;
    created_at: string;
    updated_at: string;

    // Relations
    ngo?: Ngo;
    author?: User;
    likes?: PostLike[];
    comments?: PostComment[];
}

export interface PostLike {
    id: string;
    post_id: string;
    user_id: string;
    created_at: string;
}

export interface PostComment {
    id: string;
    post_id: string;
    user_id: string;
    parent_id: string | null;
    content: string;
    created_at: string;
    updated_at: string;

    // Relations
    user?: User;
    replies?: PostComment[];
}

export interface Donation {
    id: string;
    ngo_id: string;
    donor_id: string | null;

    // Amount
    amount: number;
    currency: string;

    // Recurring
    is_recurring: boolean;
    recurring_frequency: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | null;
    recurring_parent_id: string | null;

    // Donor info (for anonymous/guest)
    donor_name: string | null;
    donor_email: string | null;
    donor_phone: string | null;
    donor_pan: string | null;
    is_anonymous: boolean;
    message: string | null;

    // Payment
    payment_method: PaymentMethod | null;
    payment_id: string | null;
    order_id: string | null;
    status: DonationStatus;

    // Receipt
    receipt_number: string | null;
    receipt_sent_at: string | null;

    // Timestamps
    completed_at: string | null;
    refunded_at: string | null;
    created_at: string;
    updated_at: string;

    // Relations
    ngo?: Ngo;
    donor?: User;
}

export interface Resource {
    id: string;
    ngo_id: string;

    // Content
    name: string;
    description: string | null;
    category: 'FOOD' | 'MEDICAL' | 'CLOTHING' | 'EQUIPMENT' | 'VEHICLE' | 'OTHER';
    quantity: number;
    unit: string | null;

    // Location
    storage_location: string | null;

    // Status
    min_quantity: number;
    is_low_stock: boolean;

    // Timestamps
    created_at: string;
    updated_at: string;
}

export interface ResourceRequest {
    id: string;
    resource_id: string;
    request_id: string | null;
    quantity: number;
    status: 'PENDING' | 'APPROVED' | 'FULFILLED' | 'CANCELLED';
    notes: string | null;
    requested_by: string;
    approved_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface Chat {
    id: string;
    chat_type: ChatType;
    name: string | null;
    description: string | null;
    avatar_url: string | null;
    created_by: string;
    is_active: boolean;
    last_message_at: string | null;
    created_at: string;
    updated_at: string;

    // Relations
    participants?: ChatParticipant[];
    messages?: Message[];
}

export interface ChatParticipant {
    id: string;
    chat_id: string;
    user_id: string;
    ngo_id: string | null;
    last_read_at: string | null;
    joined_at: string;

    // Relations
    user?: User;
    ngo?: Ngo;
}

export interface Message {
    id: string;
    chat_id: string;
    sender_id: string;
    content: string;
    message_type: 'TEXT' | 'IMAGE' | 'FILE' | 'LOCATION';
    media_url: string | null;
    metadata: Record<string, unknown>;
    reply_to: string | null;
    is_edited: boolean;
    edited_at: string | null;
    is_deleted: boolean;
    deleted_at: string | null;
    created_at: string;

    // Relations
    sender?: User;
    replyToMessage?: Message;
}

export interface Notification {
    id: string;
    user_id: string;
    notification_type: NotificationType;
    title: string;
    message: string | null;
    data: Record<string, unknown>;
    action_url: string | null;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
}

export interface NotificationPreferences {
    id: string;
    user_id: string;

    // Push
    push_enabled: boolean;
    push_new_requests: boolean;
    push_assignments: boolean;
    push_messages: boolean;
    push_donations: boolean;

    // Email
    email_enabled: boolean;
    email_new_requests: boolean;
    email_assignments: boolean;
    email_messages: boolean;
    email_donations: boolean;
    email_newsletter: boolean;

    // Quiet hours
    quiet_hours_enabled: boolean;
    quiet_hours_start: string | null;
    quiet_hours_end: string | null;

    created_at: string;
    updated_at: string;
}

export interface Follow {
    id: string;
    follower_id: string;
    following_ngo_id: string;
    created_at: string;

    // Relations
    ngo?: Ngo;
}

export interface Report {
    id: string;
    reporter_id: string;

    // Reported entity
    reported_entity_type: 'USER' | 'NGO' | 'POST' | 'REQUEST';
    reported_user_id: string | null;
    reported_ngo_id: string | null;
    reported_post_id: string | null;
    reported_request_id: string | null;

    // Details
    reason: string;
    description: string | null;
    evidence_urls: string[];

    // Status
    status: ReportStatus;
    priority: ReportPriority;

    // Resolution
    assigned_to: string | null;
    resolution_notes: string | null;
    resolved_at: string | null;
    resolved_by: string | null;

    created_at: string;
    updated_at: string;

    // Relations
    reporter?: User;
    reportedUser?: User;
    reportedNgo?: Ngo;
}

export interface AuditLog {
    id: string;

    // Actor
    actor_id: string | null;
    actor_role: string | null;

    // Action
    action: string;
    category: 'USER_MANAGEMENT' | 'NGO_MANAGEMENT' | 'DONATION' | 'MODERATION' | 'PLATFORM';

    // Target
    target_type: string | null;
    target_id: string | null;

    // Details
    details: string | null;
    metadata: Record<string, unknown>;

    // Request info
    ip_address: string | null;
    user_agent: string | null;

    created_at: string;

    // Relations
    actor?: User;
}

export interface Achievement {
    id: string;
    user_id: string;
    achievement_type: string;
    title: string;
    description: string | null;
    icon: string | null;
    earned_at: string;
}

// ============================================
// HELPER TYPES
// ============================================

export interface GeolocationPoint {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
}

export interface AvailabilityHours {
    weekdays?: {
        start: string;
        end: string;
    };
    weekends?: {
        start: string;
        end: string;
    };
    specific_days?: Array<{
        day: string;
        start: string;
        end: string;
    }>;
}

export interface SocialLinks {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    website?: string;
}

// ============================================
// INSERT/UPDATE TYPES
// ============================================

export type UserInsert = Omit<User, 'id' | 'created_at' | 'updated_at'>;
export type UserUpdate = Partial<UserInsert>;

export type NgoInsert = Omit<Ngo, 'id' | 'created_at' | 'updated_at' | 'total_volunteers' | 'total_donations' | 'total_requests_resolved' | 'rating'>;
export type NgoUpdate = Partial<NgoInsert>;

export type HelpRequestInsert = Omit<HelpRequest, 'id' | 'created_at' | 'updated_at' | 'started_at' | 'completed_at' | 'volunteers_assigned'>;
export type HelpRequestUpdate = Partial<HelpRequestInsert>;

export type VolunteerAssignmentInsert = Omit<VolunteerAssignment, 'id' | 'created_at' | 'updated_at' | 'started_at' | 'completed_at' | 'hours_logged' | 'feedback' | 'rating'>;
export type VolunteerAssignmentUpdate = Partial<VolunteerAssignmentInsert>;

export type EventInsert = Omit<Event, 'id' | 'created_at' | 'updated_at' | 'current_attendees'>;
export type EventUpdate = Partial<EventInsert>;

export type PostInsert = Omit<Post, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count' | 'published_at'>;
export type PostUpdate = Partial<PostInsert>;

export type DonationInsert = Omit<Donation, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'refunded_at' | 'receipt_number' | 'receipt_sent_at'>;
export type DonationUpdate = Partial<DonationInsert>;

export type MessageInsert = Omit<Message, 'id' | 'created_at' | 'is_edited' | 'edited_at' | 'is_deleted' | 'deleted_at'>;
export type MessageUpdate = Partial<MessageInsert>;

export type NotificationInsert = Omit<Notification, 'id' | 'created_at' | 'read_at'>;
export type NotificationUpdate = Partial<Omit<NotificationInsert, 'user_id'>>;

// ============================================
// DATABASE TYPE
// ============================================

export interface Database {
    public: {
        Tables: {
            users: {
                Row: User;
                Insert: UserInsert;
                Update: UserUpdate;
            };
            ngos: {
                Row: Ngo;
                Insert: NgoInsert;
                Update: NgoUpdate;
            };
            ngo_members: {
                Row: NgoMember;
                Insert: Omit<NgoMember, 'id' | 'joined_at'>;
                Update: Partial<Omit<NgoMember, 'id' | 'ngo_id' | 'user_id'>>;
            };
            help_requests: {
                Row: HelpRequest;
                Insert: HelpRequestInsert;
                Update: HelpRequestUpdate;
            };
            request_media: {
                Row: RequestMedia;
                Insert: Omit<RequestMedia, 'id' | 'created_at'>;
                Update: Partial<Omit<RequestMedia, 'id' | 'request_id'>>;
            };
            request_comments: {
                Row: RequestComment;
                Insert: Omit<RequestComment, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<RequestComment, 'id' | 'request_id' | 'user_id'>>;
            };
            volunteer_assignments: {
                Row: VolunteerAssignment;
                Insert: VolunteerAssignmentInsert;
                Update: VolunteerAssignmentUpdate;
            };
            events: {
                Row: Event;
                Insert: EventInsert;
                Update: EventUpdate;
            };
            event_registrations: {
                Row: EventRegistration;
                Insert: Omit<EventRegistration, 'id' | 'registered_at' | 'attended_at'>;
                Update: Partial<Omit<EventRegistration, 'id' | 'event_id' | 'user_id'>>;
            };
            posts: {
                Row: Post;
                Insert: PostInsert;
                Update: PostUpdate;
            };
            post_likes: {
                Row: PostLike;
                Insert: Omit<PostLike, 'id' | 'created_at'>;
                Update: never;
            };
            post_comments: {
                Row: PostComment;
                Insert: Omit<PostComment, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<PostComment, 'id' | 'post_id' | 'user_id'>>;
            };
            donations: {
                Row: Donation;
                Insert: DonationInsert;
                Update: DonationUpdate;
            };
            resources: {
                Row: Resource;
                Insert: Omit<Resource, 'id' | 'created_at' | 'updated_at' | 'is_low_stock'>;
                Update: Partial<Omit<Resource, 'id' | 'ngo_id'>>;
            };
            resource_requests: {
                Row: ResourceRequest;
                Insert: Omit<ResourceRequest, 'id' | 'created_at' | 'updated_at' | 'approved_by'>;
                Update: Partial<Omit<ResourceRequest, 'id' | 'resource_id'>>;
            };
            chats: {
                Row: Chat;
                Insert: Omit<Chat, 'id' | 'created_at' | 'updated_at' | 'last_message_at'>;
                Update: Partial<Omit<Chat, 'id'>>;
            };
            chat_participants: {
                Row: ChatParticipant;
                Insert: Omit<ChatParticipant, 'id' | 'joined_at' | 'last_read_at'>;
                Update: Partial<Omit<ChatParticipant, 'id' | 'chat_id' | 'user_id'>>;
            };
            messages: {
                Row: Message;
                Insert: MessageInsert;
                Update: MessageUpdate;
            };
            notifications: {
                Row: Notification;
                Insert: NotificationInsert;
                Update: NotificationUpdate;
            };
            notification_preferences: {
                Row: NotificationPreferences;
                Insert: Omit<NotificationPreferences, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<NotificationPreferences, 'id' | 'user_id'>>;
            };
            follows: {
                Row: Follow;
                Insert: Omit<Follow, 'id' | 'created_at'>;
                Update: never;
            };
            reports: {
                Row: Report;
                Insert: Omit<Report, 'id' | 'created_at' | 'updated_at' | 'resolved_at' | 'resolved_by' | 'assigned_to'>;
                Update: Partial<Omit<Report, 'id' | 'reporter_id'>>;
            };
            audit_logs: {
                Row: AuditLog;
                Insert: Omit<AuditLog, 'id' | 'created_at'>;
                Update: never;
            };
            achievements: {
                Row: Achievement;
                Insert: Omit<Achievement, 'id' | 'earned_at'>;
                Update: never;
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: {
            user_role: UserRole;
            user_status: UserStatus;
            ngo_status: NgoStatus;
            verification_status: VerificationStatus;
            subscription_plan: SubscriptionPlan;
            request_category: RequestCategory;
            request_urgency: RequestUrgency;
            request_status: RequestStatus;
            assignment_status: AssignmentStatus;
            event_type: EventType;
            event_status: EventStatus;
            donation_status: DonationStatus;
            payment_method: PaymentMethod;
            chat_type: ChatType;
            notification_type: NotificationType;
            report_status: ReportStatus;
            report_priority: ReportPriority;
        };
    };
}