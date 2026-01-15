interface ErrorStateProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = "Something went wrong",
    description = "We couldn't load this content. Please try again.",
    onRetry,
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-4xl text-red-500">error</span>
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">{title}</h3>
            <p className="text-sm text-[var(--foreground-muted)] mt-1 max-w-xs">{description}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-4 bg-[var(--primary)] text-white font-semibold py-2.5 px-5 rounded-xl text-sm"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
