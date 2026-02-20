import React from "react";

interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    icon = "inbox",
    title,
    description,
    action,
    className = "",
}: EmptyStateProps) {
    return (
        <div className={`empty-state ${className}`}>
            <span className="material-symbols-outlined empty-state-icon">{icon}</span>
            <div className="empty-state-title">{title}</div>
            {description && <div className="empty-state-desc">{description}</div>}
            {action}
        </div>
    );
}

export default EmptyState;
