interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    actionHref?: string;
}

export function EmptyState({
    icon = "inbox",
    title,
    description,
    actionLabel,
    actionHref,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-4xl text-gray-400">{icon}</span>
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">{title}</h3>
            {description && (
                <p className="text-sm text-[var(--foreground-muted)] mt-1 max-w-xs">{description}</p>
            )}
            {actionLabel && actionHref && (
                <a
                    href={actionHref}
                    className="mt-4 bg-[var(--primary)] text-white font-semibold py-2.5 px-5 rounded-xl text-sm"
                >
                    {actionLabel}
                </a>
            )}
        </div>
    );
}
