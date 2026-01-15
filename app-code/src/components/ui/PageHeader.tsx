"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    showBack?: boolean;
    fallbackRoute?: string;
    rightAction?: ReactNode;
}

export function PageHeader({
    title,
    showBack = false,
    fallbackRoute = "/",
    rightAction,
}: PageHeaderProps) {
    const router = useRouter();

    const handleBack = () => {
        // Check if there's history to go back to
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
        } else {
            // Fallback to specified route if no history
            router.push(fallbackRoute);
        }
    };

    return (
        <div className="flex items-center justify-between min-h-[44px] mb-6">
            <div className="flex items-center gap-3">
                {showBack && (
                    <button
                        onClick={handleBack}
                        className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                        aria-label="Go back"
                    >
                        <span className="material-symbols-outlined text-[22px]">arrow_back</span>
                    </button>
                )}
                <h1 className="text-xl font-bold leading-tight">{title}</h1>
            </div>
            {rightAction && <div className="flex items-center">{rightAction}</div>}
        </div>
    );
}
