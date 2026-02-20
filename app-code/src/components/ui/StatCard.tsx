import React from "react";

interface StatCardProps {
    icon: string;
    iconBg?: string;
    iconColor?: string;
    value: string | number;
    label: string;
    trend?: {
        value: string;
        direction: "up" | "down";
    };
    className?: string;
}

export function StatCard({
    icon,
    iconBg = "var(--color-primary-soft)",
    iconColor = "var(--color-primary)",
    value,
    label,
    trend,
    className = "",
}: StatCardProps) {
    return (
        <div className={`stat-card ${className}`}>
            <div
                className="stat-icon"
                style={{ backgroundColor: iconBg }}
            >
                <span
                    className="material-symbols-outlined icon-filled"
                    style={{ color: iconColor, fontSize: 20 }}
                >
                    {icon}
                </span>
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
            {trend && (
                <div className={`stat-trend ${trend.direction}`}>
                    {trend.direction === "up" ? "▲" : "▼"} {trend.value}
                </div>
            )}
        </div>
    );
}

export default StatCard;
