"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { missingPersonsApi } from "@/lib/api";
import { formatDistanceToNow } from "@/lib/utils";

interface MissingPerson {
    id: string;
    full_name: string;
    age: number | null;
    gender: string | null;
    photo_url: string | null;
    last_seen_location: string | null;
    last_seen_city: string | null;
    last_seen_state: string | null;
    last_seen_date: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}
