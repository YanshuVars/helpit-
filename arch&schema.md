# Helpit NGO Platform – Architecture & Database Schema

## Overview

This document outlines the complete database architecture and schema design for the Helpit NGO Platform. The schema is designed to support NGO coordination, volunteer management, help requests, communication, and social engagement features.

---

## Entity Relationship Diagram Code

```
title NGO Platform Data Model

// define tables
users [icon: user, color: yellow]{
  user_id uuid pk
  full_name string
  email string
  phone string
  password_hash string
  role string
  is_verified boolean
  created_at timestamp
  last_login timestamp
}

ngos [icon: globe, color: green]{
  ngo_id uuid pk
  ngo_name string
  registration_number string
  description string
  address string
  city string
  state string
  latitude decimal
  longitude decimal
  contact_email string
  contact_phone string
  created_by uuid
  created_at timestamp
}

NGO_Members [icon: users, color: orange] {
  id uuid pk
  ngo_id uuid
  user_id uuid
  role enum('ADMIN','COORDINATOR','MEMBER')
  joined_at timestamp
}

Volunteers [icon: user-check, color: lightblue] {
  volunteer_id uuid pk
  user_id uuid
  skills text
  availability boolean
  preferred_radius_km int
  latitude decimal
  longitude decimal
  verified boolean
}

Help_Requests [icon: alert-triangle, color: red] {
  request_id uuid pk
  title string
  description text
  category enum('MEDICAL','FOOD','DISASTER','MISSING_PERSON','ANIMAL','OTHER')
  urgency_level enum('LOW','MEDIUM','HIGH','CRITICAL')
  status enum('OPEN','IN_PROGRESS','RESOLVED','CLOSED')
  created_by uuid
  assigned_ngo uuid
  latitude decimal
  longitude decimal
  created_at timestamp
}

Media [icon: image, color: purple] {
  media_id uuid pk
  request_id uuid
  uploaded_by uuid
  media_url text
  media_type enum('IMAGE','VIDEO')
  latitude decimal
  longitude decimal
  uploaded_at timestamp
}

Chats [icon: message-circle, color: teal] {
  chat_id uuid pk
  chat_type enum('NGO_NGO','VOLUNTEER_NGO')
  created_at timestamp
}

Chat_Participants [icon: users, color: lightgrey] {
  id uuid pk
  chat_id uuid
  user_id uuid
}

Messages [icon: message-square, color: blue] {
  message_id uuid pk
  chat_id uuid
  sender_id uuid
  message text
  sent_at timestamp
}

Notifications [icon: bell, color: orange] {
  notification_id uuid pk
  user_id uuid
  title string
  message text
  type enum('NEARBY_NGO','NEW_REQUEST','STATUS_UPDATE')
  is_read boolean
  created_at timestamp
}

Missing_Persons [icon: user-x, color: pink] {
  person_id uuid pk
  name string
  age int
  gender string
  last_seen_location text
  description text
  created_by uuid
  created_at timestamp
}

Face_Embeddings [icon: cpu, color: purple] {
  embedding_id uuid pk
  person_id uuid
  embedding_vector blob
  source_media uuid
  created_at timestamp
}

Audit_Logs [icon: file-text, color: grey] {
  log_id uuid pk
  user_id uuid
  action text
  entity_type string
  entity_id uuid
  timestamp timestamp
}

NGO_Profiles [icon: user, color: green] {
  profile_id uuid pk
  ngo_id uuid
  username string
  bio text
  profile_image_url text
  cover_image_url text
  website_url text
  is_public boolean
  created_at timestamp
}

NGO_Posts [icon: file-text, color: green] {
  post_id uuid pk
  ngo_id uuid
  post_type enum('IMAGE','VIDEO','TEXT','BLOG')
  caption text
  content text
  visibility enum('PUBLIC','SIGNED_IN_ONLY')
  is_pinned boolean
  created_by uuid
  created_at timestamp
  updated_at timestamp
}

NGO_Post_Media [icon: image, color: green] {
  media_id uuid pk
  post_id uuid
  media_url text
  media_type enum('IMAGE','VIDEO')
  media_order int
  created_at timestamp
}

Post_Likes [icon: heart, color: pink] {
  like_id uuid pk
  post_id uuid
  user_id uuid
  liked_at timestamp
}

Post_Views [icon: eye, color: blue] {
  view_id uuid pk
  post_id uuid
  user_id uuid
  ip_hash text
  viewed_at timestamp
}

Post_Comments [icon: message-square, color: orange] {
  comment_id uuid pk
  post_id uuid
  user_id uuid
  comment text
  created_at timestamp
  is_deleted boolean
}

NGO_Followers [icon: users, color: yellow] {
  id uuid pk
  ngo_id uuid
  user_id uuid
  followed_at timestamp
}

Donations [icon: dollar-sign, color: green] {
  donation_id uuid pk
  donor_id uuid
  ngo_id uuid
  amount decimal
  currency string
  payment_method enum('CARD','UPI','BANK_TRANSFER','CRYPTO','OTHER')
  transaction_id string
  status enum('PENDING','COMPLETED','FAILED','REFUNDED')
  anonymous boolean
  message text
  donated_at timestamp
}

Events [icon: calendar, color: blue] {
  event_id uuid pk
  ngo_id uuid
  title string
  description text
  event_type enum('FUNDRAISER','VOLUNTEER_DRIVE','AWARENESS','COMMUNITY','OTHER')
  start_time timestamp
  end_time timestamp
  location text
  latitude decimal
  longitude decimal
  max_attendees int
  status enum('UPCOMING','ONGOING','COMPLETED','CANCELLED')
  created_at timestamp
}

Event_Registrations [icon: check-circle, color: lightblue] {
  registration_id uuid pk
  event_id uuid
  user_id uuid
  status enum('REGISTERED','ATTENDED','CANCELLED','NO_SHOW')
  registered_at timestamp
}

Resources [icon: package, color: brown] {
  resource_id uuid pk
  ngo_id uuid
  resource_type enum('FOOD','MEDICAL','CLOTHING','EQUIPMENT','FUNDS','OTHER')
  name string
  quantity int
  unit string
  status enum('AVAILABLE','LOW','OUT_OF_STOCK')
  updated_at timestamp
}

Resource_Requests [icon: git-pull-request, color: orange] {
  resource_request_id uuid pk
  requesting_ngo uuid
  providing_ngo uuid
  resource_id uuid
  quantity_requested int
  status enum('PENDING','APPROVED','REJECTED','FULFILLED')
  created_at timestamp
}

Volunteer_Assignments [icon: user-plus, color: cyan] {
  assignment_id uuid pk
  volunteer_id uuid
  request_id uuid
  ngo_id uuid
  status enum('ASSIGNED','ACCEPTED','IN_PROGRESS','COMPLETED','CANCELLED')
  assigned_at timestamp
  completed_at timestamp
}

Achievements [icon: award, color: gold] {
  achievement_id uuid pk
  user_id uuid
  achievement_type enum('VOLUNTEER_HOURS','DONATIONS','EVENTS_ATTENDED','REQUESTS_RESOLVED','OTHER')
  description text
  earned_at timestamp
}

Reports [icon: flag, color: red] {
  report_id uuid pk
  reported_by uuid
  entity_type enum('USER','NGO','POST','COMMENT','REQUEST')
  entity_id uuid
  reason text
  status enum('PENDING','REVIEWED','RESOLVED','DISMISSED')
  created_at timestamp
}

// define relationships
ngos.created_by > users.user_id
NGO_Members.ngo_id > ngos.ngo_id
NGO_Members.user_id > users.user_id
Volunteers.user_id > users.user_id
Help_Requests.created_by > users.user_id
Help_Requests.assigned_ngo > ngos.ngo_id
Media.request_id > Help_Requests.request_id
Media.uploaded_by > users.user_id
Chat_Participants.chat_id > Chats.chat_id
Chat_Participants.user_id > users.user_id
Messages.chat_id > Chats.chat_id
Messages.sender_id > users.user_id
Notifications.user_id > users.user_id
Missing_Persons.created_by > ngos.ngo_id
Face_Embeddings.person_id > Missing_Persons.person_id
Face_Embeddings.source_media > Media.media_id
Audit_Logs.user_id > users.user_id
NGO_Profiles.ngo_id > ngos.ngo_id
NGO_Posts.ngo_id > ngos.ngo_id
NGO_Posts.created_by > users.user_id
NGO_Post_Media.post_id > NGO_Posts.post_id
Post_Likes.post_id > NGO_Posts.post_id
Post_Likes.user_id > users.user_id
Post_Views.post_id > NGO_Posts.post_id
Post_Views.user_id > users.user_id
Post_Comments.post_id > NGO_Posts.post_id
Post_Comments.user_id > users.user_id
NGO_Followers.ngo_id > ngos.ngo_id
NGO_Followers.user_id > users.user_id
Donations.donor_id > users.user_id
Donations.ngo_id > ngos.ngo_id
Events.ngo_id > ngos.ngo_id
Event_Registrations.event_id > Events.event_id
Event_Registrations.user_id > users.user_id
Resources.ngo_id > ngos.ngo_id
Resource_Requests.requesting_ngo > ngos.ngo_id
Resource_Requests.providing_ngo > ngos.ngo_id
Resource_Requests.resource_id > Resources.resource_id
Volunteer_Assignments.volunteer_id > Volunteers.volunteer_id
Volunteer_Assignments.request_id > Help_Requests.request_id
Volunteer_Assignments.ngo_id > ngos.ngo_id
Achievements.user_id > users.user_id
Reports.reported_by > users.user_id
```

