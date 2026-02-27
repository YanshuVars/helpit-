"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { useNgoContext } from "@/lib/hooks/use-ngo-context";
import { toast } from "sonner";

const requestSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(200),
    description: z.string().min(10, "Description must be at least 10 characters").max(5000),
    category: z.enum(['FOOD', 'MEDICAL', 'SHELTER', 'EDUCATION', 'CLOTHING', 'EMERGENCY', 'ENVIRONMENT', 'ELDERLY_CARE', 'CHILD_CARE', 'DISABILITY_SUPPORT', 'OTHER']),
    urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    location: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    volunteers_needed: z.coerce.number().min(1, "At least 1 volunteer needed").default(1),
    estimated_hours: z.coerce.number().optional(),
    deadline: z.string().optional(),
    visibility: z.enum(['PUBLIC', 'PRIVATE', 'NGO_ONLY']).default('PUBLIC'),
});

type RequestFormValues = z.infer<typeof requestSchema>;

const categories = [
    { value: 'FOOD', label: 'Food & Nutrition' },
    { value: 'MEDICAL', label: 'Medical Assistance' },
    { value: 'SHELTER', label: 'Shelter' },
    { value: 'EDUCATION', label: 'Education Support' },
    { value: 'CLOTHING', label: 'Clothing' },
    { value: 'EMERGENCY', label: 'Emergency / Disaster Relief' },
    { value: 'ENVIRONMENT', label: 'Environment' },
    { value: 'ELDERLY_CARE', label: 'Elderly Care' },
    { value: 'CHILD_CARE', label: 'Child Care' },
    { value: 'DISABILITY_SUPPORT', label: 'Disability Support' },
    { value: 'OTHER', label: 'Other' },
];

const urgencyLevels = [
    { value: "LOW", label: "LOW", color: "#64748b" },
    { value: "MEDIUM", label: "MEDIUM", color: "#ca8a04" },
    { value: "HIGH", label: "HIGH", color: "#f97316" },
    { value: "CRITICAL", label: "CRITICAL", color: "#dc2626" },
];

const inputStyle = {
    width: '100%', height: 42, padding: '0 14px', borderRadius: 8,
    border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
};

const labelStyle = {
    display: 'block' as const, fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8,
};

