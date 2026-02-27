"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { useNgoContext } from "@/lib/hooks/use-ngo-context";
import { toast } from "sonner";

const editSchema = z.object({
    title: z.string().min(3).max(200),
    description: z.string().min(10).max(5000),
    category: z.enum(['FOOD', 'MEDICAL', 'SHELTER', 'EDUCATION', 'CLOTHING', 'EMERGENCY', 'ENVIRONMENT', 'ELDERLY_CARE', 'CHILD_CARE', 'DISABILITY_SUPPORT', 'OTHER']),
    urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'CLOSED']),
    location: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    volunteers_needed: z.coerce.number().min(1),
    estimated_hours: z.coerce.number().optional(),
    deadline: z.string().optional(),
    visibility: z.enum(['PUBLIC', 'PRIVATE', 'NGO_ONLY']),
});

type EditFormValues = z.infer<typeof editSchema>;

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

const inputStyle = {
    width: '100%', height: 42, padding: '0 14px', borderRadius: 8,
    border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
};

const labelStyle = {
    display: 'block' as const, fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8,
};

export default function EditRequestPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { ngoId, canWrite, loading: ctxLoading } = useNgoContext();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<EditFormValues>({
        resolver: zodResolver(editSchema) as any,
    });

    const selectedUrgency = watch('urgency');

    useEffect(() => {
        async function fetchRequest() {
            if (ctxLoading) return;
            if (!ngoId) { setLoading(false); return; }

            try {
                const res = await fetch(`/api/ngo/requests/${id}?ngo_id=${ngoId}`);
                const json = await res.json();
                if (!res.ok || !json.data) {
                    console.error("Error fetching request:", json.error);
                    toast.error("Request not found");
                    router.push("/ngo/requests");
                    return;
                }
                const data = json.data;

                reset({
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    urgency: data.urgency,
                    status: data.status,
                    location: data.location || '',
                    address: data.address || '',
                    city: data.city || '',
                    state: data.state || '',
                    pincode: data.pincode || '',
                    volunteers_needed: data.volunteers_needed || 1,
                    estimated_hours: data.estimated_hours || undefined,
                    deadline: data.deadline ? new Date(data.deadline).toISOString().slice(0, 16) : '',
                    visibility: data.visibility || 'PUBLIC',
                });
                setLoading(false);
            } catch (err) {
                console.error("Error fetching request:", err);
                toast.error("Request not found");
                router.push("/ngo/requests");
            }
        }
        fetchRequest();
    }, [id, ngoId, ctxLoading, reset, router]);

    async function onSubmit(values: EditFormValues) {
        if (!canWrite) {
            toast.error("You don't have permission to edit requests.");
            return;
        }

        setSubmitting(true);
        try {
            const updateData = {
                title: values.title,
                description: values.description,
                category: values.category,
                urgency: values.urgency,
                status: values.status,
                location: values.location || null,
                address: values.address || null,
                city: values.city || null,
                state: values.state || null,
                pincode: values.pincode || null,
                volunteers_needed: values.volunteers_needed,
                estimated_hours: values.estimated_hours || null,
                deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
                visibility: values.visibility,
                ngo_id: ngoId,
            };

            const res = await fetch(`/api/ngo/requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });

            if (!res.ok) {
                const json = await res.json();
                console.error("Error updating request:", json.error);
                toast.error(`Failed to update: ${json.error}`);
                return;
            }

            toast.success("Request updated successfully!");
            router.push(`/ngo/requests/${id}`);
        } catch (err) {
            console.error("Unexpected error:", err);
            toast.error("An unexpected error occurred.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading || ctxLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: "#1de2d1" }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <Link href={`/ngo/requests/${id}`} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                color: "#1de2d1", fontSize: 13, fontWeight: 600,
                textDecoration: "none", marginBottom: 20,
            }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
                Back to request
            </Link>

            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", marginBottom: 6 }}>Edit Help Request</h2>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32 }}>Update the details of this help request.</p>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 24, paddingBottom: 80 }}>
                <section style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={labelStyle}>Title *</label>
                            <input {...register('title')} type="text" style={inputStyle} />
                            {errors.title && <p style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.title.message}</p>}
                        </div>

                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={labelStyle}>Description *</label>
                            <textarea {...register('description')} rows={5} style={{
                                width: "100%", padding: 14, borderRadius: 8,
                                border: "1px solid #e2e8f0", fontSize: 14, outline: "none", resize: "vertical",
                            }} />
                            {errors.description && <p style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.description.message}</p>}
                        </div>

                        <div>
                            <label style={labelStyle}>Category *</label>
                            <select {...register('category')} style={inputStyle}>
                                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Urgency *</label>
                            <div style={{ display: "flex", gap: 6 }}>
                                {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map(u => {
                                    const colors: Record<string, string> = { LOW: "#64748b", MEDIUM: "#eab308", HIGH: "#f97316", CRITICAL: "#dc2626" };
                                    return (
                                        <button key={u} type="button" onClick={() => setValue('urgency', u)} style={{
                                            padding: "8px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
                                            border: selectedUrgency === u ? `1px solid ${colors[u]}` : "1px solid #e2e8f0",
                                            background: selectedUrgency === u ? `${colors[u]}1a` : "#fff",
                                            color: selectedUrgency === u ? colors[u] : "#64748b",
                                        }}>{u}</button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Status</label>
                            <select {...register('status')} style={inputStyle}>
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Volunteers Needed</label>
                            <input {...register('volunteers_needed')} type="number" min={1} style={inputStyle} />
                        </div>

                        <div>
                            <label style={labelStyle}>Estimated Hours</label>
                            <input {...register('estimated_hours')} type="number" min={1} style={inputStyle} />
                        </div>

                        <div>
                            <label style={labelStyle}>Deadline</label>
                            <input {...register('deadline')} type="datetime-local" style={inputStyle} />
                        </div>

                        <div>
                            <label style={labelStyle}>Location</label>
                            <input {...register('location')} type="text" style={inputStyle} />
                        </div>

                        <div>
                            <label style={labelStyle}>City</label>
                            <input {...register('city')} type="text" style={inputStyle} />
                        </div>

                        <div>
                            <label style={labelStyle}>State</label>
                            <input {...register('state')} type="text" style={inputStyle} />
                        </div>

                        <div>
                            <label style={labelStyle}>Visibility</label>
                            <select {...register('visibility')} style={inputStyle}>
                                <option value="PUBLIC">Public</option>
                                <option value="PRIVATE">Private</option>
                                <option value="NGO_ONLY">NGO Only</option>
                            </select>
                        </div>
                    </div>
                </section>

                <div style={{ display: "flex", gap: 12 }}>
                    <button type="submit" disabled={submitting} style={{
                        flex: 1, height: 48, borderRadius: 8,
                        background: submitting ? "#94a3b8" : "#1de2d1", color: "#0f172a",
                        fontWeight: 700, fontSize: 14, border: "none",
                        cursor: submitting ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}>
                        {submitting ? (
                            <span className="material-symbols-outlined animate-spin" style={{ fontSize: 20 }}>progress_activity</span>
                        ) : (
                            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>save</span>
                        )}
                        {submitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button type="button" onClick={() => router.back()} style={{
                        padding: "0 28px", height: 48, borderRadius: 8,
                        background: "#e2e8f0", color: "#475569", fontWeight: 700,
                        fontSize: 14, border: "none", cursor: "pointer",
                    }}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