---

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                  │
│                     Flutter (FlutterFlow → Pure Flutter)                    │
│         ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│         │   NGO App    │  │ Volunteer App│  │  Donor App   │               │
│         └──────────────┘  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND LAYER                                   │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐        │
│  │         SUPABASE            │    │          FIREBASE           │        │
│  │  • PostgreSQL Database      │    │  • Authentication           │        │
│  │  • REST/GraphQL APIs        │    │  • Push Notifications       │        │
│  │  • Row Level Security       │    │  • Real-time Sync           │        │
│  │  • PostGIS (Geospatial)     │    │  • Cloud Functions          │        │
│  └─────────────────────────────┘    └─────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ISOLATED AI SERVICE                                  │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │              Facial Recognition Microservice (Python)            │       │
│  │  • FaceNet/ArcFace Embeddings                                    │       │
│  │  • OpenCV Preprocessing                                          │       │
│  │  • Vector Similarity Search                                      │       │
│  │  • Consent & Audit Logging                                       │       │
│  └─────────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema Documentation

### Domain 1: User Management

#### `users`
Central identity table for all platform users.

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | UUID | Primary key |
| `full_name` | STRING | User's full name |
| `email` | STRING | Email address (unique) |
| `phone` | STRING | Phone number |
| `password_hash` | STRING | Hashed password |
| `role` | STRING | User role (NGO_ADMIN, VOLUNTEER, DONOR, etc.) |
| `is_verified` | BOOLEAN | Email/phone verification status |
| `created_at` | TIMESTAMP | Account creation time |
| `last_login` | TIMESTAMP | Last login timestamp |

