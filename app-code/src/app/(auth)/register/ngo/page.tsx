'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signUp } from "@/lib/api/users";

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
        <div className="flex flex-col min-h-[800px] px-6 py-8 overflow-y-auto">
            <div className="flex items-center justify-between pt-2 pb-6">
                <Link href="/register" className="p-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </Link>
                <h2 className="text-lg font-bold">NGO Registration</h2>
                <div className="w-10"></div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Organization Name</label>
                    <input
                        type="text"
                        name="orgName"
                        placeholder="Enter NGO name"
                        value={formData.orgName}
                        onChange={handleChange}
                        required
                        className="w-full h-14 rounded-xl border border-[var(--border)] px-4"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Registration Number</label>
                    <input
                        type="text"
                        name="registrationNumber"
                        placeholder="NGO registration number"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        required
                        className="w-full h-14 rounded-xl border border-[var(--border)] px-4"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full h-14 rounded-xl border border-[var(--border)] px-4 bg-white"
                    >
                        <option value="">Select category</option>
                        <option value="EDUCATION">Education</option>
                        <option value="MEDICAL">Healthcare</option>
                        <option value="ENVIRONMENT">Environment</option>
                        <option value="FOOD">Food & Nutrition</option>
                        <option value="SHELTER">Shelter</option>
                        <option value="EMERGENCY">Disaster Relief</option>
                        <option value="CHILD_CARE">Child Care</option>
                        <option value="ELDERLY_CARE">Elderly Care</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Contact Email</label>
                    <input
                        type="email"
                        name="contactEmail"
                        placeholder="organization@email.com"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        required
                        className="w-full h-14 rounded-xl border border-[var(--border)] px-4"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Contact Phone</label>
                    <input
                        type="tel"
                        name="contactPhone"
                        placeholder="Enter phone number"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        className="w-full h-14 rounded-xl border border-[var(--border)] px-4"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">City</label>
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full h-14 rounded-xl border border-[var(--border)] px-4"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">State</label>
                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full h-14 rounded-xl border border-[var(--border)] px-4"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Address</label>
                    <textarea
                        name="address"
                        placeholder="Full address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full h-24 rounded-xl border border-[var(--border)] px-4 py-3 resize-none"
                    ></textarea>
                </div>

                {/* Document Upload */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium pl-1">Verification Documents</label>
                    <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center">
                        <span className="material-symbols-outlined text-4xl text-[var(--foreground-muted)]">cloud_upload</span>
                        <p className="text-sm text-[var(--foreground-muted)] mt-2">Upload registration certificate, 80G certificate</p>
                        <p className="text-xs text-[var(--foreground-muted)] mt-1">(Can be uploaded later from NGO settings)</p>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm font-semibold text-blue-700 mb-3">Admin Account Details</p>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium pl-1">Admin Email</label>
                            <input
                                type="email"
                                name="adminEmail"
                                placeholder="Admin email address"
                                value={formData.adminEmail}
                                onChange={handleChange}
                                required
                                className="w-full h-14 rounded-xl border border-[var(--border)] px-4 bg-white"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium pl-1">Admin Password</label>
                            <input
                                type="password"
                                name="adminPassword"
                                placeholder="Create admin password (min 8 chars)"
                                value={formData.adminPassword}
                                onChange={handleChange}
                                required
                                minLength={8}
                                className="w-full h-14 rounded-xl border border-[var(--border)] px-4 bg-white"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl mt-4 disabled:opacity-60"
                >
                    {loading ? 'Submitting...' : 'Submit for Verification'}
                </button>
                <p className="text-xs text-center text-[var(--foreground-muted)]">
                    Your application will be reviewed within 2-3 business days
                </p>
            </form>
        </div>
    );
}
