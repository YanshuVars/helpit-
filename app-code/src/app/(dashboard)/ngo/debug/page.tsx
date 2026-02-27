'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function NgoDebugPage() {
    const [results, setResults] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function diagnose() {
            const supabase = createClient();
            const out: Record<string, any> = {};

            // 1. Auth user
            const { data: { user }, error: authErr } = await supabase.auth.getUser();
            out['1_auth'] = { userId: user?.id, email: user?.email, error: authErr?.message };

            if (!user) {
                out['STOPPED'] = 'Not authenticated';
                setResults(out);
                setLoading(false);
                return;
            }

            // 2. public.users row
            const { data: userData, error: userErr } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id);
            out['2_users_table'] = { data: userData, error: userErr?.message };

            // 3. ngo_members for this user
            const { data: members, error: memErr } = await supabase
                .from('ngo_members')
                .select('*')
                .eq('user_id', user.id);
            out['3_ngo_members'] = { data: members, error: memErr?.message, code: memErr?.code, details: memErr?.details, hint: memErr?.hint };

            // 4. ALL ngo_members rows (first 10)
            const { data: allMembers, error: allMemErr } = await supabase
                .from('ngo_members')
                .select('*')
                .limit(10);
            out['4_all_ngo_members'] = { data: allMembers, error: allMemErr?.message, code: allMemErr?.code };

            // 5. All NGOs
            const { data: ngos, error: ngoErr } = await supabase
                .from('ngos')
                .select('id, name, email, created_by, status')
                .limit(10);
            out['5_all_ngos'] = { data: ngos, error: ngoErr?.message };

            // 6. NGO matching user email
            if (user.email) {
                const { data: emailMatch, error: emailErr } = await supabase
                    .from('ngos')
                    .select('id, name, email')
                    .eq('email', user.email);
                out['6_ngo_by_email'] = { data: emailMatch, error: emailErr?.message };
            }

            // 7. NGO by created_by
            const { data: createdBy, error: cbErr } = await supabase
                .from('ngos')
                .select('id, name')
                .eq('created_by', user.id);
            out['7_ngo_by_created_by'] = { data: createdBy, error: cbErr?.message };

            setResults(out);
            setLoading(false);
        }
        diagnose();
    }, []);

    if (loading) return <div style={{ padding: 40 }}>Loading diagnostic data...</div>;

    return (
        <div style={{ padding: 30, fontFamily: 'monospace', fontSize: 13 }}>
            <h2 style={{ marginBottom: 20 }}>NGO Debug Diagnostic</h2>
            <p style={{ color: '#64748b', marginBottom: 20 }}>
                This page shows exactly what the database returns for the current logged-in user.
                Share this information for debugging.
            </p>
            {Object.entries(results).map(([key, value]) => (
                <div key={key} style={{
                    marginBottom: 16, padding: 16,
                    background: '#f8fafc', borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    overflow: 'auto',
                }}>
                    <h4 style={{ color: '#0f172a', marginBottom: 8 }}>{key}</h4>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: '#334155' }}>
                        {JSON.stringify(value, null, 2)}
                    </pre>
                </div>
            ))}
        </div>
    );
}