export default function CreateRequestPage() {
    const router = useRouter();
    const { ngoId, userId, canWrite, loading: ctxLoading } = useNgoContext();
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RequestFormValues>({
        resolver: zodResolver(requestSchema) as any,
        defaultValues: {
            urgency: 'HIGH',
            category: 'FOOD',
            visibility: 'PUBLIC',
            volunteers_needed: 1,
        },
    });

    const selectedUrgency = watch('urgency');
    const selectedVisibility = watch('visibility');

    async function onSubmit(values: RequestFormValues) {
        if (!ngoId || !userId) {
            toast.error('Unable to determine your NGO. Please refresh and try again.');
            return;
        }
        if (!canWrite) {
            toast.error('You do not have permission to create requests. Only NGO Admins and Coordinators can create requests.');
            return;
        }

        setSubmitting(true);
        try {
            const supabase = createClient();
            const insertData: Record<string, unknown> = {
                ngo_id: ngoId,
                created_by: userId,
                title: values.title,
                description: values.description,
                category: values.category,
                urgency: values.urgency,
                status: 'OPEN',
                location: values.location || null,
                address: values.address || null,
                city: values.city || null,
                state: values.state || null,
                pincode: values.pincode || null,
                volunteers_needed: values.volunteers_needed,
                estimated_hours: values.estimated_hours || null,
                deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
                visibility: values.visibility,
            };

            const res = await fetch('/api/ngo/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(insertData),
            });

            if (!res.ok) {
                const json = await res.json();
                console.error('Error creating request:', json.error);
                toast.error(`Failed to create request: ${json.error}`);
                return;
            }

            toast.success('Help request created successfully!');
            router.push('/ngo/requests');
        } catch (err) {
            console.error('Unexpected error:', err);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    if (ctxLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
            {/* Back link */}
            <Link href="/ngo/requests" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: '#1de2d1', fontSize: 13, fontWeight: 600,
                textDecoration: 'none', marginBottom: 20,
            }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
                Back to requests
            </Link>

            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 6 }}>
                    Create Help Request
                </h2>
                <p style={{ color: '#64748b', fontSize: 14 }}>
                    Fill in the formal requirements to broadcast this assistance need to our volunteer network.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 80 }}>
                {/* Section 1: Basic Information */}
                <section style={{
                    background: '#fff', borderRadius: 12,
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '14px 20px', borderBottom: '1px solid #f1f5f9',
                        background: 'rgba(248,250,252,0.5)',
                    }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>1. Basic Information</h3>
                    </div>
                    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            {/* Title */}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Request Title *</label>
                                <input {...register('title')} type="text" placeholder="e.g. Emergency Food Supply - Sector 7" style={inputStyle} />
                                {errors.title && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.title.message}</p>}
                            </div>

                            {/* Description */}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Detailed Description *</label>
                                <textarea {...register('description')} placeholder="Provide full details of the assistance required..." rows={4} style={{
                                    width: '100%', padding: 14, borderRadius: 8,
                                    border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical',
                                }} />
                                {errors.description && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.description.message}</p>}
                            </div>

                            {/* Category */}
                            <div>
                                <label style={labelStyle}>Category *</label>
                                <select {...register('category')} style={{
                                    ...inputStyle,
                                    appearance: 'none' as const,
                                    background: `#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 12px center`,
                                }}>
                                    {categories.map(c => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Urgency */}
                            <div>
                                <label style={labelStyle}>Urgency Level *</label>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    {urgencyLevels.map(u => (
                                        <button key={u.value} type="button" onClick={() => setValue('urgency', u.value as RequestFormValues['urgency'])}
                                            style={{
                                                padding: '8px 16px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                                                border: selectedUrgency === u.value ? `1px solid ${u.color}` : '1px solid #e2e8f0',
                                                background: selectedUrgency === u.value ? `${u.color}1a` : '#fff',
                                                color: selectedUrgency === u.value ? u.color : '#64748b',
                                                cursor: 'pointer',
                                            }}
                                        >{u.label}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Volunteers needed */}
                            <div>
                                <label style={labelStyle}>Volunteers Needed *</label>
                                <input {...register('volunteers_needed')} type="number" min={1} placeholder="1" style={inputStyle} />
                                {errors.volunteers_needed && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.volunteers_needed.message}</p>}
                            </div>

                            {/* Estimated hours */}
                            <div>
                                <label style={labelStyle}>Estimated Hours</label>
                                <input {...register('estimated_hours')} type="number" min={1} placeholder="Optional" style={inputStyle} />
                            </div>

                            {/* Deadline */}
                            <div>
                                <label style={labelStyle}>Deadline</label>
                                <input {...register('deadline')} type="datetime-local" style={inputStyle} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Location */}
                <section style={{
                    background: '#fff', borderRadius: 12,
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '14px 20px', borderBottom: '1px solid #f1f5f9',
                        background: 'rgba(248,250,252,0.5)',
                    }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>2. Location</h3>
                    </div>
                    <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>Location / Area</label>
                            <div style={{ position: 'relative' }}>
                                <span className="material-symbols-outlined" style={{
                                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                                    color: '#94a3b8',
                                }}>location_on</span>
                                <input {...register('location')} type="text" placeholder="e.g. Sector 7, Dwarka" style={{
                                    ...inputStyle, paddingLeft: 40,
                                }} />
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Address</label>
                            <input {...register('address')} type="text" placeholder="Street address" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>City</label>
                            <input {...register('city')} type="text" placeholder="City" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>State</label>
                            <input {...register('state')} type="text" placeholder="State" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Pincode</label>
                            <input {...register('pincode')} type="text" placeholder="110001" style={inputStyle} />
                        </div>
                    </div>
                </section>

                {/* Section 3: Visibility */}
                <section style={{
                    background: '#fff', borderRadius: 12,
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '14px 20px', borderBottom: '1px solid #f1f5f9',
                        background: 'rgba(248,250,252,0.5)',
                    }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>3. Visibility Settings</h3>
                    </div>
                    <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                        {([
                            { value: 'PUBLIC', icon: 'public', label: 'Public Request', desc: 'Broadcast to all verified volunteers.' },
                            { value: 'PRIVATE', icon: 'lock', label: 'Invite Only', desc: 'Only assigned volunteers can see.' },
                            { value: 'NGO_ONLY', icon: 'shield', label: 'Internal NGO', desc: 'Only your NGO staff can see.' },
                        ] as const).map(v => (
                            <label key={v.value} onClick={() => setValue('visibility', v.value)} style={{
                                display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 12, cursor: 'pointer',
                                border: selectedVisibility === v.value ? '2px solid #1de2d1' : '2px solid #e2e8f0',
                                background: selectedVisibility === v.value ? 'rgba(29,226,209,0.04)' : '#fff',
                            }}>
                                <span className="material-symbols-outlined" style={{
                                    fontSize: 28, color: selectedVisibility === v.value ? '#1de2d1' : '#94a3b8',
                                }}>{v.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 13, fontWeight: 700 }}>{v.label}</p>
                                    <p style={{ fontSize: 11, color: '#64748b' }}>{v.desc}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Submit Footer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <button type="submit" disabled={submitting} style={{
                        flex: 1, height: 52, borderRadius: 8,
                        background: submitting ? '#94a3b8' : '#1de2d1', color: '#0f172a', fontWeight: 700, fontSize: 14,
                        border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        boxShadow: submitting ? 'none' : '0 8px 24px rgba(29,226,209,0.2)',
                    }}>
                        {submitting ? (
                            <span className="material-symbols-outlined animate-spin" style={{ fontSize: 20 }}>progress_activity</span>
                        ) : (
                            <span className="material-symbols-outlined">add_task</span>
                        )}
                        {submitting ? 'CREATING...' : 'CREATE HELP REQUEST'}
                    </button>
                    <button type="button" onClick={() => router.back()} style={{
                        padding: '0 28px', height: 52, borderRadius: 8,
                        background: '#e2e8f0', color: '#475569', fontWeight: 700, fontSize: 14,
                        border: 'none', cursor: 'pointer',
                    }}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
