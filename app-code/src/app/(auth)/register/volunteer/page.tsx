'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/api/users";

const SKILLS = ["First Aid", "Driving", "Teaching", "Cooking", "Counseling", "Photography", "Translation", "Construction"];
const AVAILABILITY_OPTIONS = ["Weekday Mornings", "Weekday Evenings", "Weekends", "On-Call"];

export default function VolunteerRegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
    });
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            await signUp(formData.email, formData.password, {
                full_name: formData.fullName,
                phone: formData.phone || null,
                role: 'VOLUNTEER',
                skills: selectedSkills,
                availability: false,
            });

            router.push('/verify-email');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Registration failed';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-[800px] px-6 py-8 overflow-y-auto">
            <div className="flex items-center justify-between pt-2 pb-6">
                <Link href="/register" className="p-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </Link>
                <h2 className="text-lg font-bold">Volunteer Signup</h2>
                <div className="w-10"></div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Enter your name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full h-14 rounded-xl border border-[var(--border)] px-4"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full h-14 rounded-xl border border-[var(--border)] px-4"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full h-14 rounded-xl border border-[var(--border)] px-4"
                    />
                </div>

                {/* Skills */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Skills</label>
                    <div className="flex flex-wrap gap-2">
                        {SKILLS.map(skill => (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => toggleSkill(skill)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${selectedSkills.includes(skill)
                                        ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                                        : 'border-[var(--border)] hover:bg-gray-50'
                                    }`}
                            >
                                <span className="text-sm">{skill}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Availability */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Availability</label>
                    <div className="flex flex-wrap gap-2">
                        {AVAILABILITY_OPTIONS.map(time => (
                            <label key={time} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] cursor-pointer hover:bg-gray-50">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">{time}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Create a password (min 8 chars)"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                        className="w-full h-14 rounded-xl border border-[var(--border)] px-4"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl mt-4 disabled:opacity-60"
                >
                    {loading ? 'Creating Account...' : 'Create Volunteer Account'}
                </button>
            </form>
        </div>
    );
}
