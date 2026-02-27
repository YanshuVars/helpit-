"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useNgoContext } from "@/lib/hooks/use-ngo-context";
import { toast } from "sonner";

interface NgoProfile {
    name: string;
    description: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    logo_url: string;
    categories: string[];
    registration_number: string;
    has_80g: boolean;
    has_12a: boolean;
}

const emptyProfile: NgoProfile = {
    name: "", description: "", email: "", phone: "", website: "",
    address: "", city: "", state: "", pincode: "", logo_url: "",
    categories: [], registration_number: "", has_80g: false, has_12a: false,
};

export default function OrganizationProfilePage() {
    const { ngoId, canWrite, loading: ctxLoading } = useNgoContext();
    const [form, setForm] = useState<NgoProfile>(emptyProfile);
    const [original, setOriginal] = useState<NgoProfile>(emptyProfile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            if (ctxLoading) return;
            if (!ngoId) { setLoading(false); return; }
            const supabase = createClient();
            const { data, error } = await supabase
                .from("ngos")
                .select("name, description, email, phone, website, address, city, state, pincode, logo_url, categories, registration_number, has_80g, has_12a")
                .eq("id", ngoId)
                .single();

            if (error) {
                console.error("Error loading NGO profile:", error);
                toast.error("Failed to load organization profile.");
            }

            if (data) {
                const profile: NgoProfile = {
                    name: data.name || "",
                    description: data.description || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    website: data.website || "",
                    address: data.address || "",
                    city: data.city || "",
                    state: data.state || "",
                    pincode: data.pincode || "",
                    logo_url: data.logo_url || "",
                    categories: data.categories || [],
                    registration_number: data.registration_number || "",
                    has_80g: data.has_80g || false,
                    has_12a: data.has_12a || false,
                };
                setForm(profile);
                setOriginal(profile);
            }
            setLoading(false);
        }
        load();
    }, [ngoId, ctxLoading]);

    async function handleSave() {
        if (!ngoId || !canWrite) {
            toast.error("You don't have permission to edit this profile.");
            return;
        }
        if (!form.name.trim()) {
            toast.error("Organization name is required.");
            return;
        }
        setSaving(true);
        const supabase = createClient();
        const { error } = await supabase
            .from("ngos")
            .update({
                name: form.name.trim(),
                description: form.description.trim(),
                email: form.email.trim(),
                phone: form.phone.trim() || null,
                website: form.website.trim() || null,
                address: form.address.trim() || null,
                city: form.city.trim() || null,
                state: form.state.trim() || null,
                pincode: form.pincode.trim() || null,
                updated_at: new Date().toISOString(),
            })
            .eq("id", ngoId);

        if (error) {
            console.error("Error saving profile:", error);
            toast.error(`Failed to save: ${error.message}`);
        } else {
            toast.success("Organization profile updated successfully!");
            setOriginal({ ...form });
        }
        setSaving(false);
    }

    function handleCancel() {
        setForm({ ...original });
    }

    const hasChanges = JSON.stringify(form) !== JSON.stringify(original);

    const inputStyle = {
        width: "100%", height: 44, padding: "0 14px", borderRadius: 8,
        border: "1px solid #e2e8f0", fontSize: 14, outline: "none",
    };

    const labelStyle = {
        display: "block" as const, fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6,
    };

    if (loading || ctxLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, color: "#1de2d1" }}>progress_activity</span>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a" }}>Organization Profile</h2>
                <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Update your organization's public information and branding.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 700, paddingBottom: 100 }}>
                {/* Logo / Banner */}
                <div style={{
                    background: "#fff", borderRadius: 12, padding: 20,
                    border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginBottom: 16 }}>Logo & Branding</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{
                            width: 72, height: 72, borderRadius: 12,
                            background: "rgba(29,226,209,0.1)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            border: "2px dashed #e2e8f0",
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#1de2d1" }}>add_photo_alternate</span>
                        </div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 600 }}>Upload Logo</p>
                            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>PNG, JPG up to 2MB. Recommended 256×256px.</p>
                        </div>
                    </div>
                </div>

                {/* Basic Information Form */}
                <div style={{
                    background: "#fff", borderRadius: 12, padding: 24,
                    border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginBottom: 20 }}>Basic Information</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <div>
                            <label style={labelStyle}>Organization Name *</label>
                            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Description</label>
                            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} style={{
                                width: "100%", padding: 14, borderRadius: 8,
                                border: "1px solid #e2e8f0", fontSize: 14, outline: "none", resize: "vertical",
                            }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                                <label style={labelStyle}>Email</label>
                                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Phone</label>
                                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={inputStyle} />
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Website</label>
                            <input type="url" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} style={inputStyle} />
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div style={{
                    background: "#fff", borderRadius: 12, padding: 24,
                    border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginBottom: 20 }}>Address</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <div>
                            <label style={labelStyle}>Street Address</label>
                            <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} style={inputStyle} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                            <div>
                                <label style={labelStyle}>City</label>
                                <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>State</label>
                                <input type="text" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Pincode</label>
                                <input type="text" value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} style={inputStyle} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registration Info (Read-only) */}
                <div style={{
                    background: "#fff", borderRadius: 12, padding: 24,
                    border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginBottom: 20 }}>Registration & Compliance</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                        <div style={{ padding: "10px 14px", borderRadius: 8, background: "#f8fafc" }}>
                            <p style={{ fontSize: 11, color: "#94a3b8" }}>Registration Number</p>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginTop: 4 }}>{form.registration_number || "—"}</p>
                        </div>
                        <div style={{ padding: "10px 14px", borderRadius: 8, background: "#f8fafc" }}>
                            <p style={{ fontSize: 11, color: "#94a3b8" }}>80G Certificate</p>
                            <p style={{ fontSize: 13, fontWeight: 600, color: form.has_80g ? "#059669" : "#94a3b8", marginTop: 4 }}>
                                {form.has_80g ? "✓ Verified" : "Not Available"}
                            </p>
                        </div>
                        <div style={{ padding: "10px 14px", borderRadius: 8, background: "#f8fafc" }}>
                            <p style={{ fontSize: 11, color: "#94a3b8" }}>12A Certificate</p>
                            <p style={{ fontSize: 13, fontWeight: 600, color: form.has_12a ? "#059669" : "#94a3b8", marginTop: 4 }}>
                                {form.has_12a ? "✓ Verified" : "Not Available"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Save Footer */}
            {hasChanges && (
                <div style={{
                    position: "fixed", bottom: 0, left: 0, right: 0,
                    background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
                    borderTop: "1px solid #e2e8f0", padding: "12px 32px",
                    display: "flex", justifyContent: "flex-end", gap: 12, zIndex: 40,
                }}>
                    <button onClick={handleCancel} style={{
                        padding: "9px 20px", borderRadius: 8, border: "1px solid #e2e8f0",
                        background: "#fff", color: "#475569", fontWeight: 700, fontSize: 13, cursor: "pointer",
                    }}>Cancel</button>
                    <button onClick={handleSave} disabled={saving} style={{
                        padding: "9px 24px", borderRadius: 8,
                        background: saving ? "#94a3b8" : "#1de2d1", color: "#0f172a",
                        fontWeight: 700, fontSize: 13, border: "none",
                        cursor: saving ? "not-allowed" : "pointer",
                        boxShadow: "0 4px 16px rgba(29,226,209,0.2)",
                        display: "flex", alignItems: "center", gap: 8,
                    }}>
                        {saving && <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>progress_activity</span>}
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            )}
        </div>
    );
}