---

### Domain 2: NGO Management

#### `ngos`
Registered non-governmental organizations.

| Column | Type | Description |
|--------|------|-------------|
| `ngo_id` | UUID | Primary key |
| `ngo_name` | STRING | Organization name |
| `registration_number` | STRING | Official registration ID |
| `description` | STRING | Organization description |
| `address` | STRING | Physical address |
| `city` | STRING | City |
| `state` | STRING | State/Province |
| `latitude` | DECIMAL | Geographic latitude |
| `longitude` | DECIMAL | Geographic longitude |
| `contact_email` | STRING | Contact email |
| `contact_phone` | STRING | Contact phone |
| `created_by` | UUID | FK → users.user_id |
| `created_at` | TIMESTAMP | Registration timestamp |

#### `NGO_Members`
Maps users to NGO roles.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `ngo_id` | UUID | FK → ngos.ngo_id |
| `user_id` | UUID | FK → users.user_id |
| `role` | ENUM | ADMIN, COORDINATOR, MEMBER |
| `joined_at` | TIMESTAMP | Membership start date |

#### `NGO_Profiles`
Extended public profile for NGOs.

| Column | Type | Description |
|--------|------|-------------|
| `profile_id` | UUID | Primary key |
| `ngo_id` | UUID | FK → ngos.ngo_id |
| `username` | STRING | Unique public handle |
| `bio` | TEXT | Organization bio |
| `profile_image_url` | TEXT | Profile picture URL |
| `cover_image_url` | TEXT | Cover image URL |
| `website_url` | TEXT | Official website |
| `is_public` | BOOLEAN | Public visibility flag |
| `created_at` | TIMESTAMP | Profile creation time |

