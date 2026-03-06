'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

interface NgoContextValue {
    ngoId: string | null;
    userId: string | null;
    role: string | null;
    loading: boolean;
    error: string | null;
    isAdmin: boolean;
    isCoordinator: boolean;
    canWrite: boolean;
}

const NgoContext = createContext<NgoContextValue>({
    ngoId: null,
    userId: null,
    role: null,
    loading: true,
    error: null,
    isAdmin: false,
    isCoordinator: false,
    canWrite: false,
});

export function NgoProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<Omit<NgoContextValue, 'isAdmin' | 'isCoordinator' | 'canWrite'>>({
        ngoId: null,
        userId: null,
        role: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        async function loadNgoContext() {
            try {
                const supabase = createClient();
                const { data: { user }, error: authError } = await supabase.auth.getUser();

                if (authError || !user) {
                    setState({ ngoId: null, userId: null, role: null, loading: false, error: 'Not authenticated' });
                    return;
                }

                // Query ngo_members for this user
                const { data: members, error: memberError } = await supabase
                    .from('ngo_members')
                    .select('ngo_id, role')
                    .eq('user_id', user.id)
                    .limit(1);

                if (memberError) {
                    console.error('[NgoContext] ngo_members query error:', memberError);
                    setState({ ngoId: null, userId: user.id, role: null, loading: false, error: memberError.message });
                    return;
                }

                if (members && members.length > 0) {
                    setState({
                        ngoId: members[0].ngo_id,
                        userId: user.id,
                        role: members[0].role as string,
                        loading: false,
                        error: null,
                    });
                    return;
                }

                // Fallback: match NGO by user email (read-only — no auto-insert)
                if (user.email) {
                    const { data: ngoByEmail } = await supabase
                        .from('ngos')
                        .select('id')
                        .eq('email', user.email)
                        .limit(1);

                    if (ngoByEmail && ngoByEmail.length > 0) {
                        // Found an NGO matching this user's email, but don't auto-create membership.
                        // The membership should only be created during the registration flow.
                        setState({
                            ngoId: ngoByEmail[0].id,
                            userId: user.id,
                            role: 'NGO_ADMIN',
                            loading: false,
                            error: null,
                        });
                        return;
                    }
                }

                setState({ ngoId: null, userId: user.id, role: null, loading: false, error: 'No NGO membership found' });
            } catch (err) {
                console.error('[NgoContext] Error:', err);
                setState({ ngoId: null, userId: null, role: null, loading: false, error: 'Failed to load NGO context' });
            }
        }

        loadNgoContext();
    }, []);

    const isAdmin = state.role === 'NGO_ADMIN';
    const isCoordinator = state.role === 'NGO_COORDINATOR';
    const canWrite = isAdmin || isCoordinator;

    return (
        <NgoContext.Provider value={{ ...state, isAdmin, isCoordinator, canWrite }}>
            {children}
        </NgoContext.Provider>
    );
}

export function useNgoContext() {
    const context = useContext(NgoContext);
    if (context === undefined) {
        throw new Error('useNgoContext must be used within a NgoProvider');
    }
    return context;
}
