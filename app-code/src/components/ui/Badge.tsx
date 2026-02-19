import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: "primary" | "success" | "warning" | "error" | "neutral" | "info";
    size?: "sm" | "md";
}

export const Badge = ({ className = "", variant = "primary", size = "md", children, ...props }: BadgeProps) => {

    const variants = {
        primary: "bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20",
        success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        warning: "bg-amber-50 text-amber-700 border border-amber-200",
        error: "bg-red-50 text-red-700 border border-red-200",
        neutral: "bg-gray-100 text-gray-600 border border-gray-200",
        info: "bg-blue-50 text-blue-700 border border-blue-200",
    };

    const sizes = {
        sm: "text-[10px] px-2 py-0.5",
        md: "text-xs px-2.5 py-1",
    };

    return (
        <span
            className={`inline-flex items-center justify-center font-semibold rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
};
