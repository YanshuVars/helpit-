import React from "react";

interface LoadingSkeletonProps {
    variant?: "text" | "heading" | "avatar" | "card" | "custom";
    width?: string | number;
    height?: string | number;
    count?: number;
    className?: string;
}

export function LoadingSkeleton({
    variant = "text",
    width,
    height,
    count = 1,
    className = "",
}: LoadingSkeletonProps) {
    const variantClass = {
        text: "skeleton-text",
        heading: "skeleton-heading",
        avatar: "skeleton-avatar",
        card: "skeleton-card",
        custom: "",
    };

    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`skeleton ${variantClass[variant]} ${className}`}
                    style={{
                        width: width || (variant === "avatar" ? 40 : undefined),
                        height: height || (variant === "avatar" ? 40 : undefined),
                    }}
                />
            ))}
        </>
    );
}

/* Pre-composed skeleton patterns for common page sections */
export function SkeletonStatCards() {
    return (
        <div className="stats-grid">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card" style={{ padding: 20 }}>
                    <LoadingSkeleton variant="avatar" width={40} height={40} />
                    <LoadingSkeleton variant="heading" width="50%" />
                    <LoadingSkeleton variant="text" width="70%" />
                </div>
            ))}
        </div>
    );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
    return (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="data-table">
                <thead>
                    <tr>
                        {Array.from({ length: cols }).map((_, i) => (
                            <th key={i}>
                                <LoadingSkeleton variant="text" width="60%" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, ri) => (
                        <tr key={ri}>
                            {Array.from({ length: cols }).map((_, ci) => (
                                <td key={ci}>
                                    <LoadingSkeleton variant="text" width="80%" />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function SkeletonCardGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="card-grid">
            {Array.from({ length: count }).map((_, i) => (
                <LoadingSkeleton key={i} variant="card" height={180} />
            ))}
        </div>
    );
}

export default LoadingSkeleton;