---

### Domain 3: Volunteer Management

#### `Volunteers`
Registered volunteers with skills and location.

| Column | Type | Description |
|--------|------|-------------|
| `volunteer_id` | UUID | Primary key |
| `user_id` | UUID | FK → users.user_id |
| `skills` | TEXT | Comma-separated skills |
| `availability` | BOOLEAN | Currently available |
| `preferred_radius_km` | INT | Max travel distance |
| `latitude` | DECIMAL | Current/home latitude |
| `longitude` | DECIMAL | Current/home longitude |
| `verified` | BOOLEAN | Verification status |

---

### Domain 4: Help Requests & Media

#### `Help_Requests`
Requests for assistance created by users or NGOs.

| Column | Type | Description |
|--------|------|-------------|
| `request_id` | UUID | Primary key |
| `title` | STRING | Request title |
| `description` | TEXT | Detailed description |
| `category` | ENUM | MEDICAL, FOOD, DISASTER, MISSING_PERSON, ANIMAL, OTHER |
| `urgency_level` | ENUM | LOW, MEDIUM, HIGH, CRITICAL |
| `status` | ENUM | OPEN, IN_PROGRESS, RESOLVED, CLOSED |
| `created_by` | UUID | FK → users.user_id |
| `assigned_ngo` | UUID | FK → ngos.ngo_id |
| `latitude` | DECIMAL | Location latitude |
| `longitude` | DECIMAL | Location longitude |
| `created_at` | TIMESTAMP | Creation timestamp |

#### `Media`
Geo-tagged media evidence attached to requests.

| Column | Type | Description |
|--------|------|-------------|
| `media_id` | UUID | Primary key |
| `request_id` | UUID | FK → Help_Requests.request_id |
| `uploaded_by` | UUID | FK → users.user_id |
| `media_url` | TEXT | Storage URL |
| `media_type` | ENUM | IMAGE, VIDEO |
| `latitude` | DECIMAL | Capture location latitude |
| `longitude` | DECIMAL | Capture location longitude |
| `uploaded_at` | TIMESTAMP | Upload timestamp |

---

### Domain 5: Communication

#### `Chats`
Chat room instances.

| Column | Type | Description |
|--------|------|-------------|
| `chat_id` | UUID | Primary key |
| `chat_type` | ENUM | NGO_NGO, VOLUNTEER_NGO |
| `created_at` | TIMESTAMP | Chat creation time |

#### `Chat_Participants`
Users participating in each chat.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `chat_id` | UUID | FK → Chats.chat_id |
| `user_id` | UUID | FK → users.user_id |

#### `Messages`
Individual messages within chats.

| Column | Type | Description |
|--------|------|-------------|
| `message_id` | UUID | Primary key |
| `chat_id` | UUID | FK → Chats.chat_id |
| `sender_id` | UUID | FK → users.user_id |
| `message` | TEXT | Message content |
| `sent_at` | TIMESTAMP | Send timestamp |

#### `Notifications`
System notifications for users.

| Column | Type | Description |
|--------|------|-------------|
| `notification_id` | UUID | Primary key |
| `user_id` | UUID | FK → users.user_id |
| `title` | STRING | Notification title |
| `message` | TEXT | Notification body |
| `type` | ENUM | NEARBY_NGO, NEW_REQUEST, STATUS_UPDATE |
| `is_read` | BOOLEAN | Read status |
| `created_at` | TIMESTAMP | Creation timestamp |

---

### Domain 6: Missing Persons & Facial Recognition

#### `Missing_Persons`
Missing person reports.

| Column | Type | Description |
|--------|------|-------------|
| `person_id` | UUID | Primary key |
| `name` | STRING | Person's name |
| `age` | INT | Age at time of report |
| `gender` | STRING | Gender |
| `last_seen_location` | TEXT | Last known location |
| `description` | TEXT | Physical description |
| `created_by` | UUID | FK → ngos.ngo_id |
| `created_at` | TIMESTAMP | Report timestamp |

#### `Face_Embeddings`
Facial recognition embeddings (isolated service).

