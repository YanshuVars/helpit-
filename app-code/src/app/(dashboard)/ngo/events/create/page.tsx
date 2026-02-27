"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { useNgoContext } from "@/lib/hooks/use-ngo-context";
import { toast } from "sonner";

interface EventFormValues {
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

const labelStyle = {
    display: 'block' as const, fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8,
};

export default function CreateEventPage() {
    const router = useRouter();
    const { ngoId, userId, canWrite, loading: ctxLoading } = useNgoContext();
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<EventFormValues>({
        defaultValues: {
            event_type: 'FUNDRAISER',
            location_type: 'PHYSICAL',
            visibility: 'PUBLIC',
        },
    });

    const locationType = watch('location_type');

    async function onSubmit(values: EventFormValues) {
        if (!ngoId || !userId) {
            toast.error('Unable to determine your NGO. Please refresh and try again.');
            return;
        }
        if (!canWrite) {
            toast.error('You do not have permission to create events.');
            return;
        }
        if (!values.title || values.title.trim().length < 3) {
            toast.error('Title must be at least 3 characters.');
            return;
        }
        if (!values.start_date || !values.end_date) {
            toast.error('Start and end dates are required.');
            return;
        }

        setSubmitting(true);
        try {
            const supabase = createClient();
            const insertData: Record<string, unknown> = {
                ngo_id: ngoId,
                created_by: userId,
                title: values.title.trim(),
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
                status: 'UPCOMING',
            };

            const { error } = await supabase.from('events').insert(insertData);

            if (error) {
                console.error('Error creating event:', error);
                toast.error(`Failed to create event: ${error.message}`);
                return;
            }

            toast.success('Event created successfully!');
            router.push('/ngo/events');
        } catch (err) {
            console.error('Unexpected error:', err);
            toast.error('An unexpected error occurred.');
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
            <Link href="/ngo/events" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: '#1de2d1', fontSize: 13, fontWeight: 600,
                textDecoration: 'none', marginBottom: 20,
            }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
                Back to events
            </Link>

            <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 6 }}>
                    Create Event
                </h2>
                <p style={{ color: '#64748b', fontSize: 14 }}>
                    Plan a new event for your organization.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 80 }}>
                {/* Basic Info */}
                <section style={{
                    background: '#fff', borderRadius: 12,
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                }}>
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', background: 'rgba(248,250,252,0.5)' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>1. Event Details</h3>
                    </div>
                    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label style={labelStyle}>Event Title *</label>
                            <input {...register('title')} type="text" placeholder="e.g. Annual Fundraiser Gala" style={inputStyle} />
                            {errors.title && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.title.message}</p>}
                        </div>
                        <div>
                            <label style={labelStyle}>Description</label>
                            <textarea {...register('description')} placeholder="Describe the event..." rows={4} style={{
                                width: '100%', padding: 14, borderRadius: 8,
                                border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical',
                            }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div>
                                <label style={labelStyle}>Event Type *</label>
                                <select {...register('event_type')} style={{ ...inputStyle, appearance: 'none' as any }}>
                                    {eventTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Visibility</label>
                                <select {...register('visibility')} style={{ ...inputStyle, appearance: 'none' as any }}>
                                    <option value="PUBLIC">Public</option>
                                    <option value="PRIVATE">Private</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Max Attendees</label>
                            <input {...register('max_attendees')} type="number" min={0} placeholder="Leave empty for unlimited" style={inputStyle} />
                        </div>
                    </div>
                </section>

                {/* Date & Time */}
                <section style={{
                    background: '#fff', borderRadius: 12,
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                }}>
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', background: 'rgba(248,250,252,0.5)' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>2. Date & Time</h3>
                    </div>
                    <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                            <label style={labelStyle}>Start Date *</label>
                            <input {...register('start_date')} type="date" style={inputStyle} />
                            {errors.start_date && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.start_date.message}</p>}
                        </div>
                        <div>
                            <label style={labelStyle}>End Date *</label>
                            <input {...register('end_date')} type="date" style={inputStyle} />
                            {errors.end_date && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.end_date.message}</p>}
                        </div>
                        <div>
                            <label style={labelStyle}>Start Time</label>
                            <input {...register('start_time')} type="time" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>End Time</label>
                            <input {...register('end_time')} type="time" style={inputStyle} />
                        </div>
                    </div>
                </section>

                {/* Location */}
                <section style={{
                    background: '#fff', borderRadius: 12,
                    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                }}>
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', background: 'rgba(248,250,252,0.5)' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>3. Location</h3>
                    </div>
                    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                            {(['PHYSICAL', 'VIRTUAL', 'HYBRID'] as const).map(lt => (
                                <label key={lt} onClick={() => setValue('location_type', lt)} style={{
                                    display: 'flex', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12, cursor: 'pointer',
                                    border: locationType === lt ? '2px solid #1de2d1' : '2px solid #e2e8f0',
                                    background: locationType === lt ? 'rgba(29,226,209,0.04)' : '#fff',
                                }}>
                                    <span className="material-symbols-outlined" style={{ color: locationType === lt ? '#1de2d1' : '#94a3b8' }}>
                                        {lt === 'PHYSICAL' ? 'location_on' : lt === 'VIRTUAL' ? 'videocam' : 'public'}
                                    </span>
                                    <span style={{ fontSize: 13, fontWeight: 700 }}>{lt.charAt(0) + lt.slice(1).toLowerCase()}</span>
                                </label>
                            ))}
                        </div>

                        {(locationType === 'PHYSICAL' || locationType === 'HYBRID') && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>Venue Name</label>
                                    <input {...register('venue_name')} type="text" placeholder="e.g. Community Hall, Block 5" style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
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
                            </div>
                        )}

                        {(locationType === 'VIRTUAL' || locationType === 'HYBRID') && (
                            <div>
                                <label style={labelStyle}>Virtual Meeting Link</label>
                                <input {...register('virtual_link')} type="url" placeholder="https://meet.google.com/..." style={inputStyle} />
                            </div>
                        )}
                    </div>
                </section>

                {/* Submit */}
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
                            <span className="material-symbols-outlined">event</span>
                        )}
                        {submitting ? 'CREATING...' : 'CREATE EVENT'}
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
