"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { useNgoContext } from "@/lib/hooks/use-ngo-context";
import { toast } from "sonner";

interface EditFormValues {
    title: string;
    description: string;
    event_type: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    location_type: string;
    venue_name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    virtual_link: string;
    max_attendees: string;
    visibility: string;
    status: string;
}

const eventTypes = [
    { value: 'FUNDRAISER', label: 'Fundraiser' },
    { value: 'AWARENESS', label: 'Awareness Campaign' },
    { value: 'WORKSHOP', label: 'Workshop / Training' },
    { value: 'VOLUNTEER_DRIVE', label: 'Volunteer Drive' },
    { value: 'DISTRIBUTION', label: 'Distribution Drive' },
    { value: 'MEETING', label: 'Meeting' },
    { value: 'OTHER', label: 'Other' },
];

const inputStyle = {
    width: '100%', height: 42, padding: '0 14px', borderRadius: 8,
    border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
};
const labelStyle = { display: 'block' as const, fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 };

export default function EditEventPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { ngoId, canWrite, loading: ctxLoading } = useNgoContext();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<EditFormValues>();

    const locationType = watch('location_type');

    useEffect(() => {
        async function load() {
            if (ctxLoading) return;
            if (!ngoId) { setLoading(false); return; }
            const supabase = createClient();
            const { data, error } = await supabase
                .from("events").select("*").eq("id", id).eq("ngo_id", ngoId).single();

            if (error || !data) {
                toast.error("Event not found");
                router.push("/ngo/events");
                return;
            }

            reset({
                title: data.title,
                description: data.description || '',
                event_type: data.event_type,
                start_date: data.start_date || '',
                end_date: data.end_date || '',
                start_time: data.start_time || '',
                end_time: data.end_time || '',
                location_type: data.location_type || 'PHYSICAL',
                venue_name: data.venue_name || '',
                address: data.address || '',
                city: data.city || '',
                state: data.state || '',
                pincode: data.pincode || '',
                virtual_link: data.virtual_link || '',
                max_attendees: data.max_attendees ? String(data.max_attendees) : '',
                visibility: data.visibility || 'PUBLIC',
                status: data.status || 'UPCOMING',
            });
            setLoading(false);
        }
        load();
    }, [id, ngoId, ctxLoading, reset, router]);

    async function onSubmit(values: EditFormValues) {
        if (!canWrite) {
            toast.error("You don't have permission to edit events.");
            return;
        }
        setSubmitting(true);
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("events")
                .update({
                    title: values.title,
                    description: values.description || null,
                    event_type: values.event_type,
                    start_date: values.start_date,
                    end_date: values.end_date,
                    start_time: values.start_time || null,
                    end_time: values.end_time || null,
                    location_type: values.location_type,
                    venue_name: values.venue_name || null,
                    address: values.address || null,
                    city: values.city || null,
                    state: values.state || null,
                    pincode: values.pincode || null,
                    virtual_link: values.virtual_link || null,
                    max_attendees: values.max_attendees ? Number(values.max_attendees) : null,
                    visibility: values.visibility,
                    status: values.status,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", id);

            if (error) {
                toast.error(`Failed to update: ${error.message}`);
            } else {
                toast.success("Event updated successfully!");
                router.push(`/ngo/events/${id}`);
            }
        } catch (err) {
            toast.error("An unexpected error occurred.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading || ctxLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <Link href={`/ngo/events/${id}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: '#1de2d1', fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 20,
            }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
                Back to event
            </Link>

            <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 6 }}>Edit Event</h2>
                <p style={{ color: '#64748b', fontSize: 14 }}>Update event details and save changes.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 80 }}>
                <section style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', background: 'rgba(248,250,252,0.5)' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>Event Details</h3>
                    </div>
                    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label style={labelStyle}>Title *</label>
                            <input {...register('title')} type="text" style={inputStyle} />
                            {errors.title && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.title.message}</p>}
                        </div>
                        <div>
                            <label style={labelStyle}>Description</label>
                            <textarea {...register('description')} rows={4} style={{
                                width: '100%', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical',
                            }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                            <div>
                                <label style={labelStyle}>Event Type</label>
                                <select {...register('event_type')} style={inputStyle}>
                                    {eventTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Status</label>
                                <select {...register('status')} style={inputStyle}>
                                    <option value="UPCOMING">Upcoming</option>
                                    <option value="ONGOING">Ongoing</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Visibility</label>
                                <select {...register('visibility')} style={inputStyle}>
                                    <option value="PUBLIC">Public</option>
                                    <option value="PRIVATE">Private</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 20 }}>
                            <div><label style={labelStyle}>Start Date *</label><input {...register('start_date')} type="date" style={inputStyle} /></div>
                            <div><label style={labelStyle}>End Date *</label><input {...register('end_date')} type="date" style={inputStyle} /></div>
                            <div><label style={labelStyle}>Start Time</label><input {...register('start_time')} type="time" style={inputStyle} /></div>
                            <div><label style={labelStyle}>End Time</label><input {...register('end_time')} type="time" style={inputStyle} /></div>
                        </div>
                        <div>
                            <label style={labelStyle}>Max Attendees</label>
                            <input {...register('max_attendees')} type="number" min={0} placeholder="Unlimited" style={inputStyle} />
                        </div>
                    </div>
                </section>

                <section style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', background: 'rgba(248,250,252,0.5)' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>Location</h3>
                    </div>
                    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <select {...register('location_type')} style={inputStyle}>
                            <option value="PHYSICAL">Physical</option>
                            <option value="VIRTUAL">Virtual</option>
                            <option value="HYBRID">Hybrid</option>
                        </select>
                        {(locationType === 'PHYSICAL' || locationType === 'HYBRID') && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Venue Name</label><input {...register('venue_name')} type="text" style={inputStyle} /></div>
                                <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Address</label><input {...register('address')} type="text" style={inputStyle} /></div>
                                <div><label style={labelStyle}>City</label><input {...register('city')} type="text" style={inputStyle} /></div>
                                <div><label style={labelStyle}>State</label><input {...register('state')} type="text" style={inputStyle} /></div>
                            </div>
                        )}
                        {(locationType === 'VIRTUAL' || locationType === 'HYBRID') && (
                            <div><label style={labelStyle}>Virtual Link</label><input {...register('virtual_link')} type="url" style={inputStyle} /></div>
                        )}
                    </div>
                </section>

                <div style={{ display: 'flex', gap: 14 }}>
                    <button type="submit" disabled={submitting} style={{
                        flex: 1, height: 52, borderRadius: 8,
                        background: submitting ? '#94a3b8' : '#1de2d1', color: '#0f172a', fontWeight: 700, fontSize: 14,
                        border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}>
                        {submitting ? 'SAVING...' : 'SAVE CHANGES'}
                    </button>
                    <button type="button" onClick={() => router.back()} style={{
                        padding: '0 28px', height: 52, borderRadius: 8,
                        background: '#e2e8f0', color: '#475569', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
                    }}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
