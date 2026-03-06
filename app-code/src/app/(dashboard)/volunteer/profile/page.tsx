'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface VolunteerStats { hours: number; tasks: number; ngos: number; }
interface Achievement { id: string; title: string; icon: string; description: string; }

export default function VolunteerProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<VolunteerStats>({ hours: 0, tasks: 0, ngos: 0 });
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchProfile(); }, []);

    async function fetchProfile() {
        try {
            const supabase = createClient();
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return;

            const { data: userData } = await supabase.from('users').select('*').eq('id', authUser.id).single();
            setUser(userData);

            // Fetch completed assignments via API route to bypass RLS recursion
            let assignments: any[] = [];
            try {
                const res = await fetch('/api/volunteer/assignments?type=completed&limit=100');
                const json = await res.json();
                assignments = json.data || [];
            } catch (e) { console.error('Failed to fetch assignments:', e); }

            if (assignments.length > 0) {
                const totalHours = assignments.reduce((acc: number, curr: any) => acc + (curr.hours_logged || 0), 0);
                const uniqueNgos = new Set(assignments.map((a: any) => a.request_id).filter(Boolean));
                setStats({ hours: totalHours, tasks: assignments.length, ngos: uniqueNgos.size });
            }

            const { data: achievementsData } = await supabase.from('achievements').select('*').eq('user_id', authUser.id);
            if (achievementsData) setAchievements(achievementsData as any[]);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
            </div>
        );
    }

    if (!user) return null;

    const joinDate = new Date(user.created_at).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    const cardStyle = {
        background: '#fff', borderRadius: 16, padding: 24,
        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* ── Hero Banner ── */}
            <div style={{
                borderRadius: 20, overflow: 'hidden', position: 'relative',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            }}>
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.08,
                    backgroundImage: 'radial-gradient(circle at 20% 50%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 80% 50%, #1de2d1 0%, transparent 50%)',
                }} />

                <div style={{ position: 'relative', zIndex: 1, padding: '36px 40px', display: 'flex', alignItems: 'center', gap: 28 }}>
                    <div style={{
                        width: 100, height: 100, borderRadius: '50%', flexShrink: 0,
                        background: user.avatar_url
                            ? `url("${user.avatar_url}") center/cover`
                            : 'linear-gradient(135deg, #8b5cf6, #1de2d1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 40, fontWeight: 900,
                        border: '3px solid rgba(255,255,255,0.15)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    }}>
                        {!user.avatar_url && (user.full_name?.charAt(0) || 'V')}
                    </div>

                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                            {user.full_name}
                        </h1>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{user.email}</p>
                        <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                            <span style={{
                                padding: '4px 12px', borderRadius: 999,
                                background: 'rgba(139,92,246,0.15)', color: '#a78bfa',
                                fontSize: 12, fontWeight: 600,
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>volunteer_activism</span>
                                Volunteer
                            </span>
                            <span style={{
                                padding: '4px 12px', borderRadius: 999,
                                background: user.availability ? 'rgba(22,163,106,0.15)' : 'rgba(148,163,184,0.15)',
                                color: user.availability ? '#16a34a' : '#94a3b8',
                                fontSize: 12, fontWeight: 600,
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                                    {user.availability ? 'check_circle' : 'do_not_disturb'}
                                </span>
                                {user.availability ? 'Available' : 'Unavailable'}
                            </span>
                            <span style={{
                                padding: '4px 12px', borderRadius: 999,
                                background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)',
                                fontSize: 12, fontWeight: 600,
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_today</span>
                                Since {joinDate}
                            </span>
                        </div>
                    </div>

                    <Link href="/volunteer/profile/edit" style={{
                        padding: '10px 20px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff', fontSize: 13, fontWeight: 700,
                        textDecoration: 'none', display: 'inline-flex',
                        alignItems: 'center', gap: 6, flexShrink: 0,
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                        Edit Profile
                    </Link>
                </div>
            </div>

            {/* ── Stats ── */}
            <div className="r-grid-3">
                {[
                    { icon: 'schedule', label: 'Hours Contributed', value: stats.hours.toString(), color: '#1de2d1', sub: 'Total volunteering time' },
                    { icon: 'task_alt', label: 'Tasks Completed', value: stats.tasks.toString(), color: '#f59e0b', sub: 'Resolved requests' },
                    { icon: 'apartment', label: 'NGOs Helped', value: stats.ngos.toString(), color: '#8b5cf6', sub: 'Unique organizations' },
                ].map(s => (
                    <div key={s.label} style={cardStyle}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: `${s.color}12`, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 22, color: s.color }}>{s.icon}</span>
                        </div>
                        <p style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{s.value}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginTop: 2 }}>{s.label}</p>
                        <p style={{ fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* ── Two Columns ── */}
            <div className="r-two-col">
                {/* Left: Personal Info + Skills */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Personal Info */}
                    <div style={cardStyle}>
                        <h3 style={{
                            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 16,
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>
                            Personal Information
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {[
                                { icon: 'badge', label: 'Full Name', value: user.full_name },
                                { icon: 'mail', label: 'Email', value: user.email },
                                { icon: 'phone', label: 'Phone', value: user.phone },
                                { icon: 'location_on', label: 'Location', value: user.location },
                            ].filter(r => r.value).map(r => (
                                <div key={r.label} style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '12px 0', borderBottom: '1px solid #f1f5f9',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#94a3b8' }}>{r.icon}</span>
                                    <div>
                                        <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{r.label}</p>
                                        <p style={{ fontSize: 14, fontWeight: 500, color: '#0f172a', marginTop: 2 }}>{r.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {user.bio && (
                            <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: '#f8fafc' }}>
                                <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>About</p>
                                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{user.bio}</p>
                            </div>
                        )}
                    </div>

                    {/* Skills */}
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{
                                fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                                letterSpacing: '0.08em', color: '#94a3b8',
                                display: 'flex', alignItems: 'center', gap: 8,
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>construction</span>
                                Skills
                            </h3>
                            <Link href="/volunteer/profile/edit" style={{ fontSize: 12, fontWeight: 600, color: '#1de2d1', textDecoration: 'none' }}>+ Add</Link>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {user.skills && user.skills.length > 0 ? (
                                user.skills.map((skill: string) => (
                                    <span key={skill} style={{
                                        padding: '6px 14px', borderRadius: 999,
                                        background: 'rgba(29,226,209,0.08)',
                                        color: '#0d9488', fontSize: 13, fontWeight: 600,
                                        border: '1px solid rgba(29,226,209,0.2)',
                                    }}>{skill}</span>
                                ))
                            ) : (
                                <p style={{ fontSize: 13, color: '#94a3b8' }}>No skills added yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Achievements + Quick Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Achievements */}
                    <div style={cardStyle}>
                        <h3 style={{
                            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 16,
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>emoji_events</span>
                            Achievements
                        </h3>
                        {achievements.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
                                {achievements.map(a => (
                                    <div key={a.id} style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        padding: 16, borderRadius: 12, background: '#fafbfc',
                                    }}>
                                        <div style={{
                                            width: 52, height: 52, borderRadius: '50%',
                                            background: '#fef3c7', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            fontSize: 22, marginBottom: 8,
                                        }}>{a.icon || '🏆'}</div>
                                        <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'center', lineHeight: 1.3, color: '#0f172a' }}>{a.title}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 24 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#fef3c7' }}>emoji_events</span>
                                <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 8 }}>No achievements yet. Keep volunteering!</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div style={cardStyle}>
                        <h3 style={{
                            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 16,
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>link</span>
                            Quick Actions
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { icon: 'explore', label: 'Find Opportunities', href: '/volunteer/opportunities', color: '#1de2d1' },
                                { icon: 'assignment_turned_in', label: 'My Assignments', href: '/volunteer/assignments', color: '#3b82f6' },
                                { icon: 'map', label: 'Map View', href: '/volunteer/opportunities/map', color: '#f59e0b' },
                                { icon: 'edit', label: 'Edit Profile', href: '/volunteer/profile/edit', color: '#8b5cf6' },
                            ].map(link => (
                                <Link key={link.href} href={link.href} style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '12px 14px', borderRadius: 12, textDecoration: 'none',
                                    background: '#fafbfc', transition: 'background 200ms',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#fafbfc'}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: link.color }}>{link.icon}</span>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{link.label}</span>
                                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#cbd5e1', marginLeft: 'auto' }}>chevron_right</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
