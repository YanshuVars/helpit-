interface LoadingSkeletonProps {
    variant?: "card" | "list" | "profile" | "stats";
    count?: number;
}

export function LoadingSkeleton({ variant = "card", count = 1 }: LoadingSkeletonProps) {
    const items = Array.from({ length: count }, (_, i) => i);

    if (variant === "stats") {
        return (
            <div className="grid grid-cols-2 gap-4">
                {items.map((i) => (
                    <div key={i} className="animate-pulse rounded-xl p-5 bg-white border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="h-6 w-6 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (variant === "list") {
        return (
            <div className="space-y-3">
                {items.map((i) => (
                    <div key={i} className="animate-pulse flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200">
                        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="h-3 bg-gray-200 rounded w-10"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (variant === "profile") {
        return (
            <div className="animate-pulse flex flex-col items-center py-6">
                <div className="h-20 w-20 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
        );
    }

    // Default card variant
    return (
        <div className="space-y-4">
            {items.map((i) => (
                <div key={i} className="animate-pulse rounded-xl p-4 bg-white border border-gray-200">
                    <div className="h-32 bg-gray-200 rounded-lg mb-3"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            ))}
        </div>
    );
}
