import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Route classification
    const isAuthRoute = pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/forgot-password') ||
        pathname.startsWith('/reset-password');

    const isDashboardRoute = pathname.startsWith('/ngo') ||
        pathname.startsWith('/volunteer') ||
        pathname.startsWith('/donor') ||
        pathname.startsWith('/admin') ||
        pathname.startsWith('/messages') ||
        pathname.startsWith('/notifications') ||
        pathname.startsWith('/settings');

    // ── AUTH ROUTES: redirect logged-in users (except /register) ──
    if (isAuthRoute && user) {
        // Allow logged-in users to access /register to create new accounts
        if (pathname.startsWith('/register')) {
            return supabaseResponse;
        }

        // Redirect to correct dashboard
        const role = await getUserRole(supabase, user);
        const redirectPath = getDashboardPath(role);
        const url = request.nextUrl.clone();
        url.pathname = redirectPath;
        return NextResponse.redirect(url);
    }

    // ── DASHBOARD ROUTES: require login ──
    if (isDashboardRoute && !user) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // ── ROLE-BASED ACCESS CONTROL on dashboard routes ──
    if (isDashboardRoute && user) {
        const role = await getUserRole(supabase, user);

        // Admin routes: only PLATFORM_ADMIN
        if (pathname.startsWith('/admin') && role !== 'PLATFORM_ADMIN') {
            const url = request.nextUrl.clone();
            url.pathname = getDashboardPath(role);
            return NextResponse.redirect(url);
        }

        // NGO routes: only NGO_ADMIN / NGO_COORDINATOR / NGO_MEMBER
        if (pathname.startsWith('/ngo') && !['NGO_ADMIN', 'NGO_COORDINATOR', 'NGO_MEMBER'].includes(role)) {
            const url = request.nextUrl.clone();
            url.pathname = getDashboardPath(role);
            return NextResponse.redirect(url);
        }

        // Volunteer routes: only VOLUNTEER (and NGO roles for overlap)
        if (pathname.startsWith('/volunteer') && !['VOLUNTEER', 'NGO_ADMIN', 'NGO_COORDINATOR', 'NGO_MEMBER'].includes(role)) {
            const url = request.nextUrl.clone();
            url.pathname = getDashboardPath(role);
            return NextResponse.redirect(url);
        }

        // Donor routes: only DONOR / INDIVIDUAL
        if (pathname.startsWith('/donor') && !['DONOR', 'INDIVIDUAL'].includes(role)) {
            const url = request.nextUrl.clone();
            url.pathname = getDashboardPath(role);
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}

/**
 * Get user role — single DB query with auth metadata fallback.
 */
async function getUserRole(supabase: any, user: any): Promise<string> {
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    return profile?.role || user.user_metadata?.role || 'INDIVIDUAL';
}

function getDashboardPath(role: string): string {
    switch (role) {
        case 'PLATFORM_ADMIN':
            return '/admin';
        case 'NGO_ADMIN':
        case 'NGO_COORDINATOR':
        case 'NGO_MEMBER':
            return '/ngo';
        case 'VOLUNTEER':
            return '/volunteer';
        case 'DONOR':
        case 'INDIVIDUAL':
        default:
            return '/donor';
    }
}
