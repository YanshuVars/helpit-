"use client";

import { useState } from "react";
import Link from "next/link";

const availableSkills = [
    "First Aid", "CPR", "Driving", "Teaching", "Photography", "Video Editing",
    "Social Media", "Cooking", "Medical", "Nursing", "Counseling", "Translation",
    "Computer Skills", "Event Planning", "Fundraising", "Animal Care", "Gardening",
    "Construction", "Electrical", "Plumbing", "Language", "Music", "Art", "Sports"
];

export default function EditVolunteerProfilePage() {
    const [name, setName] = useState("Alex Johnson");
    const [username, setUsername] = useState("@alexvolunteer");
    const [bio, setBio] = useState("Passionate volunteer dedicated to helping communities in need.");
    const [location, setLocation] = useState("Mumbai, Maharashtra");
    const [phone, setPhone] = useState("+91 98765 43210");
    const [skills, setSkills] = useState<string[]>(["First Aid", "Driving", "Teaching", "Photography"]);
    const [isAvailable, setIsAvailable] = useState(true);
    const [availabilityHours, setAvailabilityHours] = useState("Weekends");
    const [isSaving, setIsSaving] = useState(false);

    const toggleSkill = (skill: string) => {
        if (skills.includes(skill)) setSkills(skills.filter(s => s !== skill));
        else setSkills([...skills, skill]);
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => { setIsSaving(false); window.history.back(); }, 1000);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 32 }}>
            <div>
                <Link href="/volunteer/profile" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span> Back
                </Link>
                <h1 className="page-title">Edit Profile</h1>
            </div>

            {/* Profile Picture */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                    width: 80, height: 80, borderRadius: '50%', marginBottom: 8,
                    background: 'linear-gradient(135deg, var(--color-primary), #42A5F5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 28, fontWeight: 700,
                }}>{name.charAt(0)}</div>
                <button style={{ color: 'var(--color-primary)', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Change Photo</button>
            </div>

            {/* Basic Information */}
            <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h3 style={{ fontWeight: 600, fontSize: 12, color: 'var(--color-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Basic Information</h3>
                {[
                    { label: 'Full Name', type: 'text', value: name, onChange: setName },
                    { label: 'Username', type: 'text', value: username, onChange: setUsername },
                ].map(f => (
                    <div key={f.label}>
                        <label className="field-label">{f.label}</label>
                        <input type={f.type} value={f.value} onChange={e => f.onChange(e.target.value)} className="field-input" />
                    </div>
                ))}
                <div>
                    <label className="field-label">Bio</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="field-input" style={{ minHeight: 80, resize: 'none' }} />
                </div>
                {[
                    { label: 'Location', type: 'text', value: location, onChange: setLocation },
                    { label: 'Phone', type: 'tel', value: phone, onChange: setPhone },
                ].map(f => (
                    <div key={f.label}>
                        <label className="field-label">{f.label}</label>
                        <input type={f.type} value={f.value} onChange={e => f.onChange(e.target.value)} className="field-input" />
                    </div>
                ))}
            </div>

            {/* Availability */}
            <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h3 style={{ fontWeight: 600, fontSize: 12, color: 'var(--color-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Availability</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontWeight: 500 }}>Available for Volunteering</p>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Turn on to receive notifications</p>
                    </div>
                    <button onClick={() => setIsAvailable(!isAvailable)} style={{
                        width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
                        background: isAvailable ? 'var(--color-success)' : 'var(--color-border)', position: 'relative', transition: 'background 0.2s',
                    }}>
                        <span style={{
                            position: 'absolute', top: 3, width: 20, height: 20, borderRadius: '50%', background: '#fff',
                            boxShadow: 'var(--shadow-sm)', transition: 'left 0.2s', left: isAvailable ? 25 : 3,
                        }} />
                    </button>
                </div>
                {isAvailable && (
                    <div>
                        <label className="field-label">When are you available?</label>
                        <select value={availabilityHours} onChange={e => setAvailabilityHours(e.target.value)} className="field-input">
                            <option value="Weekdays Morning">Weekdays - Morning</option>
                            <option value="Weekdays Evening">Weekdays - Evening</option>
                            <option value="Weekends">Weekends</option>
                            <option value="Flexible">Flexible</option>
                            <option value="Anytime">Anytime</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Skills */}
            <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontWeight: 600, fontSize: 12, color: 'var(--color-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Skills</h3>
                    <span style={{ fontSize: 12, color: 'var(--color-text-disabled)' }}>{skills.length} selected</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {availableSkills.map(skill => (
                        <button key={skill} onClick={() => toggleSkill(skill)}
                            style={{
                                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                background: skills.includes(skill) ? 'var(--color-primary)' : 'var(--color-bg-subtle)',
                                color: skills.includes(skill) ? '#fff' : 'var(--color-text-body)',
                            }}
                        >{skill}</button>
                    ))}
                </div>
            </div>

            {/* Preferences */}
            <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h3 style={{ fontWeight: 600, fontSize: 12, color: 'var(--color-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preferences</h3>
                <div>
                    <label className="field-label">Maximum Travel Distance</label>
                    <select className="field-input" defaultValue="25">
                        <option value="5">Within 5 km</option>
                        <option value="10">Within 10 km</option>
                        <option value="25">Within 25 km</option>
                        <option value="50">Within 50 km</option>
                        <option value="any">Any distance</option>
                    </select>
                </div>
                <div>
                    <label className="field-label">Preferred Causes</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                        {["Education", "Health", "Environment", "Animal Welfare", "Disaster Relief"].map(cause => (
                            <button key={cause} style={{
                                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer',
                                background: 'var(--color-bg-subtle)', color: 'var(--color-text-body)',
                            }}>{cause}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Save */}
            <div style={{ position: 'sticky', bottom: 80, display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 12 }}>
                <button onClick={handleSave} disabled={isSaving}
                    className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 46, fontSize: 15, gap: 6, opacity: isSaving ? 0.6 : 1 }}>
                    {isSaving ? (
                        <><span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>sync</span> Saving...</>
                    ) : (
                        <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span> Save Changes</>
                    )}
                </button>
                <Link href="/volunteer/profile" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>Cancel</Link>
            </div>
        </div>
    );
}
