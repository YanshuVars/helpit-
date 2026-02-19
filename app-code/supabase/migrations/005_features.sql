-- ============================================================
-- Helpit NGO Platform - Phase 5-7 Features Migration
-- Migration: 005_features.sql
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Missing Persons Table
-- ============================================================

CREATE TYPE missing_person_status AS ENUM (
    'MISSING',
    'FOUND',
    'DECEASED',
    'CLOSED'
);

CREATE TABLE IF NOT EXISTS public.missing_persons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Reporter info
    reported_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    ngo_id UUID REFERENCES public.ngos(id) ON DELETE SET NULL,
    
    -- Person details
    full_name TEXT NOT NULL,
    age INTEGER,
    gender TEXT CHECK (gender IN ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY')),
    photo_url TEXT,
    
    -- Physical description
    height TEXT,
    build TEXT,
    hair_color TEXT,
    eye_color TEXT,
    distinguishing_marks TEXT,
    
    -- Last known info
    last_seen_date DATE,
    last_seen_location TEXT,
    last_seen_city TEXT,
    last_seen_state TEXT,
    last_seen_coordinates JSONB,
    
    -- Clothing description
    clothing_description TEXT,
    
    -- Medical info (if any)
    medical_conditions TEXT,
    medications TEXT,
    
    -- Status
    status missing_person_status NOT NULL DEFAULT 'MISSING',
    
    -- Contact for tips
    contact_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    
    -- Verification
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by UUID REFERENCES public.users(id),
    verified_at TIMESTAMPTZ,
    
    -- Resolution
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Missing Persons
CREATE INDEX IF NOT EXISTS idx_missing_persons_status ON public.missing_persons(status);
CREATE INDEX IF NOT EXISTS idx_missing_persons_ngo_id ON public.missing_persons(ngo_id);
CREATE INDEX IF NOT EXISTS idx_missing_persons_reported_by ON public.missing_persons(reported_by);
CREATE INDEX IF NOT EXISTS idx_missing_persons_city ON public.missing_persons(last_seen_city);
CREATE INDEX IF NOT EXISTS idx_missing_persons_created_at ON public.missing_persons(created_at);

-- ============================================================
-- Missing Person Sighting Reports
-- ============================================================

CREATE TABLE IF NOT EXISTS public.missing_person_sightings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    missing_person_id UUID NOT NULL REFERENCES public.missing_persons(id) ON DELETE CASCADE,
    reported_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Sighting details
    sighting_date DATE NOT NULL,
    sighting_time TIME,
    sighting_location TEXT,
    sighting_city TEXT,
    sighting_state TEXT,
    sighting_coordinates JSONB,
    
    -- Description
    description TEXT,
    person_appearance TEXT,
    
    -- Contact for follow-up
    contact_phone TEXT,
    contact_email TEXT,
    
    -- Status
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_missing_person_sightings_missing_person_id ON public.missing_person_sightings(missing_person_id);
CREATE INDEX IF NOT EXISTS idx_missing_person_sightings_reported_by ON public.missing_person_sightings(reported_by);

-- ============================================================
-- RLS Policies for Missing Persons
-- ============================================================

-- Missing Persons RLS
ALTER TABLE public.missing_persons ENABLE ROW LEVEL SECURITY;

-- Anyone can read verified missing persons
CREATE POLICY "Anyone can read verified missing persons"
    ON public.missing_persons FOR SELECT
    TO anon, authenticated
    USING (is_verified = true);

-- NGO members can manage their NGO's missing persons
CREATE POLICY "NGO members can manage missing persons"
    ON public.missing_persons FOR ALL
    TO authenticated
    USING (
        ngo_id IN (
            SELECT ngo_id FROM public.ngo_members 
            WHERE user_id = auth.uid()
        )
    );

-- Users can create missing persons reports
CREATE POLICY "Users can create missing persons"
    ON public.missing_persons FOR INSERT
    TO authenticated
    WITH CHECK (reported_by = auth.uid());

-- Missing Person Sightings RLS
ALTER TABLE public.missing_person_sightings ENABLE ROW LEVEL SECURITY;

-- Anyone can read verified sightings
CREATE POLICY "Anyone can read verified sightings"
    ON public.missing_person_sightings FOR SELECT
    TO anon, authenticated
    USING (is_verified = true);

-- Authenticated users can create sightings
CREATE POLICY "Users can create sightings"
    ON public.missing_person_sightings FOR INSERT
    TO authenticated
    WITH CHECK (reported_by = auth.uid());

-- ============================================================
-- Update Post Comments Trigger Function
-- ============================================================

CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.posts 
        SET comments_count = comments_count + 1 
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.posts 
        SET comments_count = comments_count - 1 
        WHERE id = OLD.post_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for post_comments
DROP TRIGGER IF EXISTS trigger_update_post_comments_count ON public.post_comments;
CREATE TRIGGER trigger_update_post_comments_count
    AFTER INSERT OR DELETE ON public.post_comments
    FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- ============================================================
-- Update Event Attendees Trigger Function
-- ============================================================

CREATE OR REPLACE FUNCTION update_event_attendees_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'REGISTERED' THEN
        UPDATE public.events 
        SET current_attendees = current_attendees + 1 
        WHERE id = NEW.event_id;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'REGISTERED' THEN
        UPDATE public.events 
        SET current_attendees = current_attendees - 1 
        WHERE id = OLD.event_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'REGISTERED' AND NEW.status = 'REGISTERED' THEN
            UPDATE public.events 
            SET current_attendees = current_attendees + 1 
            WHERE id = NEW.event_id;
        ELSIF OLD.status = 'REGISTERED' AND NEW.status = 'CANCELLED' THEN
            UPDATE public.events 
            SET current_attendees = current_attendees - 1 
            WHERE id = NEW.event_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for event_registrations
DROP TRIGGER IF EXISTS trigger_update_event_attendees ON public.event_registrations;
CREATE TRIGGER trigger_update_event_attendees
    AFTER INSERT OR DELETE OR UPDATE ON public.event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_event_attendees_count();
