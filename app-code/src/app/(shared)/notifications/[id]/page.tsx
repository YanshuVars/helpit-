"use client";

import { useParams, useRouter } from "next/navigation";

export default function NotificationDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                <button onClick={() => router.push("/notifications")} style={{ border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--foreground-muted)" }}>arrow_back</span>
                </button>
                <h1 style={{ fontSize: "var(--font-2xl)", fontWeight: 700 }}>Notification</h1>
            </div>

            {/* Content */}
            <div className="card" style={{ textAlign: "center", padding: "var(--space-xl)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--foreground-light)" }}>notifications</span>
                <h2 style={{ fontSize: "var(--font-lg)", fontWeight: 600, marginTop: "var(--space-md)" }}>Notification Detail</h2>
                <p style={{ color: "var(--foreground-muted)", marginTop: 8 }}>Notification ID: {id}</p>
                <p style={{ color: "var(--foreground-muted)", fontSize: "var(--font-sm)", marginTop: 4 }}>This is a placeholder for the notification detail view.</p>
                <button className="btn-primary" style={{ marginTop: "var(--space-lg)" }} onClick={() => router.push("/notifications")}>Back to Notifications</button>
            </div>
        </div>
    );
}
