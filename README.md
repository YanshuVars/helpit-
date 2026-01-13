# Helpit NGO Platform
## Product Requirements Document (PRD) v3.0

**Version:** 3.0  
**Last Updated:** January 6, 2026  
**Document Type:** Technical Specification  
**Status:** Ready for Development

---

# Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [Design Philosophy](#3-design-philosophy)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [Application Architecture](#5-application-architecture)
6. [Global Application Shell](#6-global-application-shell)
7. [Route Architecture](#7-route-architecture)
8. [Feature Specifications](#8-feature-specifications)
9. [Database Schema](#9-database-schema)
10. [API Specifications](#10-api-specifications)
11. [UI Component Library](#11-ui-component-library)
12. [Technical Stack](#12-technical-stack)
13. [Development Phases](#13-development-phases)
14. [Security Requirements](#14-security-requirements)
15. [Performance Requirements](#15-performance-requirements)
16. [Testing Strategy](#16-testing-strategy)
17. [Deployment Strategy](#17-deployment-strategy)
18. [Monitoring & Analytics](#18-monitoring--analytics)
19. [Success Metrics](#19-success-metrics)

---

# 1. Executive Summary

## 1.1 Product Definition

Helpit is a dashboard-first web and mobile application designed to coordinate NGO operations, volunteer management, and transparent donations. The platform serves as a unified ecosystem connecting organizations doing social work with individuals who want to contribute through time, skills, or financial support.

## 1.2 Problem Statement

| Problem | Current State | Impact |
|---------|---------------|--------|
| Fragmented NGO Operations | NGOs operate in silos with no coordination | Duplicated efforts, resource waste |
| Volunteer Discovery | No centralized platform to find opportunities | Willing volunteers cannot find work |
| Response Delays | Manual coordination via calls/WhatsApp | Slower emergency response |
| Donor Distrust | No visibility into fund utilization | Reduced charitable giving |
| Missing Person Coordination | Unorganized search efforts | Delayed reunification |
| Evidence Collection | Ad-hoc photo sharing, no geo-tagging | Poor documentation |

## 1.3 Solution Overview

A connected application platform providing:

- **For NGOs:** Dashboard to manage requests, coordinate volunteers, track donations, and publish updates
- **For Volunteers:** Interface to discover opportunities, manage assignments, and track impact
- **For Donors:** Portal to discover NGOs, donate securely, and track fund utilization
- **For Public:** Access to report emergencies, view NGO profiles, and find missing persons

## 1.4 Business Model

| Revenue Stream | Description | Pricing |
|----------------|-------------|---------|
| NGO Subscription | Monthly platform access | ₹1,000/month |
| CSR Partnerships | Corporate sponsorship | Custom pricing |
| Government Grants | Institutional funding | Grant-based |

**Critical Principle:** Zero commission on donations. 100% of donated funds reach NGOs.

## 1.5 Target Market

| Segment | Size (India) | Realistic Adoption |
|---------|--------------|-------------------|
| Registered NGOs | ~3.1 million | - |
| Active NGOs | 2.0-2.7 lakh | - |
| NGOs with digital capacity | 12,000-25,000 | - |
| **Target paying NGOs** | **2,500-7,500** | Year 2 |

---

# 2. Product Overview

## 2.1 Vision Statement

Create a connected and accountable social impact ecosystem where intent, action, and funding are aligned through technology.

## 2.2 Mission Statement

- Enable faster and more organized NGO coordination
- Support efficient volunteer mobilization based on location and urgency
- Provide donors with clear visibility into resource utilization
- Use technology to improve reliability and accountability in social interventions

## 2.3 Core Value Propositions

### For NGOs
1. Centralized volunteer coordination without WhatsApp chaos
2. Public profile that builds donor trust
3. Media and reporting without extra staff
4. Visibility comparable to larger NGOs
5. Better chances of CSR discovery

### For Volunteers
1. Discover meaningful opportunities nearby
2. Track personal impact and contributions
3. Build verifiable volunteer portfolio
4. Connect with multiple NGOs through one platform
5. Earn recognition through achievements

### For Donors
1. Verified NGOs with transparent operations
2. Track exactly where funds are used
3. Tax receipts and documentation
4. Follow NGOs and see updates
5. No platform fees on donations

## 2.4 Key Differentiators

| Feature | Helpit | Competitors |
|---------|--------|-------------|
| Zero donation commission | ✅ | ❌ (5-15% typical) |
| Geo-tagged evidence | ✅ | Limited |
| Real-time volunteer matching | ✅ | ❌ |
| NGO-to-NGO coordination | ✅ | ❌ |
| Missing person module | ✅ | ❌ |
| Unified dashboard | ✅ | Fragmented |

---

# 3. Design Philosophy

## 3.1 Application-First Approach

This is a DASHBOARD-FIRST APPLICATION, not a marketing website.

**WRONG:**
- Long scrolling pages
- Marketing-first design
- Disconnected routes
- Dead-end pages

**CORRECT:**
- Persistent navigation shell
- Dashboard-centric experience
- Connected user flows
- Every page leads somewhere

## 3.2 Navigation Principles

| Principle | Description | Implementation |
|-----------|-------------|----------------|
| Persistent Shell | Navigation always visible | Sidebar + Header on all dashboard pages |
| Role-Based Navigation | Different nav for different users | Dynamic sidebar based on user role |
| No Dead Ends | Every page connects to others | Forward/back navigation always available |
| Contextual Actions | Actions relevant to current view | Page-specific action buttons |
| Progressive Disclosure | Details on drill-down | List → Detail → Edit pattern |
| State Persistence | Filters/position preserved | URL state + local storage |

## 3.3 Page Types

| Type | Auth Required | Shell | Example |
|------|---------------|-------|---------|
| Public | No | Minimal header | Landing, Public NGO Profile |
| Auth | No | Centered card | Login, Register |
| Dashboard | Yes | Full shell | All logged-in views |
| Modal | Yes | Overlay | Create Request, Edit Profile |
| Detail | Yes | Full shell | Request Detail, Event Detail |

## 3.4 Responsive Breakpoints

| Breakpoint | Width | Sidebar Behavior | Layout |
|------------|-------|------------------|--------|
| Mobile | < 768px | Hidden (hamburger menu) | Single column |
| Tablet | 768px - 1023px | Collapsed (icons only) | Adaptive |
| Desktop | ≥ 1024px | Expanded (full) | Multi-column |
| Large Desktop | ≥ 1440px | Expanded | Multi-column with extra space |

---

# 4. User Roles & Permissions

## 4.1 Role Hierarchy

```
PLATFORM LEVEL
└── Platform Admin (Helpit Staff)
     └── Full system access

ORGANIZATION LEVEL
└── NGO Admin
     └── NGO Coordinator
          └── NGO Member

INDIVIDUAL LEVEL
├── Volunteer
├── Donor
└── Individual (basic user)

PUBLIC LEVEL
└── Anonymous (not logged in)
```

## 4.2 Role Definitions

### Platform Admin
- **Description:** Helpit operations team member
- **Capabilities:** Manage all users/NGOs, verify NGOs, review reports, access audit logs, configure platform

### NGO Admin
- **Description:** Organization administrator (typically founder/director)
- **Capabilities:** All Coordinator capabilities + manage profile, add/remove members, change roles, delete organization, access donation analytics

### NGO Coordinator
- **Description:** Operations manager within NGO
- **Capabilities:** All Member capabilities + create/edit/delete requests, assign volunteers, create events/posts, manage resources

### NGO Member
- **Description:** Basic NGO team member
- **Capabilities:** View dashboard, view requests/volunteers, comment on requests, participate in chats

### Volunteer
- **Description:** Individual offering time/skills
- **Capabilities:** Browse opportunities, manage assignments, update status, track statistics, chat with assigned NGOs

### Donor
- **Description:** Individual making financial contributions
- **Capabilities:** Browse NGOs, make donations, view history, download receipts, follow NGOs

### Individual
- **Description:** Basic registered user
- **Capabilities:** View public content, report emergencies, upgrade to Volunteer or Donor

### Anonymous
- **Description:** Non-logged-in visitor
- **Capabilities:** View landing page, browse public NGOs, view missing persons reports

## 4.3 Permission Matrix

| Resource | Anonymous | Individual | Donor | Volunteer | NGO Member | NGO Coord | NGO Admin | Platform Admin |
|----------|-----------|------------|-------|-----------|------------|-----------|-----------|----------------|
| View public NGO | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View NGO dashboard | - | - | - | - | ✅ | ✅ | ✅ | ✅ |
| Edit NGO profile | - | - | - | - | - | - | ✅ | ✅ |
| Create help request | - | ✅ | ✅ | ✅ | - | ✅ | ✅ | ✅ |
| Assign volunteers | - | - | - | - | - | ✅ | ✅ | ✅ |
| Make donation | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - |
| View donation analytics | - | - | - | - | Summary | Summary | ✅ | ✅ |
| Access admin panel | - | - | - | - | - | - | - | ✅ |

---

# 5. Application Architecture

## 5.1 High-Level Architecture

```
CLIENT LAYER
├── Next.js Web Application
├── React Native Mobile App
└── Public API Consumers

API LAYER
├── Supabase (Auth, REST, Realtime, Storage)
└── External Services (Firebase FCM, Razorpay, Mapbox, Resend)

DATA LAYER
└── PostgreSQL (Supabase) with PostGIS, RLS Policies

ISOLATED SERVICES
└── Face Recognition Microservice (Python, FaceNet/ArcFace)
```

## 5.2 Frontend Architecture

```
NEXT.JS APPLICATION
├── APP ROUTER
│   ├── (public) Layout - Landing, About, Contact
│   ├── (auth) Layout - Login, Register, Reset
│   └── (dashboard) Layout - Shell, Sidebar, Header
│
├── STATE MANAGEMENT
│   ├── TanStack Query - Server state, caching
│   ├── Zustand - UI state, sidebar, modals
│   └── URL State - Filters, tabs, pagination
│
└── COMPONENT LAYERS
    ├── UI Layer - shadcn/ui, primitives, forms
    ├── Feature Layer - Auth, Requests, Volunteers
    └── Layout Layer - AppShell, Sidebar, TopBar
```

## 5.3 Data Flow

```
USER ACTION
    │
    ▼
Component triggers Mutation/Query
    │
    ├── Optimistic Update (immediate UI change)
    │
    ▼
API Call → Supabase → PostgreSQL
    │
    ▼
Response → Cache Update → UI Re-render

REAL-TIME (Supabase Realtime)
Subscribe to Channel → Broadcast Change → Update Cache
```

---

# 6. Global Application Shell

## 6.1 Shell Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              TOP BAR (64px)                                  │
│  Logo | Search Bar (⌘K) | Notifications 🔔 | User Avatar ▼                  │
├──────────────┬──────────────────────────────────────────────────────────────┤
│              │                                                               │
│   SIDEBAR    │                    MAIN CONTENT                              │
│   (256px)    │                                                               │
│              │  Page content rendered here                                  │
│  Avatar/Logo │                                                               │
│  Name        │                                                               │
│  Role        │                                                               │
│              │                                                               │
│  Navigation  │                                                               │
│  Items       │                                                               │
│              │                                                               │
│  Settings    │                                                               │
│  Help        │                                                               │
└──────────────┴──────────────────────────────────────────────────────────────┘
```

## 6.2 Top Bar Components

| Element | Position | Behavior |
|---------|----------|----------|
| Menu Toggle | Left | Mobile only, opens sidebar sheet |
| Logo | Left | Links to role-based dashboard home |
| Search Bar | Center | Opens Command Palette (⌘K / Ctrl+K) |
| Notifications | Right | Badge with count, dropdown on click |
| User Avatar | Right | Dropdown menu (Profile, Settings, Logout) |

## 6.3 Sidebar Navigation by Role

### NGO Admin / Coordinator

| Icon | Label | Route | Badge |
|------|-------|-------|-------|
| LayoutDashboard | Dashboard | /ngo | - |
| AlertTriangle | Help Requests | /ngo/requests | Active count |
| Users | Volunteers | /ngo/volunteers | - |
| FileText | Posts | /ngo/posts | - |
| Calendar | Events | /ngo/events | - |
| DollarSign | Donations | /ngo/donations | - |
| Package | Resources | /ngo/resources | - |
| MessageCircle | Messages | /messages | Unread count |
| Building | Organization | /ngo/settings | - |

### Volunteer

| Icon | Label | Route | Badge |
|------|-------|-------|-------|
| LayoutDashboard | Dashboard | /volunteer | - |
| Search | Find Work | /volunteer/opportunities | - |
| Clipboard | My Assignments | /volunteer/assignments | Active count |
| MessageCircle | Messages | /messages | Unread count |
| Trophy | Achievements | /volunteer/achievements | - |
| User | Profile | /volunteer/profile | - |

### Donor

| Icon | Label | Route | Badge |
|------|-------|-------|-------|
| LayoutDashboard | Dashboard | /donor | - |
| Globe | Discover NGOs | /donor/discover | - |
| Heart | Donate | /donor/donate | - |
| History | My Donations | /donor/donate/history | - |
| Calendar | Events | /events | - |
| MessageCircle | Messages | /messages | Unread count |

## 6.4 Responsive Sidebar Behavior

| Breakpoint | Sidebar State | Toggle |
|------------|---------------|--------|
| Desktop (≥1024px) | Expanded (256px) | Collapse button |
| Tablet (768-1023px) | Collapsed (64px, icons only) | Expand on hover |
| Mobile (<768px) | Hidden | Hamburger → Sheet |

## 6.5 Page Header Component

Every dashboard page includes:
- **Title:** Page name
- **Breadcrumbs:** Navigation path (optional)
- **Description:** Subtitle (optional)
- **Actions:** Primary action buttons
- **Badge:** Status indicator (optional)

---

# 7. Route Architecture

## 7.1 Route Groups

```
app/
├── (public)/          # No authentication required
├── (auth)/            # Authentication pages
├── (dashboard)/       # Protected, requires authentication
│   ├── ngo/          # NGO-specific routes
│   ├── volunteer/    # Volunteer-specific routes
│   ├── donor/        # Donor-specific routes
│   ├── messages/     # Shared messaging
│   ├── notifications/# Shared notifications
│   └── settings/     # Shared settings
└── api/               # API routes
```

## 7.2 Public Routes

| Route | Page | Description |
|-------|------|-------------|
| / | Landing | Marketing homepage |
| /about | About | About Helpit |
| /ngos | NGO Directory | Browse all public NGOs |
| /ngos/[ngoId] | NGO Profile | Public NGO profile |
| /requests | Public Requests | Browse public help requests |
| /missing-persons | Missing Directory | Browse missing persons |
| /events | Public Events | Browse public events |

## 7.3 Authentication Routes

| Route | Page | Description |
|-------|------|-------------|
| /login | Login | Email/password + OAuth |
| /register | Registration | Role selection |
| /register/individual | Individual Signup | Basic user registration |
| /register/volunteer | Volunteer Signup | Volunteer registration |
| /register/ngo | NGO Signup | Organization registration |
| /forgot-password | Forgot Password | Request reset email |
| /reset-password/[token] | Reset Password | Set new password |
| /verify-email/[token] | Verify Email | Email confirmation |

## 7.4 NGO Dashboard Routes

| Route | Page | Access |
|-------|------|--------|
| /ngo | Dashboard | Admin, Coordinator, Member |
| /ngo/requests | Request List | All |
| /ngo/requests/create | Create Request | Admin, Coordinator |
| /ngo/requests/[id] | Request Detail | All |
| /ngo/requests/[id]/edit | Edit Request | Admin, Coordinator |
| /ngo/volunteers | Volunteer List | All |
| /ngo/posts | Posts List | All |
| /ngo/posts/create | Create Post | Admin, Coordinator |
| /ngo/events | Events List | All |
| /ngo/events/create | Create Event | Admin, Coordinator |
| /ngo/donations | Donations Dashboard | Admin (full), Others (summary) |
| /ngo/resources | Resource Inventory | All |
| /ngo/settings/profile | Organization Profile | Admin |
| /ngo/settings/members | Team Members | Admin |

## 7.5 Volunteer Dashboard Routes

| Route | Page |
|-------|------|
| /volunteer | Dashboard |
| /volunteer/opportunities | Find Opportunities |
| /volunteer/opportunities/map | Map View |
| /volunteer/assignments | My Assignments |
| /volunteer/assignments/[id] | Assignment Detail |
| /volunteer/achievements | Achievements |
| /volunteer/profile | View Profile |
| /volunteer/profile/edit | Edit Profile |

## 7.6 Donor Dashboard Routes

| Route | Page |
|-------|------|
| /donor | Dashboard |
| /donor/discover | Browse NGOs |
| /donor/discover/following | Following |
| /donor/donate | Quick Donate |
| /donor/donate/[ngoId] | Donate to NGO |
| /donor/donate/history | Donation History |
| /donor/donate/receipts/[id] | Donation Receipt |

## 7.7 Shared Routes

| Route | Page | Access |
|-------|------|--------|
| /messages | Chat List | All authenticated |
| /messages/[chatId] | Chat Room | Participants only |
| /notifications | All Notifications | All authenticated |
| /settings | Settings | All authenticated |

## 7.8 Admin Routes

| Route | Page | Access |
|-------|------|--------|
| /admin | Admin Dashboard | Platform Admin |
| /admin/users | User Management | Platform Admin |
| /admin/ngos | NGO Management | Platform Admin |
| /admin/reports | Moderation Reports | Platform Admin |
| /admin/audit-logs | Audit Logs | Platform Admin |

## 7.9 Route Protection

```typescript
// Middleware logic
if (isPublicRoute(path)) return next();

if (isAuthRoute(path) && session) {
  return redirect(getDashboardForRole(session.role));
}

if (isDashboardRoute(path)) {
  if (!session) return redirect('/login');
  
  // Role-specific protection
  if (path.startsWith('/ngo') && !isNGORole(session.role)) {
    return redirect('/dashboard');
  }
  if (path.startsWith('/volunteer') && session.role !== 'VOLUNTEER') {
    return redirect('/dashboard');
  }
  if (path.startsWith('/admin') && session.role !== 'PLATFORM_ADMIN') {
    return redirect('/dashboard');
  }
}
```

## 7.10 Role-Based Redirects

| User Role | /dashboard Redirects To |
|-----------|-------------------------|
| NGO Admin | /ngo |
| NGO Coordinator | /ngo |
| NGO Member | /ngo |
| Volunteer | /volunteer |
| Donor | /donor |
| Individual | /donor |
| Platform Admin | /admin |
- Checkbox, Title, Category, Urgency, Status, Volunteers, Created, Actions

**Bulk Actions:** Change Status, Delete Selected, Export

### 8.5.4 Request Detail Page

**Two-Column Layout:**

**Left Column (65%):**
- Header (title, badges)
- Description Section
- Location Section (map, address, directions)
- Media Gallery
- Activity Timeline
- Comments Section

**Right Column (35%):**
- Actions Card (Edit, Assign, Status, Share, Delete)
- Assigned Volunteers Card
- Created By Card
- Similar Requests Card

## 8.6 Communication Module

### 8.6.1 Chat Types

| Type | Participants |
|------|--------------|
| NGO_TO_NGO | 2 NGOs |
| VOLUNTEER_TO_NGO | 1 Volunteer + 1 NGO |
| GROUP | Multiple users |

### 8.6.2 Chat List Page

**Route:** `/messages`

**Desktop:** Split view (list 30% + chat room 70%)
**Mobile:** Full-screen list, navigate to chat room

**Chat Item:**
- Avatar, Name
- Last message preview
- Time (relative)
- Unread badge
- Online indicator

### 8.6.3 Chat Room

**Components:**
- Header (avatar, name, status, menu)
- Messages area (scrollable, date separators)
- Input area (attachment, text, emoji, send)

**Message Features:**
- Sent/received styling
- Time stamps
- Read receipts
- Typing indicator
- Image messages

### 8.6.4 Notification System

**Notification Types:**

| Type | Template |
|------|----------|
| NEW_REQUEST | "New request near you: [Title]" |
| STATUS_UPDATE | "[Request] status changed to [Status]" |
| ASSIGNMENT | "You've been assigned to [Request]" |
| MESSAGE | "New message from [Name]" |
| DONATION | "You received a ₹[amount] donation" |
| FOLLOW | "[User] started following you" |

**Delivery Channels:**
- In-app (always)
- Push (if enabled)
- Email (based on preferences)

## 8.7 Events Module

### 8.7.1 Event Types

| Value | Label |
|-------|-------|
| FUNDRAISER | Fundraising Event |
| VOLUNTEER_DRIVE | Volunteer Drive |
| AWARENESS | Awareness Campaign |
| COMMUNITY | Community Event |
| TRAINING | Training/Workshop |

### 8.7.2 Create Event Form

**Fields:**
- Title, Event Type, Description
- Cover Image
- Start/End Date/Time
- Location Type (Physical/Virtual/Hybrid)
- Venue Address / Virtual Link
- Max Attendees
- Registration Deadline
- Visibility

### 8.7.3 Event Registration

**Flow:**
1. Click Register
2. Confirmation modal
3. Submit → Toast + Email
4. Added to "My Events"

## 8.8 Donations Module

### 8.8.1 Donation Flow

**Route:** `/donor/donate/[ngoId]`

**Step 1: Select Amount**
- Preset buttons: ₹500, ₹1,000, ₹2,500, ₹5,000, ₹10,000
- Custom amount input
- Monthly donation toggle

**Step 2: Your Details**
- Full Name, Email, Phone
- PAN Number (for tax receipt)
- Anonymous checkbox
- Message to NGO

**Step 3: Payment**
- Razorpay integration
- UPI, Card, Net Banking, Wallets

**Step 4: Confirmation**
- Success animation
- Amount, NGO name, Transaction ID
- Download Receipt button
- Share button

### 8.8.2 Donation Receipt

**Contents:**
- Helpit Logo
- Receipt Number, Date
- Donor Details (name, email, PAN)
- Donation Details (NGO, amount, payment method, transaction ID)
- NGO Details (registration, 80G)
- Tax deduction note
- Print / Download PDF / Email buttons

### 8.8.3 NGO Donation Dashboard

**Route:** `/ngo/donations`

**Components:**
- Stats Cards (Total, This Month, Donors, Average)
- Line Chart (donations over time)
- Donations Table (donor, amount, date, method, message)
- Export to CSV

## 8.9 Missing Persons Module

### 8.9.1 Report Missing Person

**Form Fields:**

**Person Details:**
- Name, Age, Gender
- Physical Description
- Identifying Marks
- Last Known Clothing

**Last Seen:**
- Date, Time
- Location (text + map)
- Circumstances

**Contact:**
- Contact Person, Relationship
- Phone, Email

**Photos:**
- Min 1, max 10
- Clear face required

### 8.9.2 Missing Persons List

**Filters:**
- Status (Missing, Found)
- Age Range, Gender
- Location, Date Range

**Card Display:**
- Photo
- Name, Age, Gender
- Status badge
- Last seen date/location
- Reported by
- View Details / Share / Report Sighting

## 8.10 Resources Module

### 8.10.1 Resource Inventory

**Route:** `/ngo/resources`

**Resource Types:**
- FOOD, MEDICAL, CLOTHING, EQUIPMENT, FUNDS, VEHICLES, OTHER

**Resource Status:**
- AVAILABLE, LOW, OUT_OF_STOCK, RESERVED

**Table:** Name, Type, Quantity, Status, Last Updated, Actions

### 8.10.2 Resource Requests

**Request Flow:**
1. NGO A requests from NGO B
2. NGO B notified
3. Approve/Reject
4. If approved, fulfillment tracked

**Status:** PENDING, APPROVED, REJECTED, FULFILLED, CANCELLED

## 8.11 Social & Engagement Module

### 8.11.1 NGO Posts

**Post Types:** IMAGE, VIDEO, TEXT, BLOG

**Create Post:**
- Post Type, Media, Caption/Content
- Visibility (Public, Signed-in, Followers)
- Pin to Profile toggle

**Post Interactions:**
- Like (toggle)
- Comment (add, reply, delete, edit)
- Share (copy link, social media)
- View tracking

### 8.11.2 Following System

- Follow/Unfollow toggle
- Follower count update
- Notification to NGO
- Following feed shows posts from followed NGOs

### 8.11.3 Achievements System

**Categories:**
- Hours: 10, 50, 100, 500 Hours
- Tasks: First Task, 10, 50, 100 Tasks
- NGOs: 1, 5, 10 NGOs helped
- Special: First Responder, Night Owl

**Display:**
- Badge icon, Name
- Description, Earned date
- Rarity indicator

## 8.12 Admin Module

### 8.12.1 Admin Dashboard

**Route:** `/admin`

**Stats:** Total Users, NGOs (verified/pending), Active Requests, Total Donations

### 8.12.2 User Management

- Search/filter users
- View details, Edit role
- Suspend/unsuspend, Delete

### 8.12.3 NGO Management

- Search/filter NGOs
- Verify/reject NGO
- Suspend/unsuspend
- View activity

**Verification Flow:**
1. NGO submits → PENDING
2. Admin reviews documents
3. Approve → VERIFIED or Reject → REJECTED
4. Notification sent

### 8.12.4 Moderation

**Report Types:** User, NGO, Post, Comment, Request

**Actions:** Dismiss, Warn, Remove content, Suspend

### 8.12.5 Audit Logs

**Logged Actions:**
- Authentication events
- Role changes
- NGO verification
- Content deletion
- Settings changes

**Log Fields:**
- Timestamp, User ID, Action
- Entity Type/ID
- IP Address, User Agent

---

# 9. Database Schema

## 9.1 Schema Overview

**Total Tables:** 29

**Domains:**
1. User Management (1)
2. NGO Management (3)
3. Volunteer Management (3)
4. Help Requests (2)
5. Communication (4)
6. Missing Persons (2)
7. Social Engagement (6)
8. Donations (1)
9. Events (2)
10. Resources (2)
11. Gamification (1)
12. Moderation (1)
13. Audit (1)

## 9.2 Core Tables

### users

| Column | Type | Constraints |
|--------|------|-------------|
| user_id | UUID | PK |
| full_name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| phone | VARCHAR(20) | |
| password_hash | VARCHAR(255) | NOT NULL |
| role | ENUM | NOT NULL |
| is_verified | BOOLEAN | DEFAULT false |
| email_verified | BOOLEAN | DEFAULT false |
| avatar_url | TEXT | |
| created_at | TIMESTAMP | DEFAULT now() |
| last_login | TIMESTAMP | |

**Role ENUM:** INDIVIDUAL, VOLUNTEER, DONOR, NGO_MEMBER, NGO_COORDINATOR, NGO_ADMIN, PLATFORM_ADMIN

### ngos

| Column | Type | Constraints |
|--------|------|-------------|
| ngo_id | UUID | PK |
| ngo_name | VARCHAR(255) | NOT NULL |
| username | VARCHAR(100) | UNIQUE |
| registration_number | VARCHAR(100) | NOT NULL |
| category | VARCHAR(100) | NOT NULL |
| description | TEXT | |
| address | TEXT | |
| city | VARCHAR(100) | |
| state | VARCHAR(100) | |
| latitude | DECIMAL(10,8) | |
| longitude | DECIMAL(11,8) | |
| contact_email | VARCHAR(255) | |
| contact_phone | VARCHAR(20) | |
| verification_status | ENUM | DEFAULT 'PENDING' |
| created_by | UUID | FK → users |
| created_at | TIMESTAMP | DEFAULT now() |

### Help_Requests

| Column | Type | Constraints |
|--------|------|-------------|
| request_id | UUID | PK |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | NOT NULL |
| category | ENUM | NOT NULL |
| urgency_level | ENUM | NOT NULL |
| status | ENUM | DEFAULT 'OPEN' |
| latitude | DECIMAL(10,8) | |
| longitude | DECIMAL(11,8) | |
| address | TEXT | |
| created_by | UUID | FK → users |
| assigned_ngo | UUID | FK → ngos |
| visibility | ENUM | DEFAULT 'PUBLIC' |
| created_at | TIMESTAMP | DEFAULT now() |

### Volunteers

| Column | Type | Constraints |
|--------|------|-------------|
| volunteer_id | UUID | PK |
| user_id | UUID | FK → users, UNIQUE |
| skills | TEXT[] | |
| availability | TEXT[] | |
| preferred_radius_km | INTEGER | DEFAULT 25 |
| latitude | DECIMAL(10,8) | |
| longitude | DECIMAL(11,8) | |
| is_available | BOOLEAN | DEFAULT true |
| total_hours | INTEGER | DEFAULT 0 |
| impact_score | INTEGER | DEFAULT 0 |
| created_at | TIMESTAMP | DEFAULT now() |

### Donations

| Column | Type | Constraints |
|--------|------|-------------|
| donation_id | UUID | PK |
| donor_id | UUID | FK → users |
| ngo_id | UUID | FK → ngos |
| amount | DECIMAL(12,2) | NOT NULL |
| currency | VARCHAR(3) | DEFAULT 'INR' |
| payment_method | ENUM | |
| transaction_id | VARCHAR(255) | |
| status | ENUM | DEFAULT 'PENDING' |
| is_anonymous | BOOLEAN | DEFAULT false |
| donor_message | TEXT | |
| receipt_number | VARCHAR(50) | UNIQUE |
| donated_at | TIMESTAMP | DEFAULT now() |

## 9.3 Key Indexes

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- NGO searches
CREATE INDEX idx_ngos_category ON ngos(category);
CREATE INDEX idx_ngos_city ON ngos(city);

-- Geospatial (PostGIS)
CREATE INDEX idx_ngos_location ON ngos USING GIST (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);
CREATE INDEX idx_requests_location ON Help_Requests USING GIST (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);
CREATE INDEX idx_volunteers_location ON Volunteers USING GIST (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);

-- Request filtering
CREATE INDEX idx_requests_status ON Help_Requests(status);
CREATE INDEX idx_requests_category ON Help_Requests(category);
CREATE INDEX idx_requests_created ON Help_Requests(created_at DESC);

-- Chat performance
CREATE INDEX idx_messages_chat ON Messages(chat_id, sent_at DESC);
CREATE INDEX idx_notifications_user ON Notifications(user_id, is_read);
```

## 9.4 Row Level Security (RLS)

```sql
-- Users see own data
CREATE POLICY users_own_data ON users
  FOR ALL USING (auth.uid() = user_id);

-- NGO members see their organization
CREATE POLICY ngo_member_access ON ngos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM NGO_Members
      WHERE NGO_Members.ngo_id = ngos.ngo_id
      AND NGO_Members.user_id = auth.uid()
    )
  );

-- Public requests visible to all
CREATE POLICY public_requests ON Help_Requests
  FOR SELECT USING (visibility = 'PUBLIC');
```

---

# 10. API Specifications

## 10.1 Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| POST | /api/auth/refresh | Refresh token |
| POST | /api/auth/forgot-password | Request reset |
| POST | /api/auth/reset-password | Reset password |
| GET | /api/auth/me | Get current user |

## 10.2 Users Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users/:id | Get user |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |

## 10.3 NGOs Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/ngos | List NGOs |
| POST | /api/ngos | Create NGO |
| GET | /api/ngos/:id | Get NGO |
| PUT | /api/ngos/:id | Update NGO |
| DELETE | /api/ngos/:id | Delete NGO |
| GET | /api/ngos/:id/members | Get members |
| POST | /api/ngos/:id/members | Add member |
| DELETE | /api/ngos/:id/members/:userId | Remove member |
| POST | /api/ngos/:id/follow | Follow |
| DELETE | /api/ngos/:id/follow | Unfollow |

## 10.4 Help Requests Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/requests | List requests |
| POST | /api/requests | Create request |
| GET | /api/requests/:id | Get request |
| PUT | /api/requests/:id | Update request |
| DELETE | /api/requests/:id | Delete request |
| PUT | /api/requests/:id/status | Update status |
| POST | /api/requests/:id/assign | Assign volunteer |
| GET | /api/requests/nearby | Nearby requests |

## 10.5 Volunteers Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/volunteers | List volunteers |
| GET | /api/volunteers/:id | Get volunteer |
| PUT | /api/volunteers/:id | Update volunteer |
| PUT | /api/volunteers/:id/availability | Set availability |
| GET | /api/volunteers/:id/assignments | Get assignments |
| PUT | /api/volunteers/assignments/:id | Update assignment |

## 10.6 Donations Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/donations/create-order | Create Razorpay order |
| POST | /api/donations/verify | Verify payment |
| GET | /api/donations/:id | Get donation |
| GET | /api/donations/history | Get history |
| GET | /api/donations/:id/receipt | Get receipt |

## 10.7 Communication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/chats | List chats |
| POST | /api/chats | Create chat |
| GET | /api/chats/:id/messages | Get messages |
| POST | /api/chats/:id/messages | Send message |
| GET | /api/notifications | Get notifications |
| PUT | /api/notifications/:id/read | Mark read |

## 10.8 Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 100 }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [{ "field": "email", "message": "..." }]
  }
}
```

---

# 11. UI Component Library

## 11.1 Design Tokens

### Colors

**Primary (Blue):**
- primary-600: #2563EB (main)
- primary-700: #1D4ED8 (hover)

**Secondary (Emerald):**
- secondary-500: #10B981

**Accent (Amber):**
- accent-500: #F59E0B

**Semantic:**
- success: #22C55E
- warning: #EAB308
- error: #EF4444
- info: #3B82F6

**Neutral:**
- gray-50 to gray-900

### Typography

**Font:** Inter (sans-serif)

**Sizes:**
- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 30px
- 4xl: 36px

### Spacing

- 1: 4px
- 2: 8px
- 3: 12px
- 4: 16px
- 6: 24px
- 8: 32px
- 12: 48px
- 16: 64px

### Borders & Radius

- sm: 4px
- md: 6px
- lg: 8px
- xl: 12px
- full: 9999px

## 11.2 Component Specifications

### Button Variants
- default (primary)
- secondary
- outline
- ghost
- destructive
- link

### Button Sizes
- sm: 32px
- default: 40px
- lg: 48px
- icon: square

### Card Structure
- CardHeader (CardTitle, CardDescription)
- CardContent
- CardFooter

### Data Table Features
- Column sorting
- Column visibility
- Row selection
- Pagination
- Search/filter
- Loading skeleton
- Empty state

### Form Components
- Input, Textarea, Select
- Checkbox, Radio, Switch
- Date Picker, File Upload

### Feedback Components
- Toast (Sonner)
- Alert, Progress
- Skeleton, Spinner

### Overlay Components
- Dialog, Sheet
- Dropdown Menu
- Command (⌘K)
- Tooltip, Popover

---

# 12. Technical Stack

## 12.1 Frontend

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| State (Server) | TanStack Query |
| State (Client) | Zustand |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Maps | Mapbox GL |
| Charts | Recharts |

## 12.2 Backend

| Category | Technology |
|----------|------------|
| Primary Backend | Supabase |
| Database | PostgreSQL |
| Geospatial | PostGIS |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime |
| Push Notifications | Firebase FCM |
| Email | Resend |
| Payments | Razorpay |

## 12.3 Infrastructure

| Category | Service |
|----------|---------|
| Hosting | Vercel |
| Database | Supabase Cloud |
| CDN | Vercel Edge |
| Monitoring | Sentry |
| Analytics | Vercel Analytics |
| CI/CD | GitHub Actions |

---

# 13. Development Phases

## 13.1 Phase Overview

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1 | Weeks 1-4 | Foundation & Auth |
| Phase 2 | Weeks 5-8 | NGO Core |
| Phase 3 | Weeks 9-12 | Volunteer Core |
| Phase 4 | Weeks 13-16 | Communication |
| Phase 5 | Weeks 17-20 | Donations & Social |
| Phase 6 | Weeks 21-24 | Events & Resources |
| Phase 7 | Weeks 25-28 | Polish & Admin |
| Phase 8 | Weeks 29-32 | Mobile App |

## 13.2 Phase 1: Foundation (Weeks 1-4)

**Sprint 1-2: Project Setup**
- Next.js + TypeScript + Tailwind
- shadcn/ui setup
- Supabase project + schema
- Auth integration
- Layout system

**Sprint 3-4: Auth & Shell**
- Login, Registration pages
- Password reset flow
- Email verification
- App shell (sidebar + header)
- Role-based navigation
- Command palette

**Milestone:** Users can register, login, and see dashboard shell.

## 13.3 Phase 2: NGO Core (Weeks 5-8)

**Sprint 5-6: NGO Setup**
- NGO Dashboard
- NGO Profile (view + edit)
- Member management
- Settings pages

**Sprint 7-8: Help Requests**
- Request creation
- Request list (tabs, filters)
- Request detail
- Media upload
- Status workflow

**Milestone:** NGOs can create and manage help requests.

## 13.4 Phase 3: Volunteer Core (Weeks 9-12)

**Sprint 9-10: Volunteer Profile**
- Volunteer Dashboard
- Profile (view + edit)
- Skills management
- Availability toggle

**Sprint 11-12: Assignments**
- Find opportunities (list + map)
- Apply to requests
- Assignment management
- NGO volunteer browse

**Milestone:** Volunteers can find and complete assignments.

## 13.5 Phase 4: Communication (Weeks 13-16)

**Sprint 13-14: Chat System**
- Chat list
- Chat room (real-time)
- Message features
- New chat creation

**Sprint 15-16: Notifications**
- In-app notifications
- Push notifications (FCM)
- Notification settings
- Email notifications

**Milestone:** Users can communicate in real-time.

## 13.6 Phase 5: Donations & Social (Weeks 17-20)

**Sprint 17-18: Donations**
- Donation flow
- Razorpay integration
- Receipt generation
- Donation history
- Analytics

**Sprint 19-20: Social Features**
- NGO Posts
- Post interactions
- Follow system
- Activity feed
- Donor dashboard

**Milestone:** Full donation flow and social engagement.

## 13.7 Phase 6: Events & Resources (Weeks 21-24)

**Sprint 21-22: Events**
- Event creation
- Event list (calendar + list)
- Event detail
- Registration flow
- Attendee management

**Sprint 23-24: Resources & Missing**
- Resource inventory
- Resource requests
- Missing persons module
- Public pages

**Milestone:** Complete feature set for web.

## 13.8 Phase 7: Polish & Admin (Weeks 25-28)

**Sprint 25-26: Admin**
- Admin dashboard
- User management
- NGO verification
- Moderation
- Audit logs

**Sprint 27-28: Polish**
- Performance optimization
- Accessibility (WCAG 2.1 AA)
- Error handling
- Loading/empty states
- Documentation

**Milestone:** Production-ready web application.

## 13.9 Phase 8: Mobile App (Weeks 29-32)

**Sprint 29-30: Mobile Foundation**
- React Native setup
- Navigation
- Auth screens
- Dashboard screens

**Sprint 31-32: Mobile Features**
- Request screens
- Assignment screens
- Chat screens
- Push notifications
- Location services

**Milestone:** Android app beta release.

---

# 14. Security Requirements

## 14.1 Authentication Security

| Requirement | Implementation |
|-------------|----------------|
| Password hashing | bcrypt, 12+ rounds |
| Token expiry | Access: 15 min, Refresh: 7 days |
| Rate limiting | 5 attempts, then 15 min lockout |
| OAuth security | State parameter, PKCE |

## 14.2 Data Protection

| Requirement | Implementation |
|-------------|----------------|
| Encryption at rest | Supabase default |
| Encryption in transit | TLS 1.3 |
| Input sanitization | Server-side validation |
| SQL injection | Parameterized queries |
| XSS prevention | Content Security Policy |

## 14.3 Access Control

| Requirement | Implementation |
|-------------|----------------|
| Row Level Security | PostgreSQL RLS policies |
| Role-based access | Middleware + API checks |
| Resource ownership | Owner/org verification |
| API authentication | JWT validation |

## 14.4 Privacy Compliance

| Requirement | Implementation |
|-------------|----------------|
| Data minimization | Collect only necessary |
| User consent | Explicit opt-in |
| Data export | User data download |
| Account deletion | Full data removal |

---

# 15. Performance Requirements

## 15.1 Core Web Vitals

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| TTFB | < 600ms |

## 15.2 Application Performance

| Metric | Target |
|--------|--------|
| Initial page load | < 3s (3G) |
| Route transitions | < 300ms |
| API response (p95) | < 500ms |
| Real-time latency | < 100ms |

## 15.3 Scalability Targets (Year 1)

| Metric | Target |
|--------|--------|
| Concurrent users | 10,000 |
| Requests per second | 1,000 |
| Database size | 100 GB |
| File storage | 1 TB |

---

# 16. Testing Strategy

## 16.1 Testing Pyramid

| Level | Coverage | Tools |
|-------|----------|-------|
| Unit Tests | 80% | Jest, Testing Library |
| Integration | 60% | Jest, Supertest |
| E2E | Critical paths | Playwright |

## 16.2 Quality Gates

| Gate | Criteria |
|------|----------|
| PR merge | All tests pass, no lint errors |
| Staging | E2E tests pass |
| Production | Manual QA approval |

---

# 17. Deployment Strategy

## 17.1 Environments

| Environment | URL |
|-------------|-----|
| Development | localhost:3000 |
| Preview | *.vercel.app |
| Staging | staging.helpit.org |
| Production | app.helpit.org |

## 17.2 CI/CD Pipeline

```
Push → Lint → Test → Build → Preview (PRs)
Merge to main → Staging → E2E → Approval → Production
```

---

# 18. Monitoring & Analytics

## 18.1 Application Monitoring

| Tool | Purpose |
|------|---------|
| Sentry | Error tracking |
| Vercel Analytics | Web vitals |
| Supabase Dashboard | Database metrics |

## 18.2 Business Analytics

| Metric | Tracking |
|--------|----------|
| User signups | Daily, by type |
| Active users | DAU, WAU, MAU |
| Requests created | Daily, by category |
| Donations | Amount, frequency |

## 18.3 Alerting

| Alert | Condition |
|-------|-----------|
| Error spike | > 10 errors/min |
| API latency | p95 > 1s |
| Database CPU | > 80% |

---

# 19. Success Metrics

## 19.1 Product Metrics (Year 1)

| Metric | Target |
|--------|--------|
| Registered NGOs | 500 |
| Verified NGOs | 300 |
| Active volunteers | 5,000 |
| Requests created | 10,000 |
| Requests resolved | 8,000 (80%) |
| Total donations | ₹50 lakh |
| Monthly active users | 10,000 |

## 19.2 Engagement Metrics

| Metric | Target |
|--------|--------|
| DAU/MAU ratio | > 30% |
| Session duration | > 5 min |
| Pages per session | > 4 |
| Return rate (7-day) | > 40% |

## 19.3 Technical Metrics

| Metric | Target |
|--------|--------|
| Uptime | 99.5% |
| Error rate | < 0.1% |
| Page load (p75) | < 2.5s |
| API latency (p95) | < 500ms |

---

# 20. Appendices

## 20.1 Glossary

| Term | Definition |
|------|------------|
| NGO | Non-Governmental Organization |
| CSR | Corporate Social Responsibility |
| Help Request | A request for assistance on the platform |
| Assignment | Volunteer assigned to a request |
| Impact Score | Metric based on volunteer contributions |
| RLS | Row Level Security (PostgreSQL) |

## 20.2 Referenced Documents

- Routes Document: Complete route mapping
- Architecture Schema: Database schema details
- ERD Diagram: Visual entity relationships

## 20.3 Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 6, 2026 | Initial PRD |
| 2.0 | Jan 6, 2026 | Application-first architecture |
| 3.0 | Jan 6, 2026 | Detailed specifications (no prompts) |

---

*Document maintained by Helpit Product Team*
*Last Updated: January 6, 2026*