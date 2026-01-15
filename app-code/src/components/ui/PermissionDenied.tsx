import Link from "next/link";

interface PermissionDeniedProps {
    title?: string;
    description?: string;
    backHref?: string;
}

export function PermissionDenied({
    title = "Access Denied",
    description = "You don't have permission to view this page. Please contact your administrator if you think this is a mistake.",
    backHref = "/",
}: PermissionDeniedProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-6 text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-5xl text-orange-500">lock</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">{title}</h1>
            <p className="text-sm text-[var(--foreground-muted)] mt-2 max-w-xs">{description}</p>
            <Link
                href={backHref}
                className="mt-6 bg-[var(--primary)] text-white font-semibold py-3 px-6 rounded-xl text-sm"
            >
                Go Back Home
            </Link>
        </div>
    );
}
