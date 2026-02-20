import React from "react";

type BadgeVariant = "pending" | "active" | "success" | "completed" | "info" | "rejected" | "error" | "default";

interface BadgeProps {
    variant?: BadgeVariant;
    children: React.ReactNode;
    className?: string;
    dot?: boolean;
}

const variantClass: Record<BadgeVariant, string> = {
    pending: "badge-pending",
    active: "badge-active",
    success: "badge-success",
    completed: "badge-completed",
    info: "badge-info",
    rejected: "badge-rejected",
    error: "badge-error",
    default: "",
};

export function Badge({ variant = "default", children, className = "", dot }: BadgeProps) {
    return (
        <span className={`badge ${variantClass[variant]} ${className}`}>
            {dot && (
                <span
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "currentColor",
                        marginRight: 4,
                        flexShrink: 0,
                    }}
                />
            )}
            {children}
        </span>
    );
}

export default Badge;
