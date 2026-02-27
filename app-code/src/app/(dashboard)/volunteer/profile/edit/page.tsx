"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-toastify";

const availableSkills = [
    "First Aid", "CPR", "Driving", "Teaching", "Photography", "Video Editing",
    "Social Media", "Cooking", "Medical", "Nursing", "Counseling", "Translation",
    "Computer Skills", "Event Planning", "Fundraising", "Animal Care", "Gardening",
    "Construction", "Electrical", "Plumbing", "Language", "Music", "Art", "Sports"
];

const inputStyles = {
    width: '100%', padding: '12px 16px',
    borderRadius: 12, border: '1px solid #e2e8f0',
    background: '#f8fafc', fontSize: 14, color: '#0f172a',
    outline: 'none', transition: 'border-color 200ms',
};

export default function EditVolunteerProfilePage() {
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [isAvailable, setIsAvailable] = useState(true);
    const [availabilityHours, setAvailabilityHours] = useState("Flexible");
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { setLoading(false); return; }

            const { data: user } = await supabase.from('users')
                .select('full_name, bio, location, phone, skills, availability, availability_hours')
                .eq('id', session.user.id).single();

            if (user) {
                setName(user.full_name || '');
                setBio(user.bio || '');
                setLocation(user.location || '');
                setPhone(user.phone || '');
                setSkills(user.skills || []);
                setIsAvailable(user.availability !== false);
                setAvailabilityHours(user.availability_hours || 'Flexible');
            }
            setLoading(false);
        }
        loadProfile();
    }, []);

    const toggleSkill = (skill: string) => {
        if (skills.includes(skill)) setSkills(skills.filter(s => s !== skill));
        else setSkills([...skills, skill]);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { toast.error('Not logged in'); return; }

            const { error } = await supabase.from('users').update({
                full_name: name,
                bio,
                location,
                phone,
                skills,
                availability: isAvailable,
                availability_hours: availabilityHours,
            }).eq('id', session.user.id);

            if (error) {
                console.error('Save error:', error);
                toast.error('Failed to save profile');
            } else {
                toast.success('Profile updated successfully!');
                window.history.back();
            }
        } catch (e) {
            toast.error('Something went wrong');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: '#1de2d1' }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 32 }}>
            {/* Header */}
            <div>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Edit Profile
                </h2>
                <p style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>
                    Update your volunteer profile and skill set.
                </p>
            </div>

            <div className="r-side-main" style={{ alignItems: 'start' }}>
                {/* Left: Avatar */}
                <div style={{
                    background: '#fff', borderRadius: 16, padding: 28,
                    border: '1px solid #e2e8f0', textAlign: 'center',
                    position: 'sticky', top: 80,
                }}>
                    <div style={{
                        width: 100, height: 100, borderRadius: '50%', margin: '0 auto 16px',
                        background: 'linear-gradient(135deg, #1de2d1, #0ea5e9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 36, fontWeight: 800,
                        boxShadow: '0 4px 16px rgba(29,226,209,0.3)',
                    }}>{name.charAt(0) || '?'}</div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{name || 'Your Name'}</h3>
                    <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Volunteer</p>
                    <button style={{
                        marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '8px 16px', borderRadius: 10,
                        border: '1.5px solid #1de2d1', background: 'rgba(29,226,209,0.05)',
                        color: '#0d9488', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>photo_camera</span>
                        Change Photo
                    </button>

                    <div style={{ marginTop: 20, padding: '14px 0', borderTop: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 13, color: '#64748b' }}>Available</span>
                            <button onClick={() => setIsAvailable(!isAvailable)} style={{
                                width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                                background: isAvailable ? '#1de2d1' : '#cbd5e1', position: 'relative', transition: 'background 200ms',
                            }}>
                                <span style={{
                                    position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%',
                                    background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    transition: 'left 200ms', left: isAvailable ? 22 : 2,
                                }} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Basic Info */}
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: 24,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20, verticalAlign: 'middle', marginRight: 8, color: '#1de2d1' }}>person</span>
                            Basic Information
                        </h3>
                        <div className="r-grid-form">
                            {[
                                { label: 'Full Name', value: name, onChange: setName, type: 'text' },
                                { label: 'Location', value: location, onChange: setLocation, type: 'text' },
                                { label: 'Phone', value: phone, onChange: setPhone, type: 'tel' },
                            ].map(f => (
                                <div key={f.label}>
                                    <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{f.label}</label>
                                    <input type={f.type} value={f.value} onChange={e => f.onChange(e.target.value)}
                                        style={inputStyles}
                                        onFocus={e => e.target.style.borderColor = '#1de2d1'}
                                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Bio</label>
                            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                                style={{ ...inputStyles, minHeight: 80, resize: 'none' } as React.CSSProperties}
                                onFocus={e => e.target.style.borderColor = '#1de2d1'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    {/* Skills */}
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: 24,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20, verticalAlign: 'middle', marginRight: 8, color: '#1de2d1' }}>construction</span>
                                Skills & Expertise
                            </h3>
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', background: '#f1f5f9', padding: '3px 10px', borderRadius: 999 }}>{skills.length} selected</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {availableSkills.map(skill => {
                                const selected = skills.includes(skill);
                                return (
                                    <button key={skill} onClick={() => toggleSkill(skill)} style={{
                                        padding: '7px 14px', borderRadius: 999,
                                        fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 200ms',
                                        border: selected ? '1.5px solid #1de2d1' : '1px solid #e2e8f0',
                                        background: selected ? 'rgba(29,226,209,0.08)' : '#fff',
                                        color: selected ? '#0d9488' : '#64748b',
                                    }}>{skill}</button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Availability */}
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: 24,
                        border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20, verticalAlign: 'middle', marginRight: 8, color: '#1de2d1' }}>schedule</span>
                            Availability
                        </h3>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.03em' }}>When are you available?</label>
                            <select value={availabilityHours} onChange={e => setAvailabilityHours(e.target.value)}
                                style={{ ...inputStyles, cursor: 'pointer' } as React.CSSProperties}>
                                <option value="Weekdays Morning">Weekdays - Morning</option>
                                <option value="Weekdays Evening">Weekdays - Evening</option>
                                <option value="Weekends">Weekends</option>
                                <option value="Flexible">Flexible</option>
                                <option value="Anytime">Anytime</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <Link href="/volunteer/profile" style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            height: 48, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff',
                            color: '#64748b', fontSize: 14, fontWeight: 600, textDecoration: 'none',
                        }}>Cancel</Link>
                        <button onClick={handleSave} disabled={isSaving} style={{
                            flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            height: 48, borderRadius: 12, border: 'none',
                            background: '#1de2d1', color: '#0f172a',
                            fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 4px 16px rgba(29,226,209,0.2)',
                            opacity: isSaving ? 0.6 : 1,
                        }}>
                            {isSaving ? (
                                <><span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>sync</span> Saving...</>
                            ) : (
                                <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span> Save Changes</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
