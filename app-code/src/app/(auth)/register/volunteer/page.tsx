'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/api/users";

const SKILLS = ["First Aid", "Driving", "Teaching", "Cooking", "Counseling", "Photography", "Translation", "Construction"];

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
        <>
            <Link href="/register" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 20, fontSize: 13 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
                Back to role selection
            </Link>

            <h1>Create Volunteer Account</h1>
            <p className="auth-subtitle">Find opportunities and help NGOs</p>

            {error && (
                <div className="alert alert-error" style={{ marginBottom: 16 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                    <label className="field-label">Full Name</label>
                    <input type="text" name="fullName" placeholder="Enter your name" value={formData.fullName} onChange={handleChange} required className="field-input" />
                </div>

                <div className="form-group">
                    <label className="field-label">Email Address</label>
                    <input type="email" name="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required className="field-input" />
                </div>

                <div className="form-group">
                    <label className="field-label">Phone Number</label>
                    <input type="tel" name="phone" placeholder="Enter your phone (optional)" value={formData.phone} onChange={handleChange} className="field-input" />
                </div>

                {/* Skills */}
                <div className="form-group">
                    <label className="field-label">Skills</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {SKILLS.map(skill => (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => toggleSkill(skill)}
                                className={selectedSkills.includes(skill) ? "badge badge-active" : "badge"}
                                style={{
                                    cursor: 'pointer',
                                    padding: '6px 14px',
                                    fontSize: 13,
                                    borderRadius: 'var(--radius-full)',
                                    border: selectedSkills.includes(skill) ? 'none' : '1px solid var(--color-border)',
                                    background: selectedSkills.includes(skill) ? 'var(--color-primary)' : 'transparent',
                                    color: selectedSkills.includes(skill) ? '#FFFFFF' : 'var(--color-text-body)',
                                    transition: 'all 150ms ease',
                                }}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label className="field-label">Password</label>
                    <input type="password" name="password" placeholder="Min 8 characters" value={formData.password} onChange={handleChange} required minLength={8} className="field-input" />
                </div>

                <button type="submit" disabled={loading} className="auth-submit-btn">
                    {loading ? 'Creating Account...' : 'Create Volunteer Account'}
                </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-text-muted)', marginTop: 20 }}>
                Already have an account?{" "}
                <Link href="/login" className="auth-link" style={{ fontWeight: 600 }}>Sign in</Link>
            </p>
        </>
    );
}
