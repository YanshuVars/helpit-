import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: string;
    iconRight?: string;
    fullWidth?: boolean;
    loading?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
    danger: "btn-danger",
};

const sizeClass: Record<ButtonSize, string> = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
};

export function Button({
    variant = "primary",
    size = "md",
    icon,
    iconRight,
    fullWidth = false,
    loading = false,
    children,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`btn ${variantClass[variant]} ${sizeClass[size]} ${fullWidth ? "btn-full" : ""} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>
                    progress_activity
                </span>
            ) : icon ? (
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    {icon}
                </span>
            ) : null}
            {children}
            {iconRight && !loading && (
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    {iconRight}
                </span>
            )}
        </button>
    );
}

export default Button;
