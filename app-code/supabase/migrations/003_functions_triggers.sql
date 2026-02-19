-- ============================================================
-- Helpit NGO Platform - Database Functions & Triggers
-- Migration: 003_functions_triggers.sql
-- ============================================================

-- ============================================================
-- AUTO-UPDATE TIMESTAMPS
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER ngos_updated_at
    BEFORE UPDATE ON public.ngos
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER help_requests_updated_at
    BEFORE UPDATE ON public.help_requests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER request_comments_updated_at
    BEFORE UPDATE ON public.request_comments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER volunteer_assignments_updated_at
    BEFORE UPDATE ON public.volunteer_assignments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER post_comments_updated_at
    BEFORE UPDATE ON public.post_comments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER donations_updated_at
    BEFORE UPDATE ON public.donations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER resources_updated_at
    BEFORE UPDATE ON public.resources
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER resource_requests_updated_at
    BEFORE UPDATE ON public.resource_requests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER chats_updated_at
    BEFORE UPDATE ON public.chats
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER notification_preferences_updated_at
    BEFORE UPDATE ON public.notification_preferences
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER reports_updated_at
    BEFORE UPDATE ON public.reports
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (
        id,
        email,
        full_name,
        role,
        status
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'INDIVIDUAL'),
        'ACTIVE'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- AUTO-CREATE NOTIFICATION PREFERENCES ON USER CREATION
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notification_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_created_preferences
    AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_preferences();

-- ============================================================
-- POST LIKES COUNT MANAGEMENT
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_post_like_insert()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_post_like_delete()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.posts
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = OLD.post_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_like_insert
    AFTER INSERT ON public.post_likes
    FOR EACH ROW EXECUTE FUNCTION public.handle_post_like_insert();

CREATE TRIGGER on_post_like_delete
    AFTER DELETE ON public.post_likes
    FOR EACH ROW EXECUTE FUNCTION public.handle_post_like_delete();

-- ============================================================
-- POST COMMENTS COUNT MANAGEMENT
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_post_comment_insert()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_post_comment_delete()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.posts
    SET comments_count = GREATEST(comments_count - 1, 0)
    WHERE id = OLD.post_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_comment_insert
    AFTER INSERT ON public.post_comments
    FOR EACH ROW EXECUTE FUNCTION public.handle_post_comment_insert();

CREATE TRIGGER on_post_comment_delete
    AFTER DELETE ON public.post_comments
    FOR EACH ROW EXECUTE FUNCTION public.handle_post_comment_delete();

-- ============================================================
-- EVENT ATTENDEES COUNT MANAGEMENT
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_event_registration_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'REGISTERED' THEN
        UPDATE public.events
        SET current_attendees = current_attendees + 1
        WHERE id = NEW.event_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_event_registration_update()
RETURNS TRIGGER AS $$
BEGIN
    -- If cancelled, decrement count
    IF NEW.status = 'CANCELLED' AND OLD.status = 'REGISTERED' THEN
        UPDATE public.events
        SET current_attendees = GREATEST(current_attendees - 1, 0)
        WHERE id = NEW.event_id;
    -- If re-registered, increment count
    ELSIF NEW.status = 'REGISTERED' AND OLD.status = 'CANCELLED' THEN
        UPDATE public.events
        SET current_attendees = current_attendees + 1
        WHERE id = NEW.event_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_event_registration_insert
    AFTER INSERT ON public.event_registrations
    FOR EACH ROW EXECUTE FUNCTION public.handle_event_registration_insert();

CREATE TRIGGER on_event_registration_update
    AFTER UPDATE ON public.event_registrations
    FOR EACH ROW EXECUTE FUNCTION public.handle_event_registration_update();

-- ============================================================
-- NGO STATS MANAGEMENT
-- ============================================================

-- Update NGO volunteer count when members change
CREATE OR REPLACE FUNCTION public.handle_ngo_member_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.ngos
        SET total_volunteers = (
            SELECT COUNT(*) FROM public.ngo_members
            WHERE ngo_id = NEW.ngo_id
        )
        WHERE id = NEW.ngo_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.ngos
        SET total_volunteers = (
            SELECT COUNT(*) FROM public.ngo_members
            WHERE ngo_id = OLD.ngo_id
        )
        WHERE id = OLD.ngo_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_ngo_member_insert
    AFTER INSERT ON public.ngo_members
    FOR EACH ROW EXECUTE FUNCTION public.handle_ngo_member_change();

