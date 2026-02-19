// API Route: Auth Callback (for OAuth and email verification)
// GET /api/auth/callback
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Get user to determine redirect
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Get user role from database
                const { data: userData } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', user.id)
                    .single() as { data: { role: string } | null };

                // Redirect based on role
                if (userData?.role) {
                    const roleRedirects: Record<string, string> = {
                        'PLATFORM_ADMIN': '/admin',
                        'NGO_ADMIN': '/ngo',
                        'NGO_COORDINATOR': '/ngo',
                        'NGO_MEMBER': '/ngo',
                        'VOLUNTEER': '/volunteer',
                        'DONOR': '/donor',
                        'INDIVIDUAL': '/donor',
                    };

                    const redirectPath = roleRedirects[userData.role] || next;
                    return NextResponse.redirect(`${origin}${redirectPath}`);
                }
            }

            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
