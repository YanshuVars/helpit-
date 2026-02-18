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

    // Protected routes
    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register') ||
        request.nextUrl.pathname.startsWith('/forgot-password') ||
        request.nextUrl.pathname.startsWith('/reset-password');

    const isDashboardRoute = request.nextUrl.pathname.startsWith('/ngo') ||
        request.nextUrl.pathname.startsWith('/volunteer') ||
        request.nextUrl.pathname.startsWith('/donor') ||
        request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/messages') ||
        request.nextUrl.pathname.startsWith('/notifications') ||
        request.nextUrl.pathname.startsWith('/settings');

    if (isAuthRoute && user) {
        // User is logged in, redirect to appropriate dashboard
        const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        const role = profile?.role || 'INDIVIDUAL';
        const redirectPath = getDashboardPath(role);

        const url = request.nextUrl.clone();
        url.pathname = redirectPath;
        return NextResponse.redirect(url);
    }

    if (isDashboardRoute && !user) {
        // User is not logged in, redirect to login
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    // Role-based access control for admin routes
    if (request.nextUrl.pathname.startsWith('/admin') && user) {
        const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'PLATFORM_ADMIN') {
            const url = request.nextUrl.clone();
            url.pathname = '/ngo';
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
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
