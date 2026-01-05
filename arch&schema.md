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

## Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CORE RELATIONSHIPS                                 │
└─────────────────────────────────────────────────────────────────────────────┘

users ─────────────────┬──────────────────┬─────────────────┬────────────────┐
   │                   │                  │                 │                │
   ▼                   ▼                  ▼                 ▼                ▼
Volunteers       NGO_Members        Help_Requests     Audit_Logs      Notifications
                       │                  │
                       ▼                  ▼
                     ngos ◄──────── assigned_ngo
                       │
          ┌────────────┼────────────┬────────────────┐
          ▼            ▼            ▼                ▼
    NGO_Profiles   NGO_Posts   Missing_Persons   NGO_Followers
          │            │            │
          │            ▼            ▼
          │      NGO_Post_Media  Face_Embeddings
          │            │
          │     ┌──────┴──────┬─────────────┐
          │     ▼             ▼             ▼
          │  Post_Likes  Post_Views  Post_Comments
          │
          └───────────────────────────────────────────────────────────────────┐
                                                                              │
Help_Requests ───────► Media ◄─────── Face_Embeddings                        │
                                                                              │
Chats ──────┬─────────► Messages                                             │
            │                                                                 │
            ▼                                                                 │
    Chat_Participants ◄─────────────────────────────────────────── users ◄───┘
```

---

## Access Control Matrix

| Entity | NGO Admin | NGO Coordinator | Volunteer | Public User |
|--------|-----------|-----------------|-----------|-------------|
| Users (own) | Full | Full | Full | None |
| NGO Profile | Full | Read/Update | Read | Read (if public) |
| NGO Posts | Full | Create/Update | Read | Read (if public) |
| Help Requests | Full | Full | Create/Read | Read |
| Volunteers | Read | Read | Own only | None |
| Chats | Participate | Participate | Participate | None |
| Missing Persons | Full | Full | Read | Read |
| Face Embeddings | Request | None | None | None |
| Audit Logs | Read (own org) | None | None | None |

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