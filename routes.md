# Helpit NGO Platform – Routes & Pages

## Overview

This document outlines all application routes/pages for the Helpit NGO Platform, organized by user role and feature domain.

---

## Authentication Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing Page | Home with impact stats, image carousel, Report_It!, SignUp/Join CTA |
| `/login` | Login | Email/phone + password authentication |
| `/register` | Registration | User type selection (Individual, Volunteer, NGO) |
| `/register/individual` | Individual Registration | Basic user signup for donors/general users |
| `/register/volunteer` | Volunteer Registration | Volunteer signup with skills, availability, location |
| `/register/ngo` | NGO Registration | Organization registration with verification |
| `/forgot-password` | Password Reset | Request password reset link |
| `/reset-password/:token` | Reset Password | Set new password |
| `/verify-email/:token` | Email Verification | Confirm email address |
| `/verify-phone` | Phone Verification | OTP verification |

---

## Dashboard Routes

| Route | Page | Access |
|-------|------|--------|
| `/dashboard` | Main Dashboard | All authenticated users |
| `/dashboard/ngo` | NGO Dashboard | NGO Admin/Coordinator |
| `/dashboard/volunteer` | Volunteer Dashboard | Volunteers |
| `/dashboard/donor` | Donor Dashboard | Donors |

---

## User Profile Routes

| Route | Page | Description |
|-------|------|-------------|
| `/profile` | My Profile | View/edit own profile |
| `/profile/settings` | Account Settings | Email, password, notifications |
| `/profile/achievements` | My Achievements | Badges and milestones |
| `/users/:userId` | Public User Profile | View other user's public profile |

---

## NGO Routes

| Route | Page | Access |
|-------|------|--------|
| `/ngos` | Browse NGOs | Public |
| `/ngos/:ngoId` | NGO Public Profile | Public |
| `/ngos/:ngoId/posts` | NGO Posts Feed | Public |
| `/ngos/:ngoId/events` | NGO Events | Public |
| `/ngos/:ngoId/donate` | Donate to NGO | Donors |
| `/ngo/manage` | NGO Management | NGO Admin |
| `/ngo/manage/profile` | Edit NGO Profile | NGO Admin |
| `/ngo/manage/members` | Manage Members | NGO Admin |
| `/ngo/manage/posts` | Manage Posts | NGO Admin/Coordinator |
| `/ngo/manage/posts/create` | Create Post | NGO Admin/Coordinator |
| `/ngo/manage/posts/:postId/edit` | Edit Post | NGO Admin/Coordinator |

---

## Volunteer Routes

| Route | Page | Access |
|-------|------|--------|
| `/volunteers` | Browse Volunteers | NGO Members |
| `/volunteers/:volunteerId` | Volunteer Public Profile | Public (if public) |
| `/volunteer/profile` | My Volunteer Profile | Volunteers |
| `/volunteer/profile/edit` | Edit Volunteer Profile | Volunteers |
| `/volunteer/assignments` | My Assignments | Volunteers |
| `/volunteer/assignments/:id` | Assignment Details | Volunteers |
| `/volunteer/availability` | Set Availability | Volunteers |

---

## Help Request Routes

| Route | Page | Access |
|-------|------|--------|
| `/requests` | Browse Help Requests | All users |
| `/requests/map` | Map View | All users |
| `/requests/create` | Create Request | Authenticated |
| `/requests/:requestId` | Request Details | All users |
| `/requests/:requestId/edit` | Edit Request | Creator/NGO |
| `/requests/:requestId/assign` | Assign Volunteers | NGO Admin/Coordinator |
| `/requests/:requestId/media` | Request Media Gallery | All users |

---

## Missing Persons Routes

| Route | Page | Access |
|-------|------|--------|
| `/missing-persons` | Browse Missing Persons | Public |
| `/missing-persons/create` | Report Missing Person | NGO Members |
| `/missing-persons/:personId` | Missing Person Details | Public |
| `/missing-persons/:personId/edit` | Edit Report | NGO Members |
| `/missing-persons/search` | Face Search | NGO Admin (with consent) |

---

## Events Routes