CREATE TRIGGER on_ngo_member_delete
    AFTER DELETE ON public.ngo_members
    FOR EACH ROW EXECUTE FUNCTION public.handle_ngo_member_change();

-- Update NGO donation count when donation completed
CREATE OR REPLACE FUNCTION public.handle_donation_completed()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'COMPLETED' AND (OLD.status IS NULL OR OLD.status != 'COMPLETED') THEN
        UPDATE public.ngos
        SET total_donations = total_donations + 1
        WHERE id = NEW.ngo_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_donation_completed
    AFTER INSERT OR UPDATE ON public.donations
    FOR EACH ROW EXECUTE FUNCTION public.handle_donation_completed();

-- Update NGO resolved requests count
CREATE OR REPLACE FUNCTION public.handle_request_completed()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'COMPLETED' AND (OLD.status IS NULL OR OLD.status != 'COMPLETED') THEN
        UPDATE public.ngos
        SET total_requests_resolved = total_requests_resolved + 1
        WHERE id = NEW.ngo_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_request_completed
    AFTER INSERT OR UPDATE ON public.help_requests
    FOR EACH ROW EXECUTE FUNCTION public.handle_request_completed();

-- ============================================================
-- RESOURCE LOW STOCK MANAGEMENT
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_resource_stock_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.is_low_stock = (NEW.quantity <= NEW.min_quantity);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_resource_update
    BEFORE INSERT OR UPDATE ON public.resources
    FOR EACH ROW EXECUTE FUNCTION public.handle_resource_stock_update();

-- ============================================================
-- VOLUNTEER ASSIGNMENT COUNT ON REQUESTS
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_assignment_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.help_requests
        SET volunteers_assigned = (
            SELECT COUNT(*) FROM public.volunteer_assignments
            WHERE request_id = NEW.request_id
            AND status NOT IN ('CANCELLED')
        )
        WHERE id = NEW.request_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE public.help_requests
        SET volunteers_assigned = (
            SELECT COUNT(*) FROM public.volunteer_assignments
            WHERE request_id = NEW.request_id
            AND status NOT IN ('CANCELLED')
        )
        WHERE id = NEW.request_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.help_requests
        SET volunteers_assigned = (
            SELECT COUNT(*) FROM public.volunteer_assignments
            WHERE request_id = OLD.request_id
            AND status NOT IN ('CANCELLED')
        )
        WHERE id = OLD.request_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_assignment_insert
    AFTER INSERT ON public.volunteer_assignments
    FOR EACH ROW EXECUTE FUNCTION public.handle_assignment_change();

CREATE TRIGGER on_assignment_update
    AFTER UPDATE ON public.volunteer_assignments
    FOR EACH ROW EXECUTE FUNCTION public.handle_assignment_change();

CREATE TRIGGER on_assignment_delete
    AFTER DELETE ON public.volunteer_assignments
    FOR EACH ROW EXECUTE FUNCTION public.handle_assignment_change();

-- ============================================================
-- DONATION RECEIPT NUMBER GENERATION
-- ============================================================

CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS TRIGGER AS $$
DECLARE
    year_str TEXT;
    seq_num INTEGER;
    receipt TEXT;
BEGIN
    IF NEW.status = 'COMPLETED' AND NEW.receipt_number IS NULL THEN
        year_str := TO_CHAR(NOW(), 'YYYY');
        SELECT COUNT(*) + 1 INTO seq_num
        FROM public.donations
        WHERE status = 'COMPLETED'
        AND EXTRACT(YEAR FROM completed_at) = EXTRACT(YEAR FROM NOW());
        
        receipt := 'HLP-' || year_str || '-' || LPAD(seq_num::TEXT, 6, '0');
        NEW.receipt_number := receipt;
        NEW.completed_at := COALESCE(NEW.completed_at, NOW());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_donation_receipt
    BEFORE INSERT OR UPDATE ON public.donations
    FOR EACH ROW EXECUTE FUNCTION public.generate_receipt_number();