| Column | Type | Description |
|--------|------|-------------|
| `embedding_id` | UUID | Primary key |
| `person_id` | UUID | FK → Missing_Persons.person_id |
| `embedding_vector` | BLOB | 128/512-dimensional embedding |
| `source_media` | UUID | FK → Media.media_id |
| `created_at` | TIMESTAMP | Embedding generation time |

> ⚠️ **Privacy Note:** Face embeddings are stored in an isolated service with explicit consent workflows, role-restricted access, and comprehensive audit logging.

---

### Domain 7: Social Engagement (NGO Posts)

#### `NGO_Posts`
Content posts by NGOs.

| Column | Type | Description |
|--------|------|-------------|
| `post_id` | UUID | Primary key |
| `ngo_id` | UUID | FK → ngos.ngo_id |
| `post_type` | ENUM | IMAGE, VIDEO, TEXT, BLOG |
| `caption` | TEXT | Short caption |
| `content` | TEXT | Full content (for blogs) |
| `visibility` | ENUM | PUBLIC, SIGNED_IN_ONLY |
| `is_pinned` | BOOLEAN | Pinned to top of profile |
| `created_by` | UUID | FK → users.user_id |
| `created_at` | TIMESTAMP | Post creation time |
| `updated_at` | TIMESTAMP | Last update time |

#### `NGO_Post_Media`
Media attachments for posts.

| Column | Type | Description |
|--------|------|-------------|
| `media_id` | UUID | Primary key |
| `post_id` | UUID | FK → NGO_Posts.post_id |
| `media_url` | TEXT | Storage URL |
| `media_type` | ENUM | IMAGE, VIDEO |
| `media_order` | INT | Display order |
| `created_at` | TIMESTAMP | Upload timestamp |

#### `Post_Likes`
User likes on posts.

| Column | Type | Description |
|--------|------|-------------|
| `like_id` | UUID | Primary key |
| `post_id` | UUID | FK → NGO_Posts.post_id |
| `user_id` | UUID | FK → users.user_id |
| `liked_at` | TIMESTAMP | Like timestamp |

#### `Post_Views`
Post view tracking.

| Column | Type | Description |
|--------|------|-------------|
| `view_id` | UUID | Primary key |
| `post_id` | UUID | FK → NGO_Posts.post_id |
| `user_id` | UUID | FK → users.user_id (nullable for guests) |
| `ip_hash` | TEXT | Hashed IP for anonymous tracking |
| `viewed_at` | TIMESTAMP | View timestamp |

#### `Post_Comments`
Comments on posts.

| Column | Type | Description |
|--------|------|-------------|
| `comment_id` | UUID | Primary key |
| `post_id` | UUID | FK → NGO_Posts.post_id |
| `user_id` | UUID | FK → users.user_id |
| `comment` | TEXT | Comment content |
| `created_at` | TIMESTAMP | Comment timestamp |
| `is_deleted` | BOOLEAN | Soft delete flag |

#### `NGO_Followers`
Users following NGOs.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `ngo_id` | UUID | FK → ngos.ngo_id |
| `user_id` | UUID | FK → users.user_id |
| `followed_at` | TIMESTAMP | Follow timestamp |

---

### Domain 8: Audit & Compliance

#### `Audit_Logs`
Comprehensive action logging for compliance.

| Column | Type | Description |
|--------|------|-------------|
| `log_id` | UUID | Primary key |
| `user_id` | UUID | FK → users.user_id |
| `action` | TEXT | Action performed |
| `entity_type` | STRING | Table/entity affected |
| `entity_id` | UUID | ID of affected record |
| `timestamp` | TIMESTAMP | Action timestamp |

---

### Domain 9: Donations & Fundraising

#### `Donations`
Financial contributions from donors to NGOs.

| Column | Type | Description |
|--------|------|-------------|
| `donation_id` | UUID | Primary key |
| `donor_id` | UUID | FK → users.user_id |
| `ngo_id` | UUID | FK → ngos.ngo_id |
| `amount` | DECIMAL | Donation amount |
| `currency` | STRING | Currency code (INR, USD, etc.) |
| `payment_method` | ENUM | CARD, UPI, BANK_TRANSFER, CRYPTO, OTHER |
| `transaction_id` | STRING | Payment gateway transaction ID |
| `status` | ENUM | PENDING, COMPLETED, FAILED, REFUNDED |
| `anonymous` | BOOLEAN | Hide donor identity in public view |
| `message` | TEXT | Optional message from donor |
| `donated_at` | TIMESTAMP | Donation timestamp |