| Route | Page | Access |
|-------|------|--------|
| `/events` | Browse Events | Public |
| `/events/calendar` | Events Calendar | Public |
| `/events/:eventId` | Event Details | Public |
| `/events/:eventId/register` | Register for Event | Authenticated |
| `/ngo/events/create` | Create Event | NGO Admin/Coordinator |
| `/ngo/events/:eventId/edit` | Edit Event | NGO Admin/Coordinator |
| `/ngo/events/:eventId/attendees` | Manage Attendees | NGO Admin/Coordinator |

---

## Donations Routes

| Route | Page | Access |
|-------|------|--------|
| `/donate` | Donation Portal | Public |
| `/donate/:ngoId` | Donate to Specific NGO | Public |
| `/donations/history` | My Donation History | Donors |
| `/donations/:donationId` | Donation Receipt | Donor |
| `/ngo/donations` | NGO Donation Dashboard | NGO Admin |
| `/ngo/donations/analytics` | Donation Analytics | NGO Admin |

---

## Resources Routes

| Route | Page | Access |
|-------|------|--------|
| `/ngo/resources` | Resource Inventory | NGO Members |
| `/ngo/resources/create` | Add Resource | NGO Admin/Coordinator |
| `/ngo/resources/:resourceId/edit` | Edit Resource | NGO Admin/Coordinator |
| `/ngo/resources/requests` | Resource Requests | NGO Admin/Coordinator |
| `/ngo/resources/requests/create` | Request Resources | NGO Admin/Coordinator |
| `/ngo/resources/requests/:id` | Request Details | NGO Admin/Coordinator |

---

## Communication Routes

| Route | Page | Access |
|-------|------|--------|
| `/chats` | Chat List | Authenticated |
| `/chats/:chatId` | Chat Room | Participants |
| `/chats/new` | Start New Chat | Authenticated |
| `/notifications` | Notifications Center | Authenticated |
| `/notifications/settings` | Notification Preferences | Authenticated |

---

## Admin & Moderation Routes

| Route | Page | Access |
|-------|------|--------|
| `/admin` | Admin Dashboard | Platform Admin |
| `/admin/users` | Manage Users | Platform Admin |
| `/admin/ngos` | Manage NGOs | Platform Admin |
| `/admin/reports` | Review Reports | Platform Admin |
| `/admin/reports/:reportId` | Report Details | Platform Admin |
| `/admin/audit-logs` | Audit Logs | Platform Admin |
| `/report/user/:userId` | Report User | Authenticated |
| `/report/post/:postId` | Report Post | Authenticated |
| `/report/ngo/:ngoId` | Report NGO | Authenticated |

---

## Social Engagement Routes

| Route | Page | Access |
|-------|------|--------|
| `/feed` | Activity Feed | Authenticated |
| `/posts/:postId` | View Post | Public (if public) |
| `/posts/:postId/comments` | Post Comments | Authenticated |
| `/search` | Global Search | Public |
| `/search/ngos` | Search NGOs | Public |
| `/search/volunteers` | Search Volunteers | NGO Members |
| `/search/requests` | Search Requests | Public |

---

## API Routes (Backend)

