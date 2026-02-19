"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface VolunteerStats {
    hours: number;
    tasks: number;
    ngos: number;
}

interface Achievement {
    id: string;
    title: string;
    icon: string;
    description: string;
}

export default function VolunteerProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<VolunteerStats>({ hours: 0, tasks: 0, ngos: 0 });
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const supabase = createClient();
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (!authUser) return;

            // Fetch user details
            const { data: userData } = await supabase
                .from("users")
                .select("*")
                .eq("id", authUser.id)
                .single();

            setUser(userData);

            // Fetch stats - Assignments
            const { data: assignments } = await supabase
                .from("volunteer_assignments")
                .select("hours_logged, request:help_requests(ngo_id)")
                .eq("volunteer_id", authUser.id)
                .eq("status", "COMPLETED");

            if (assignments) {
                const totalHours = assignments.reduce((acc, curr) => acc + (curr.hours_logged || 0), 0);
                const totalTasks = assignments.length;

                // Count unique NGOs
                const uniqueNgos = new Set(assignments.map((a: any) => a.request?.ngo_id).filter(Boolean));

                setStats({
                    hours: totalHours,
                    tasks: totalTasks,
                    ngos: uniqueNgos.size
                });
            }

            // Fetch achievements
            const { data: achievementsData } = await supabase
                .from("achievements")
                .select("*")
                .eq("user_id", authUser.id);

            if (achievementsData) {
                setAchievements(achievementsData as any[]);
            }

        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col gap-6">
                <PageHeader title="My Profile" showBack fallbackRoute="/volunteer" />
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="My Profile" showBack fallbackRoute="/volunteer" />

            {/* Profile Header */}
            <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-400 flex items-center justify-center text-white text-3xl font-bold mb-4 overflow-hidden">
                    {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                    ) : (
                        user.full_name?.charAt(0) || "U"
                    )}
                </div>
                <h2 className="text-xl font-bold">{user.full_name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <Link href="/volunteer/profile/edit" className="mt-3 text-[var(--primary)] text-sm font-semibold min-h-[44px]">Edit Profile</Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center justify-center p-5 min-h-[100px] bg-white rounded-xl border border-gray-200">
                    <p className="text-2xl font-bold">{stats.hours}</p>
                    <p className="text-xs text-gray-500 mt-1">Hours</p>
                </div>
                <div className="flex flex-col items-center justify-center p-5 min-h-[100px] bg-white rounded-xl border border-gray-200">
                    <p className="text-2xl font-bold">{stats.tasks}</p>
                    <p className="text-xs text-gray-500 mt-1">Tasks</p>
                </div>
                <div className="flex flex-col items-center justify-center p-5 min-h-[100px] bg-white rounded-xl border border-gray-200">
                    <p className="text-2xl font-bold">{stats.ngos}</p>
                    <p className="text-xs text-gray-500 mt-1">NGOs</p>
                </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Skills</h3>
                    <Link href="/volunteer/profile/edit" className="text-[var(--primary)] text-xs font-semibold">Add</Link>
                </div>
                <div className="flex flex-wrap gap-2">
                    {user.skills && user.skills.length > 0 ? (
                        user.skills.map((skill: string) => (
                            <span key={skill} className="px-3 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium">
                                {skill}
                            </span>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400">No skills added yet.</p>
                    )}
                </div>
            </div>

            {/* Achievements Preview */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Achievements</h3>
                </div>
                {achievements.length > 0 ? (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {achievements.map((achievement) => (
                            <div key={achievement.id} className="flex flex-col items-center min-w-[80px]">
                                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-xl mb-1">
                                    {achievement.icon || "🏆"}
                                </div>
                                <span className="text-[10px] text-center line-clamp-2">{achievement.title}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">No achievements yet. Keep volunteering!</p>
                )}
            </div>
        </div>
    );
}
