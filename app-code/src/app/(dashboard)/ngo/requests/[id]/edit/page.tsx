"use client";

import Link from "next/link";
import { useState, use } from "react";

const mockRequest = {
    id: "1",
    title: "Emergency Food Relief",
    description: "We need volunteers to help distribute food packages to families affected by the recent floods in the eastern district. Packages are ready at our warehouse and need to be delivered to approximately 50 families.",
    category: "FOOD",
    urgency: "CRITICAL",
    status: "OPEN",
    location: "Eastern District Community Center, 123 Main Street",
    visibility: "PUBLIC",
    media: [
        { id: "1", type: "image", url: "/placeholder.jpg" }
    ]
};

const urgencyLevels = [
    { value: "LOW", color: '#2E7D32', bg: '#E8F5E9' },
    { value: "MEDIUM", color: '#F57F17', bg: '#FFF8E1' },
    { value: "HIGH", color: '#E65100', bg: '#FFF3E0' },
    { value: "CRITICAL", color: '#DC2626', bg: '#FEE2E2' },
];

export default function EditRequestPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [title, setTitle] = useState(mockRequest.title);
    const [description, setDescription] = useState(mockRequest.description);
    const [category, setCategory] = useState(mockRequest.category);
    const [urgency, setUrgency] = useState(mockRequest.urgency);
    const [location, setLocation] = useState(mockRequest.location);
    const [visibility, setVisibility] = useState(mockRequest.visibility);
    const [media, setMedia] = useState(mockRequest.media);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            window.history.back();
        }, 1000);
    };

    const handleMediaUpload = () => {
        const newMedia = { id: String(Date.now()), type: "image", url: "/placeholder.jpg" };
        setMedia([...media, newMedia]);
    };

    const removeMedia = (mediaId: string) => {
        setMedia(media.filter(m => m.id !== mediaId));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 24 }}>
            <div>
                <Link href={`/ngo/requests/${id}`} className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
                    Back to request
                </Link>
                <h1 className="page-title">Edit Request</h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                    <label className="field-label">Title *</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="field-input" />
                </div>

                <div className="form-group">
                    <label className="field-label">Description *</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="field-input field-textarea" />
                </div>

                <div className="form-group">
                    <label className="field-label">Category *</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="field-input">
                        <option value="FOOD">Food</option>
                        <option value="MEDICAL">Medical</option>
                        <option value="DISASTER">Disaster Relief</option>
                        <option value="ANIMAL">Animal Welfare</option>
                        <option value="MISSING_PERSON">Missing Person</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="field-label">Urgency Level *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                        {urgencyLevels.map(level => (
                            <button
                                key={level.value}
                                type="button"
                                onClick={() => setUrgency(level.value)}
                                style={{
                                    padding: '8px 4px', borderRadius: 'var(--radius-sm)',
                                    fontSize: 11, fontWeight: 700,
                                    border: urgency === level.value ? 'none' : '1px solid var(--color-border)',
                                    background: urgency === level.value ? level.bg : 'var(--color-bg-card)',
                                    color: urgency === level.value ? level.color : 'var(--color-text-muted)',
                                    cursor: 'pointer', transition: 'all 150ms ease',
                                }}
                            >
                                {level.value}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label className="field-label">Location</label>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="field-input" />
                    <div style={{ height: 100, borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-subtle)', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'var(--color-text-disabled)', fontSize: 13 }}>Map preview will appear here</span>
                    </div>
                </div>

                <div className="form-group">
                    <label className="field-label">Photos/Videos</label>
                    {media.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
                            {media.map(item => (
                                <div key={item.id} style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-subtle)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span className="material-symbols-outlined" style={{ color: 'var(--color-text-disabled)' }}>image</span>
                                    <button
                                        onClick={() => removeMedia(item.id)}
                                        style={{
                                            position: 'absolute', top: 4, right: 4,
                                            width: 22, height: 22, borderRadius: '50%',
                                            background: '#DC2626', color: '#fff', border: 'none', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleMediaUpload}
                        style={{
                            width: '100%', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)',
                            padding: 24, textAlign: 'center', background: 'none', cursor: 'pointer',
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--color-text-disabled)' }}>add_photo_alternate</span>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>Tap to upload media</p>
                    </button>
                </div>

                <div className="form-group">
                    <label className="field-label">Visibility</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                        {['PUBLIC', 'INTERNAL'].map(val => (
                            <label key={val} style={{
                                flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                                border: visibility === val ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                                background: visibility === val ? 'var(--color-primary-soft)' : 'var(--color-bg-card)',
                                cursor: 'pointer',
                            }}>
                                <input type="radio" name="visibility" value={val} checked={visibility === val} onChange={e => setVisibility(e.target.value)} style={{ accentColor: 'var(--color-primary)' }} />
                                <span style={{ fontSize: 13 }}>{val === 'PUBLIC' ? 'Public' : 'Internal Only'}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label className="field-label">Status</label>
                    <select className="field-input">
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', height: 46, fontSize: 15, fontWeight: 700, gap: 6, opacity: isSaving ? 0.5 : 1 }}
                >
                    {isSaving ? (
                        <>
                            <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>sync</span>
                            Saving...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
                            Save Changes
                        </>
                    )}
                </button>
                <Link
                    href={`/ngo/requests/${mockRequest.id}`}
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}
                >
                    Cancel
                </Link>
            </div>
        </div>
    );
}