### Authentication API
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
POST   /api/auth/verify-phone
```

### Users API
```
GET    /api/users/:userId
PUT    /api/users/:userId
DELETE /api/users/:userId
GET    /api/users/:userId/achievements
```

### NGOs API
```
GET    /api/ngos
POST   /api/ngos
GET    /api/ngos/:ngoId
PUT    /api/ngos/:ngoId
DELETE /api/ngos/:ngoId
GET    /api/ngos/:ngoId/members
POST   /api/ngos/:ngoId/members
GET    /api/ngos/:ngoId/posts
GET    /api/ngos/:ngoId/events
GET    /api/ngos/:ngoId/followers
POST   /api/ngos/:ngoId/follow
DELETE /api/ngos/:ngoId/follow
```

### Volunteers API
```
GET    /api/volunteers
GET    /api/volunteers/:volunteerId
PUT    /api/volunteers/:volunteerId
GET    /api/volunteers/:volunteerId/profile
PUT    /api/volunteers/:volunteerId/profile
GET    /api/volunteers/:volunteerId/assignments
GET    /api/volunteers/nearby
```

### Help Requests API
```
GET    /api/requests
POST   /api/requests
GET    /api/requests/:requestId
PUT    /api/requests/:requestId
DELETE /api/requests/:requestId
POST   /api/requests/:requestId/assign
GET    /api/requests/:requestId/media
POST   /api/requests/:requestId/media
GET    /api/requests/nearby
```

### Events API
```
GET    /api/events
POST   /api/events
GET    /api/events/:eventId
PUT    /api/events/:eventId
DELETE /api/events/:eventId
POST   /api/events/:eventId/register
DELETE /api/events/:eventId/register
GET    /api/events/:eventId/attendees
```

### Donations API
```
POST   /api/donations
GET    /api/donations/:donationId
GET    /api/donations/my-history
GET    /api/ngos/:ngoId/donations
POST   /api/donations/:donationId/refund
```

### Resources API
```
GET    /api/ngos/:ngoId/resources
POST   /api/ngos/:ngoId/resources
PUT    /api/resources/:resourceId
DELETE /api/resources/:resourceId
GET    /api/resource-requests
POST   /api/resource-requests
PUT    /api/resource-requests/:id
```

### Communication API
```
GET    /api/chats
POST   /api/chats
GET    /api/chats/:chatId
GET    /api/chats/:chatId/messages
POST   /api/chats/:chatId/messages
GET    /api/notifications
PUT    /api/notifications/:id/read
PUT    /api/notifications/read-all
```

### Missing Persons API
```
GET    /api/missing-persons
POST   /api/missing-persons
GET    /api/missing-persons/:personId
PUT    /api/missing-persons/:personId
DELETE /api/missing-persons/:personId
POST   /api/missing-persons/face-search
```

### Posts & Social API
```
GET    /api/posts
POST   /api/posts
GET    /api/posts/:postId
PUT    /api/posts/:postId
DELETE /api/posts/:postId
POST   /api/posts/:postId/like
DELETE /api/posts/:postId/like
GET    /api/posts/:postId/comments
POST   /api/posts/:postId/comments
DELETE /api/comments/:commentId
```

### Reports & Admin API
```
POST   /api/reports
GET    /api/admin/reports
PUT    /api/admin/reports/:reportId
GET    /api/admin/audit-logs
GET    /api/admin/users
PUT    /api/admin/users/:userId
```

---

## Route Guards & Access Control

| Guard | Description | Applied To |
|-------|-------------|------------|
| `AuthGuard` | Requires authentication | All authenticated routes |
| `GuestGuard` | Only for unauthenticated | Login, Register |
| `NGOAdminGuard` | NGO Admin role required | NGO management routes |
| `NGOCoordinatorGuard` | NGO Coordinator+ role | Post/Event creation |
| `VolunteerGuard` | Volunteer role required | Volunteer-specific routes |
| `DonorGuard` | Donor role required | Donation history |
| `PlatformAdminGuard` | Platform admin only | Admin routes |

---

## Navigation Structure

```
├── Home (/)
├── Auth
│   ├── Login (/login)
│   ├── Register (/register)
│   └── Forgot Password (/forgot-password)
├── Dashboard (/dashboard)
├── Help Requests
│   ├── Browse (/requests)
│   ├── Map View (/requests/map)
│   └── Create (/requests/create)
├── NGOs
│   ├── Browse (/ngos)
│   └── NGO Profile (/ngos/:id)
├── Events
│   ├── Browse (/events)
│   └── Calendar (/events/calendar)
├── Missing Persons (/missing-persons)
├── Donate (/donate)
├── My Profile (/profile)
├── Chats (/chats)
├── Notifications (/notifications)
└── NGO Management (NGO Users)
    ├── Dashboard (/ngo/manage)
    ├── Members (/ngo/manage/members)
    ├── Posts (/ngo/manage/posts)
    ├── Events (/ngo/events)
    ├── Resources (/ngo/resources)
    └── Donations (/ngo/donations)
```

---

## Mobile Deep Links

| Deep Link | Opens |
|-----------|-------|
| `helpit://request/:id` | Help Request Details |
| `helpit://ngo/:id` | NGO Profile |
| `helpit://event/:id` | Event Details |
| `helpit://chat/:id` | Chat Room |
| `helpit://volunteer/:id` | Volunteer Profile |
| `helpit://missing/:id` | Missing Person Report |
