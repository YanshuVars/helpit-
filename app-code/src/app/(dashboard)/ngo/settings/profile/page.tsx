"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function OrganizationProfilePage() {
    const [ngo, setNgo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { setLoading(false); return; }
            const { data: membership } = await supabase
                .from("ngo_members").select("ngo_id")
                .eq("user_id", session.user.id).single();
            if (!membership) { setLoading(false); return; }
            const { data } = await supabase.from("ngos").select("*").eq("id", membership.ngo_id).single();
            setNgo(data);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) {
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

                {/* Form */}
                <div style={{
                    background: "#fff", borderRadius: 12, padding: 24,
                    border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginBottom: 20 }}>Basic Information</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <div>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Organization Name</label>
                            <input type="text" defaultValue={ngo?.name || ""} style={{
                                width: "100%", height: 44, padding: "0 14px", borderRadius: 8,
                                border: "1px solid #e2e8f0", fontSize: 14, outline: "none",
                            }} />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Description</label>
                            <textarea defaultValue={ngo?.description || ""} rows={4} style={{
                                width: "100%", padding: 14, borderRadius: 8,
                                border: "1px solid #e2e8f0", fontSize: 14, outline: "none", resize: "vertical",
                            }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Email</label>
                                <input type="email" defaultValue={ngo?.contact_email || ""} style={{
                                    width: "100%", height: 44, padding: "0 14px", borderRadius: 8,
                                    border: "1px solid #e2e8f0", fontSize: 14, outline: "none",
                                }} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Phone</label>
                                <input type="tel" defaultValue={ngo?.phone || ""} style={{
                                    width: "100%", height: 44, padding: "0 14px", borderRadius: 8,
                                    border: "1px solid #e2e8f0", fontSize: 14, outline: "none",
                                }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Website</label>
                            <input type="url" defaultValue={ngo?.website || ""} style={{
                                width: "100%", height: 44, padding: "0 14px", borderRadius: 8,
                                border: "1px solid #e2e8f0", fontSize: 14, outline: "none",
                            }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Save */}
            <div style={{
                position: "fixed", bottom: 0, left: 0, right: 0,
                background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
                borderTop: "1px solid #e2e8f0", padding: "12px 32px",
                display: "flex", justifyContent: "flex-end", gap: 12, zIndex: 40,
            }}>
                <button style={{
                    padding: "9px 20px", borderRadius: 8, border: "1px solid #e2e8f0",
                    background: "#fff", color: "#475569", fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}>Cancel</button>
                <button style={{
                    padding: "9px 24px", borderRadius: 8,
                    background: "#1de2d1", color: "#0f172a",
                    fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(29,226,209,0.2)",
                }}>Save Changes</button>
            </div>
        </div>
    );
}
