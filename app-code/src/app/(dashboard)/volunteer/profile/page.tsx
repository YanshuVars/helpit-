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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                    <Link href="/volunteer" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span> Back
                    </Link>
                    <h1 className="page-title">My Profile</h1>
                </div>
                <div className="dashboard-loading"><span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, color: 'var(--color-primary)' }}>progress_activity</span></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
                <Link href="/volunteer" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span> Back
                </Link>
                <h1 className="page-title">My Profile</h1>
            </div>

            {/* Profile Header */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{
                    width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', marginBottom: 12,
                    background: 'linear-gradient(135deg, var(--color-primary), #42A5F5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 28, fontWeight: 700,
                }}>
                    {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (user.full_name?.charAt(0) || "U")}
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>{user.full_name}</h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{user.email}</p>
                <Link href="/volunteer/profile/edit" style={{ marginTop: 8, color: 'var(--color-primary)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Edit Profile</Link>
            </div>

            {/* Stats */}
            <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[
                    { label: 'Hours', value: stats.hours },
                    { label: 'Tasks', value: stats.tasks },
                    { label: 'NGOs', value: stats.ngos },
                ].map(s => (
                    <div key={s.label} className="stat-card" style={{ minHeight: 80 }}>
                        <div className="stat-card-value">{s.value}</div>
                        <div className="stat-card-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Skills */}
            <div className="card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <h3 style={{ fontWeight: 600, fontSize: 15 }}>Skills</h3>
                    <Link href="/volunteer/profile/edit" style={{ color: 'var(--color-primary)', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>Add</Link>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {user.skills && user.skills.length > 0 ? (
                        user.skills.map((skill: string) => (
                            <span key={skill} style={{
                                padding: '4px 12px', borderRadius: 20, background: 'var(--color-primary-bg)',
                                color: 'var(--color-primary)', fontSize: 12, fontWeight: 500,
                            }}>{skill}</span>
                        ))
                    ) : (
                        <p style={{ fontSize: 13, color: 'var(--color-text-disabled)' }}>No skills added yet.</p>
                    )}
                </div>
            </div>

            {/* Achievements */}
            <div className="card" style={{ padding: 18 }}>
                <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 10 }}>Achievements</h3>
                {achievements.length > 0 ? (
                    <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 4 }}>
                        {achievements.map(a => (
                            <div key={a.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 72, flexShrink: 0 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: '50%', background: '#FFF8E1',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 4,
                                }}>{a.icon || "🏆"}</div>
                                <span style={{ fontSize: 10, textAlign: 'center', lineHeight: 1.3 }}>{a.title}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ fontSize: 13, color: 'var(--color-text-disabled)' }}>No achievements yet. Keep volunteering!</p>
                )}
            </div>
        </div>
    );
}