---

### Domain 10: Events & Registrations

#### `Events`
Events organized by NGOs (fundraisers, volunteer drives, awareness campaigns).

| Column | Type | Description |
|--------|------|-------------|
| `event_id` | UUID | Primary key |
| `ngo_id` | UUID | FK → ngos.ngo_id |
| `title` | STRING | Event title |
| `description` | TEXT | Event description |
| `event_type` | ENUM | FUNDRAISER, VOLUNTEER_DRIVE, AWARENESS, COMMUNITY, OTHER |
| `start_time` | TIMESTAMP | Event start date/time |
| `end_time` | TIMESTAMP | Event end date/time |
| `location` | TEXT | Event venue/address |
| `latitude` | DECIMAL | Venue latitude |
| `longitude` | DECIMAL | Venue longitude |
| `max_attendees` | INT | Maximum capacity |
| `status` | ENUM | UPCOMING, ONGOING, COMPLETED, CANCELLED |
| `created_at` | TIMESTAMP | Event creation time |

#### `Event_Registrations`
User registrations for events.

| Column | Type | Description |
|--------|------|-------------|
| `registration_id` | UUID | Primary key |
| `event_id` | UUID | FK → Events.event_id |
| `user_id` | UUID | FK → users.user_id |
| `status` | ENUM | REGISTERED, ATTENDED, CANCELLED, NO_SHOW |
| `registered_at` | TIMESTAMP | Registration timestamp |

---

### Domain 11: Resource Management

#### `Resources`
Inventory of resources held by NGOs.

| Column | Type | Description |
|--------|------|-------------|
| `resource_id` | UUID | Primary key |
| `ngo_id` | UUID | FK → ngos.ngo_id |
| `resource_type` | ENUM | FOOD, MEDICAL, CLOTHING, EQUIPMENT, FUNDS, OTHER |
| `name` | STRING | Resource name |
| `quantity` | INT | Available quantity |
| `unit` | STRING | Unit of measurement |
| `status` | ENUM | AVAILABLE, LOW, OUT_OF_STOCK |
| `updated_at` | TIMESTAMP | Last update timestamp |

#### `Resource_Requests`
Requests for resources between NGOs.

| Column | Type | Description |
|--------|------|-------------|
| `resource_request_id` | UUID | Primary key |
| `requesting_ngo` | UUID | FK → ngos.ngo_id (requester) |
| `providing_ngo` | UUID | FK → ngos.ngo_id (provider) |
| `resource_id` | UUID | FK → Resources.resource_id |
| `quantity_requested` | INT | Quantity needed |
| `status` | ENUM | PENDING, APPROVED, REJECTED, FULFILLED |
| `created_at` | TIMESTAMP | Request timestamp |

---

### Domain 12: Volunteer Operations

#### `Volunteer_Assignments`
Tracks volunteer assignments to help requests.

| Column | Type | Description |
|--------|------|-------------|
| `assignment_id` | UUID | Primary key |
| `volunteer_id` | UUID | FK → Volunteers.volunteer_id |
| `request_id` | UUID | FK → Help_Requests.request_id |
| `ngo_id` | UUID | FK → ngos.ngo_id |
| `status` | ENUM | ASSIGNED, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED |
| `assigned_at` | TIMESTAMP | Assignment timestamp |
| `completed_at` | TIMESTAMP | Completion timestamp |

---

### Domain 13: Gamification & Achievements

#### `Achievements`
User achievements and badges for engagement.

| Column | Type | Description |
|--------|------|-------------|
| `achievement_id` | UUID | Primary key |
| `user_id` | UUID | FK → users.user_id |
| `achievement_type` | ENUM | VOLUNTEER_HOURS, DONATIONS, EVENTS_ATTENDED, REQUESTS_RESOLVED, OTHER |
| `description` | TEXT | Achievement description |
| `earned_at` | TIMESTAMP | Achievement earned timestamp |

---

### Domain 14: Moderation & Reports

#### `Reports`
Content/user reports for moderation.

