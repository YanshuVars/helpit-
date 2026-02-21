"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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

            const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single();
            setUser(userData);

            const { data: assignments } = await supabase.from("volunteer_assignments")
                .select("hours_logged, request:help_requests(ngo_id)").eq("volunteer_id", authUser.id).eq("status", "COMPLETED");

            if (assignments) {
                const totalHours = assignments.reduce((acc, curr) => acc + (curr.hours_logged || 0), 0);
                const uniqueNgos = new Set(assignments.map((a: any) => a.request?.ngo_id).filter(Boolean));
                setStats({ hours: totalHours, tasks: assignments.length, ngos: uniqueNgos.size });
            }

            const { data: achievementsData } = await supabase.from("achievements").select("*").eq("user_id", authUser.id);
            if (achievementsData) setAchievements(achievementsData as any[]);
        } catch (error) {
            console.error("Error fetching profile:", error);
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Header */}
            <div>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>My Profile</h2>
                <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>Your volunteer identity and impact.</p>
            </div>

            <div className="r-side-main" style={{ alignItems: 'start' }}>
                {/* Left: Profile Card */}
                <div style={{
                    background: '#fff', borderRadius: 16, overflow: 'hidden',
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    position: 'sticky', top: 80,
                }}>
                    {/* Cover */}
                    <div style={{ height: 80, background: 'linear-gradient(135deg, #1de2d1, #0ea5e9)', position: 'relative' }}>
                        <div style={{
                            position: 'absolute', bottom: -36, left: '50%', transform: 'translateX(-50%)',
                            width: 72, height: 72, borderRadius: '50%',
                            background: user.avatar_url ? `url("${user.avatar_url}") center/cover` : 'linear-gradient(135deg, #1de2d1, #0ea5e9)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: 28, fontWeight: 800,
                            border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}>
                            {!user.avatar_url && (user.full_name?.charAt(0) || "U")}
                        </div>
                    </div>

                    <div style={{ padding: '48px 24px 24px', textAlign: 'center' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{user.full_name}</h3>
                        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{user.email}</p>

                        <Link href="/volunteer/profile/edit" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            marginTop: 16, padding: '9px 20px', borderRadius: 10,
                            border: '1.5px solid #1de2d1', background: 'rgba(29,226,209,0.05)',
                            color: '#0d9488', fontSize: 13, fontWeight: 700, textDecoration: 'none',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* Right: Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Stats */}
                    <div className="r-grid-3">
                        {[
                            { icon: 'schedule', label: 'Hours', value: stats.hours, color: '#1de2d1' },
                            { icon: 'task_alt', label: 'Tasks Done', value: stats.tasks, color: '#f59e0b' },
                            { icon: 'apartment', label: 'NGOs Helped', value: stats.ngos, color: '#8b5cf6' },
                        ].map(s => (
                            <div key={s.label} style={{
                                background: '#fff', padding: 22, borderRadius: 16,
                                border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 22, color: s.color }}>{s.icon}</span>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
                                </div>
                                <p style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Skills */}
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: 24,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20, verticalAlign: 'middle', marginRight: 8, color: '#1de2d1' }}>construction</span>
                                Skills
                            </h3>
                            <Link href="/volunteer/profile/edit" style={{ fontSize: 13, fontWeight: 600, color: '#1de2d1', textDecoration: 'none' }}>+ Add</Link>
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

                    {/* Achievements */}
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: 24,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20, verticalAlign: 'middle', marginRight: 8, color: '#f59e0b' }}>emoji_events</span>
                            Achievements
                        </h3>
                        {achievements.length > 0 ? (
                            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 4 }}>
                                {achievements.map(a => (
                                    <div key={a.id} style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        minWidth: 88, flexShrink: 0, padding: 12,
                                    }}>
                                        <div style={{
                                            width: 52, height: 52, borderRadius: '50%',
                                            background: '#fef3c7', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            fontSize: 22, marginBottom: 8,
                                        }}>{a.icon || "🏆"}</div>
                                        <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'center', lineHeight: 1.3, color: '#0f172a' }}>{a.title}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ fontSize: 13, color: '#94a3b8' }}>No achievements yet. Keep volunteering!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
