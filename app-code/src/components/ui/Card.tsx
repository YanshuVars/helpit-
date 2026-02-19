import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "glass-elevated" | "flat";
    padding?: "none" | "sm" | "md" | "lg";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = "", variant = "default", padding = "md", children, ...props }, ref) => {

        const baseStyles = "rounded-2xl transition-all duration-300";

        const variants = {
            default: "bg-white border border-gray-100 shadow-sm hover:shadow-md",
            glass: "bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm",
            "glass-elevated": "bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl shadow-[var(--primary)]/5 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-[var(--primary)]/10",
            flat: "bg-gray-50 border border-gray-100",
        };

        const paddings = {
            none: "",
            sm: "p-3",
            md: "p-5",
            lg: "p-8",
        };

        return (
            <div
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";