-- ============================================================
-- AUDIT LOG HELPER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_audit_log(
    p_actor_id UUID,
    p_actor_role TEXT,
    p_action TEXT,
    p_category TEXT,
    p_target_type TEXT DEFAULT NULL,
    p_target_id UUID DEFAULT NULL,
    p_details TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.audit_logs (
        actor_id,
        actor_role,
        action,
        category,
        target_type,
        target_id,
        details,
        metadata
    ) VALUES (
        p_actor_id,
        p_actor_role,
        p_action,
        p_category,
        p_target_type,
        p_target_id,
        p_details,
        p_metadata
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- INCREMENT FUNCTION (for atomic counter updates)
-- ============================================================

CREATE OR REPLACE FUNCTION public.increment_volunteers_assigned(request_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.help_requests
    SET volunteers_assigned = volunteers_assigned + 1
    WHERE id = request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SEARCH NGOS BY LOCATION (PostGIS-like using coordinates)
-- ============================================================

CREATE OR REPLACE FUNCTION public.search_ngos_by_location(
    lat DECIMAL,
    lng DECIMAL,
    radius_km INTEGER DEFAULT 50,
    result_limit INTEGER DEFAULT 20
)
RETURNS SETOF public.ngos AS $$
DECLARE
    lat_delta DECIMAL;
    lng_delta DECIMAL;
BEGIN
    -- Approximate degree conversion (1 degree ≈ 111 km)
    lat_delta := radius_km / 111.0;
    lng_delta := radius_km / (111.0 * COS(RADIANS(lat)));
    
    RETURN QUERY
    SELECT n.*
    FROM public.ngos n
    WHERE n.status = 'VERIFIED'
    AND n.verification_status = 'APPROVED'
    AND n.coordinates IS NOT NULL
    AND (n.coordinates->>'coordinates')::JSONB->>1 IS NOT NULL
    AND ABS((n.coordinates->'coordinates'->>1)::DECIMAL - lat) <= lat_delta
    AND ABS((n.coordinates->'coordinates'->>0)::DECIMAL - lng) <= lng_delta
    ORDER BY (
        POWER((n.coordinates->'coordinates'->>1)::DECIMAL - lat, 2) +
        POWER((n.coordinates->'coordinates'->>0)::DECIMAL - lng, 2)
    ) ASC
    LIMIT result_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- GET USER'S NGO (for NGO members)
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_user_ngo(user_uuid UUID)
RETURNS TABLE(ngo_id UUID, ngo_name TEXT, user_role user_role) AS $$
BEGIN
    RETURN QUERY
    SELECT nm.ngo_id, n.name, nm.role
    FROM public.ngo_members nm
    JOIN public.ngos n ON n.id = nm.ngo_id
    WHERE nm.user_id = user_uuid
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- GET VOLUNTEER STATS
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_volunteer_stats(volunteer_uuid UUID)
RETURNS TABLE(
    total_assignments BIGINT,
    completed_assignments BIGINT,
    total_hours DECIMAL,
    achievements_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(va.id) AS total_assignments,
        COUNT(va.id) FILTER (WHERE va.status = 'COMPLETED') AS completed_assignments,
        COALESCE(SUM(va.hours_logged) FILTER (WHERE va.status = 'COMPLETED'), 0) AS total_hours,
        (SELECT COUNT(*) FROM public.achievements WHERE user_id = volunteer_uuid) AS achievements_count
    FROM public.volunteer_assignments va
    WHERE va.volunteer_id = volunteer_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- GET NGO STATS
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_ngo_stats(ngo_uuid UUID)
RETURNS TABLE(
    open_requests BIGINT,
    in_progress_requests BIGINT,
    completed_requests BIGINT,
    volunteer_count BIGINT,
    total_donations BIGINT,
    total_amount DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(hr.id) FILTER (WHERE hr.status = 'OPEN') AS open_requests,
        COUNT(hr.id) FILTER (WHERE hr.status = 'IN_PROGRESS') AS in_progress_requests,
        COUNT(hr.id) FILTER (WHERE hr.status = 'COMPLETED') AS completed_requests,
        (SELECT COUNT(*) FROM public.ngo_members WHERE ngo_id = ngo_uuid) AS volunteer_count,
        COUNT(d.id) FILTER (WHERE d.status = 'COMPLETED') AS total_donations,
        COALESCE(SUM(d.amount) FILTER (WHERE d.status = 'COMPLETED'), 0) AS total_amount
    FROM public.help_requests hr
    FULL OUTER JOIN public.donations d ON d.ngo_id = ngo_uuid
    WHERE hr.ngo_id = ngo_uuid OR d.ngo_id = ngo_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- MARK EMAIL AS VERIFIED
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_email_verified()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        UPDATE public.users
        SET email_verified_at = NEW.email_confirmed_at
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_email_verified
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_email_verified();

-- ============================================================
-- UPDATE LAST ACTIVE
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_last_active(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.users
    SET last_active_at = NOW()
    WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
