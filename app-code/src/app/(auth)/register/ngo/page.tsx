'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signUp } from "@/lib/api/users";

const CATEGORIES = [
    { value: "EDUCATION", label: "Education" },
    { value: "MEDICAL", label: "Healthcare" },
    { value: "ENVIRONMENT", label: "Environment" },
    { value: "FOOD", label: "Food & Nutrition" },
    { value: "SHELTER", label: "Shelter" },
    { value: "EMERGENCY", label: "Disaster Relief" },
    { value: "CHILD_CARE", label: "Child Care" },
    { value: "ELDERLY_CARE", label: "Elderly Care" },
    { value: "OTHER", label: "Other" },
];

export default function NGORegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        orgName: '',
        registrationNumber: '',
        category: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        city: '',
        state: '',
        adminEmail: '',
        adminPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.adminPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            // 1. Create admin user account
            const { user } = await signUp(formData.adminEmail, formData.adminPassword, {
                full_name: `${formData.orgName} Admin`,
                role: 'NGO_ADMIN',
            });

            if (!user) throw new Error('Failed to create admin account');

            // 2. Create NGO record
            const slug = generateSlug(formData.orgName);
            const supabaseClient = createClient();
            const { data: ngo, error: ngoError } = await supabaseClient
                .from('ngos')
                .insert({
                    name: formData.orgName,
                    slug,
                    email: formData.contactEmail,
                    phone: formData.contactPhone || null,
                    address: formData.address || null,
                    city: formData.city || null,
                    state: formData.state || null,
                    registration_number: formData.registrationNumber,
                    categories: formData.category ? [formData.category] : [],
                    tags: [],
                    status: 'PENDING',
                    verification_status: 'PENDING',
                    has_80g: false,
                    has_12a: false,
                    plan: 'FREE',
                    social_links: {},
                    country: 'India',
                } as Record<string, unknown>)
                .select()
                .single();

            if (ngoError || !ngo) throw new Error('Failed to create NGO');

            // 3. Add user as NGO admin member
            const supabase = createClient();
            await supabase.from('ngo_members').insert({
                ngo_id: ngo.id,
                user_id: user.id,
                role: 'NGO_ADMIN',
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
        <div style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: 4 }}>
            <Link href="/register" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 20, fontSize: 13 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
                Back to role selection
            </Link>

            <h1>Register Your NGO</h1>
            <p className="auth-subtitle">Set up your organization on Helpit</p>

            {error && (
                <div className="alert alert-error" style={{ marginBottom: 16 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Organization Info */}
                <div className="form-section">
                    <div className="form-section-title">Organization Details</div>
                    <div className="form-section-subtitle">Basic information about your NGO</div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="field-label">Organization Name</label>
                            <input type="text" name="orgName" placeholder="Enter NGO name" value={formData.orgName} onChange={handleChange} required className="field-input" />
                        </div>
                        <div className="form-group">
                            <label className="field-label">Registration Number</label>
                            <input type="text" name="registrationNumber" placeholder="NGO registration number" value={formData.registrationNumber} onChange={handleChange} required className="field-input" />
                        </div>
                        <div className="form-group">
                            <label className="field-label">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="field-input">
                                <option value="">Select category</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className="form-section">
                    <div className="form-section-title">Contact Information</div>
                    <div className="form-section-subtitle">How NGOs and users can reach you</div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="form-group">
                            <label className="field-label">Contact Email</label>
                            <input type="email" name="contactEmail" placeholder="org@email.com" value={formData.contactEmail} onChange={handleChange} required className="field-input" />
                        </div>
                        <div className="form-group">
                            <label className="field-label">Contact Phone</label>
                            <input type="tel" name="contactPhone" placeholder="Phone number" value={formData.contactPhone} onChange={handleChange} className="field-input" />
                        </div>
                        <div className="form-group">
                            <label className="field-label">City</label>
                            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="field-input" />
                        </div>
                        <div className="form-group">
                            <label className="field-label">State</label>
                            <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className="field-input" />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="field-label">Address</label>
                            <textarea name="address" placeholder="Full address" value={formData.address} onChange={handleChange} className="field-input field-textarea" rows={2} />
                        </div>
                    </div>
                </div>

                {/* Document Upload */}
                <div className="form-section">
                    <div className="form-section-title">Verification Documents</div>
                    <div style={{
                        border: '2px dashed var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '24px',
                        textAlign: 'center',
                        marginTop: 8,
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--color-text-muted)' }}>cloud_upload</span>
                        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>Upload registration certificate, 80G certificate</p>
                        <p style={{ fontSize: 11, color: 'var(--color-text-disabled)', marginTop: 2 }}>(Can be uploaded later from NGO settings)</p>
                    </div>
                </div>

                {/* Admin Account */}
                <div className="form-section" style={{ background: 'var(--color-primary-soft)', padding: 16, borderRadius: 'var(--radius-md)', border: 'none' }}>
                    <div className="form-section-title">Admin Account</div>
                    <div className="form-section-subtitle">Login credentials for the organization admin</div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="form-group">
                            <label className="field-label">Admin Email</label>
                            <input type="email" name="adminEmail" placeholder="admin@email.com" value={formData.adminEmail} onChange={handleChange} required className="field-input" />
                        </div>
                        <div className="form-group">
                            <label className="field-label">Admin Password</label>
                            <input type="password" name="adminPassword" placeholder="Min 8 characters" value={formData.adminPassword} onChange={handleChange} required minLength={8} className="field-input" />
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="auth-submit-btn">
                    {loading ? 'Submitting...' : 'Submit for Verification'}
                </button>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center' }}>
                    Your application will be reviewed within 2-3 business days
                </p>
            </form>
        </div>
    );
}
