import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    interactive?: boolean;
    padding?: "none" | "sm" | "md" | "lg";
    onClick?: () => void;
}

const paddingMap = {
    none: "0",
    sm: "12px",
    md: "20px",
    lg: "24px",
};

export function Card({
    children,
    className = "",
    interactive = false,
    padding = "md",
    onClick,
}: CardProps) {
    return (
        <div
            className={`card ${interactive ? "card-interactive" : ""} ${className}`}
            style={{ padding: paddingMap[padding] }}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    title: string;
    action?: React.ReactNode;
    children?: React.ReactNode;
}

export function CardHeader({ title, action, children }: CardHeaderProps) {
    return (
        <div className="card-header">
            <h3>{title}</h3>
            {action || children}
        </div>
    );
}

export default Card;