| Column | Type | Description |
|--------|------|-------------|
| `report_id` | UUID | Primary key |
| `reported_by` | UUID | FK → users.user_id |
| `entity_type` | ENUM | USER, NGO, POST, COMMENT, REQUEST |
| `entity_id` | UUID | ID of reported entity |
| `reason` | TEXT | Report reason/description |
| `status` | ENUM | PENDING, REVIEWED, RESOLVED, DISMISSED |
| `created_at` | TIMESTAMP | Report timestamp |

---

## Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CORE RELATIONSHIPS                                 │
└─────────────────────────────────────────────────────────────────────────────┘

users ─────────────────┬──────────────────┬─────────────────┬────────────────┐
   │                   │                  │                 │                │
   ▼                   ▼                  ▼                 ▼                ▼
Volunteers       NGO_Members        Help_Requests     Audit_Logs      Notifications
   │                   │                  │                                   │
   │                   │                  │                                   │
   ▼                   ▼                  ▼                                   │
Volunteer_        ngos ◄──────── assigned_ngo                                │
Assignments        │                                                         │
                   │                                                         │
      ┌────────────┼────────────┬────────────────┬────────────┬─────────────┐
      ▼            ▼            ▼                ▼            ▼             │
NGO_Profiles   NGO_Posts   Missing_Persons  NGO_Followers  Events        │
      │            │            │                            │             │
      │            ▼            ▼                            ▼             │
      │      NGO_Post_Media  Face_Embeddings          Event_Registrations │
      │            │                                                       │
      │     ┌──────┴──────┬─────────────┐                                  │
      │     ▼             ▼             ▼                                  │
      │  Post_Likes  Post_Views  Post_Comments                             │
      │                                                                    │
      └────────────────────────────────────────────────────────────────────┤
                                                                           │
Help_Requests ───────► Media ◄─────── Face_Embeddings                     │
                                                                           │
Chats ──────┬─────────► Messages                                          │
            │                                                              │
            ▼                                                              │
    Chat_Participants ◄──────────────────────────────────────── users ◄───┘
            
ngos ───────► Donations ◄─────── users (donor_id)
  │
  ├──────► Resources ◄─────── Resource_Requests
  │
  └──────► Events ◄─────── Event_Registrations ◄─────── users

users ───────► Achievements
  │
  └──────► Reports (reported_by)
```

---

## Access Control Matrix

| Entity | NGO Admin | NGO Coordinator | Volunteer | Public User | Donor |
|--------|-----------|-----------------|-----------|-------------|-------|
| Users (own) | Full | Full | Full | None | Full |
| NGO Profile | Full | Read/Update | Read | Read (if public) | Read |
| NGO Posts | Full | Create/Update | Read | Read (if public) | Read |
| Help Requests | Full | Full | Create/Read | Read | Read |
| Volunteers | Read | Read | Own only | None | None |
| Chats | Participate | Participate | Participate | None | None |
| Missing Persons | Full | Full | Read | Read | Read |
| Face Embeddings | Request | None | None | None | None |
| Audit Logs | Read (own org) | None | None | None | None |
| Donations | Full (org) | Read (org) | None | None | Own only |
| Events | Full | Create/Update | Read | Read (if public) | Read |
| Event Registrations | Read (org) | Read (org) | Own only | None | Own only |
| Resources | Full | Full | Read | None | None |
| Resource Requests | Full | Create/Update | None | None | None |
| Volunteer Assignments | Full | Full | Own only | None | None |
| Achievements | Read | Read | Own only | None | Own only |
| Reports | Moderate | Create | Create | Create | Create |

---

## Security Considerations

1. **Data Encryption:** All sensitive data encrypted at rest and in transit
2. **Row Level Security:** PostgreSQL RLS policies enforce access control
3. **API Authentication:** JWT tokens with short expiry and refresh tokens
4. **Audit Trail:** All sensitive operations logged in Audit_Logs
5. **Facial Recognition Isolation:** Separate microservice with consent workflows
6. **Minimal Data Retention:** Regular purging of unnecessary data
7. **GDPR/Privacy Compliance:** User data export and deletion capabilities

---

## Scalability Notes

- PostgreSQL with PostGIS enables efficient geospatial queries for volunteer/NGO matching
- Supabase real-time subscriptions for live chat and notifications
- Firebase Cloud Messaging for push notifications
- Schema designed for horizontal scaling with proper indexing on location columns
- Migration path to AWS/Azure/Government cloud when institutional adoption requires it