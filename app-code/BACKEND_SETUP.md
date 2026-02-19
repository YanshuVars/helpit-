# Helpit NGO Platform - Backend Setup Guide

## Overview

This document explains how to set up the Supabase backend for the Helpit NGO Platform.

## Prerequisites

- Supabase account with a project created
- Supabase CLI (optional, for local development)
- Node.js 18+

## Environment Variables

The `.env.local` file contains all required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

## Database Setup

### Step 1: Run Migrations

Go to your Supabase project → SQL Editor and run the migrations in order:

1. **`supabase/migrations/001_initial_schema.sql`** - Creates all tables, enums, and indexes
2. **`supabase/migrations/002_rls_policies.sql`** - Sets up Row Level Security policies
3. **`supabase/migrations/003_functions_triggers.sql`** - Creates database functions and triggers
4. **`supabase/migrations/004_storage_buckets.sql`** - Creates storage buckets and policies

### Step 2: Seed Data (Optional)

Run `supabase/seed.sql` to add sample NGO data for testing.

## Database Schema

### Tables Created

| Table | Description |
|-------|-------------|
| `users` | Extended user profiles (linked to auth.users) |
| `ngos` | NGO organizations |
| `ngo_members` | NGO membership with roles |
| `help_requests` | Help requests created by NGOs |
| `request_media` | Media attachments for requests |
| `request_comments` | Comments on help requests |
| `volunteer_assignments` | Volunteer task assignments |
| `events` | NGO events |
| `event_registrations` | Event attendee registrations |
| `posts` | NGO social posts |
| `post_likes` | Post likes |
| `post_comments` | Post comments |
| `donations` | Donation records |
| `resources` | NGO resource inventory |
| `resource_requests` | Resource sharing requests |
| `chats` | Chat rooms |
| `chat_participants` | Chat room members |
| `messages` | Chat messages |
| `notifications` | User notifications |
| `notification_preferences` | User notification settings |
| `follows` | User-NGO follow relationships |
| `reports` | Content/user reports |
| `audit_logs` | System audit trail |
| `achievements` | User achievements |

## Storage Buckets

| Bucket | Public | Max Size | Purpose |
|--------|--------|----------|---------|
| `avatars` | ✅ | 5MB | User profile pictures |
| `ngo-logos` | ✅ | 5MB | NGO logos |
| `ngo-covers` | ✅ | 10MB | NGO cover images |
| `ngo-documents` | ❌ | 20MB | NGO registration documents |
| `request-media` | ✅ | 50MB | Help request media |
| `post-media` | ✅ | 50MB | NGO post media |
| `event-covers` | ✅ | 10MB | Event cover images |
| `chat-media` | ❌ | 20MB | Chat attachments |

## API Routes

### Authentication
- `GET /api/auth/callback` - OAuth and email verification callback

### Payments
- `POST /api/payments/create-order` - Create Razorpay payment order
- `POST /api/payments/verify` - Verify payment signature and complete donation

### Receipts
- `GET /api/receipts/[id]` - Generate and download donation receipt HTML

## Key Features

### Auto-Triggers
- **User creation**: Automatically creates user profile and notification preferences on signup
- **Email verification**: Updates `email_verified_at` when email is confirmed
- **Post engagement**: Auto-updates `likes_count` and `comments_count` on posts
- **Event capacity**: Auto-updates `current_attendees` on event registrations
- **NGO stats**: Auto-updates `total_volunteers`, `total_donations`, `total_requests_resolved`
- **Resource stock**: Auto-sets `is_low_stock` when quantity ≤ min_quantity
- **Donation receipts**: Auto-generates receipt numbers for completed donations
- **Assignment tracking**: Auto-updates `volunteers_assigned` count on requests

### Row Level Security
All tables have RLS enabled with policies based on:
- **User roles**: PLATFORM_ADMIN, NGO_ADMIN, NGO_COORDINATOR, NGO_MEMBER, VOLUNTEER, DONOR, INDIVIDUAL
- **Ownership**: Users can only modify their own data
- **NGO membership**: NGO members can access their NGO's data
- **Visibility**: Public content is accessible to all

### Database Functions
- `get_user_role()` - Get current user's role
- `is_platform_admin()` - Check if user is platform admin
- `is_ngo_admin(ngo_id)` - Check if user is NGO admin
- `is_ngo_member(ngo_id)` - Check if user is NGO member
- `search_ngos_by_location(lat, lng, radius_km)` - Find nearby NGOs
- `get_volunteer_stats(user_id)` - Get volunteer statistics
- `get_ngo_stats(ngo_id)` - Get NGO statistics
- `create_audit_log(...)` - Create audit log entry
- `update_last_active(user_id)` - Update user's last active timestamp

## Supabase Auth Configuration

In your Supabase project settings:

1. **Email Auth**: Enable email/password authentication
2. **Email Confirmation**: Enable email confirmation
3. **Redirect URLs**: Add `http://localhost:3000/api/auth/callback`
4. **JWT Expiry**: Set to 3600 seconds (1 hour)

## Real-time Subscriptions

The app uses Supabase real-time for:
- **Chat messages**: New messages in chat rooms
- **Notifications**: New notifications for users
- **Chat updates**: Chat room updates

Enable real-time in Supabase for these tables:
- `messages`
- `notifications`
- `chats`

## Payment Integration (Razorpay)

Currently using mock payment flow. To enable real payments:

1. Create a Razorpay account at https://razorpay.com
2. Get your API keys from the Razorpay dashboard
3. Update `.env.local` with your keys
4. Uncomment the Razorpay code in `/api/payments/create-order/route.ts`
5. Install Razorpay: `npm install razorpay`

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check
npx tsc --noEmit
```

## Project Completion Status

### ✅ Completed (~65%)
- Full UI/UX for all user roles (Admin, NGO, Volunteer, Donor)
- Authentication flows (login, register, forgot password, email verification)
- Dashboard pages for all roles
- Navigation components
- API helper functions (users, NGOs, requests, donations, messages, notifications)
- Supabase client setup
- Middleware for auth protection
- Database schema design
- TypeScript types

### 🔧 Backend Setup (This PR - ~20%)
- Database migrations (schema, RLS, functions, triggers)
- Storage buckets configuration
- API routes (payments, receipts, auth callback)
- Fixed pre-existing TypeScript errors

### ❌ Remaining (~15%)
- Payment gateway integration (Razorpay)
- Email notifications (Resend/SendGrid)
- Push notifications (Firebase)
- File upload UI components
- Real-time chat UI
- Map integration (Google Maps/Mapbox)
- Admin moderation workflows
- Facial recognition microservice
- Mobile app (React Native)
