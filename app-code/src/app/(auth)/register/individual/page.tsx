'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/api/users";

export default function IndividualRegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            await signUp(formData.email, formData.password, {
                full_name: formData.fullName,
                phone: formData.phone || null,
                role: 'DONOR',
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

            <h1>Create Donor Account</h1>
            <p className="auth-subtitle">Discover NGOs and make donations</p>

            {error && (
                <div className="alert alert-error" style={{ marginBottom: 16 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                    <label className="field-label">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Enter your name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="field-input"
                    />
                </div>

                <div className="form-group">
                    <label className="field-label">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="field-input"
                    />
                </div>

                <div className="form-group">
                    <label className="field-label">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone (optional)"
                        value={formData.phone}
                        onChange={handleChange}
                        className="field-input"
                    />
                </div>

                <div className="form-group">
                    <label className="field-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Min 8 characters"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                        className="field-input"
                    />
                </div>

                <div className="form-group">
                    <label className="field-label">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="field-input"
                    />
                </div>

                <button type="submit" disabled={loading} className="auth-submit-btn">
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-text-muted)', marginTop: 20 }}>
                Already have an account?{" "}
                <Link href="/login" className="auth-link" style={{ fontWeight: 600 }}>Sign in</Link>
            </p>
        </>
    );
}
