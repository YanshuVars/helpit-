import Link from "next/link";
import { formatDistanceToNow } from "@/lib/utils";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";

interface RequestCardProps {
    request: {
        id: string;
        title: string;
        description: string;
        urgency: "HIGH" | "MEDIUM" | "LOW" | "CRITICAL";
        category: string;
        city: string;
        created_at: string;
        ngo: {
            id: string;
            name: string;
            logo_url: string | null;
        };
    };
}

export function RequestCard({ request }: RequestCardProps) {
    const urgencyColors = {
        CRITICAL: "bg-red-100 text-red-700 border-red-200",
        HIGH: "bg-orange-100 text-orange-700 border-orange-200",
        MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
        LOW: "bg-blue-100 text-blue-700 border-blue-200",
    };

    return (
        <Card variant="glass-elevated" padding="none" className="h-full flex flex-col group overflow-hidden">
            <div className="p-5 flex-1 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                        <Badge variant="neutral" size="sm">
                            {request.category.replace("_", " ")}
                        </Badge>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${urgencyColors[request.urgency]}`}>
                            {request.urgency}
                        </span>
                    </div>
                    <span className="text-xs text-[var(--foreground-muted)]">
                        {formatDistanceToNow(request.created_at)}
                    </span>
                </div>

                <div>
                    <h3 className="font-display font-bold text-lg text-[var(--foreground)] mb-1 line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
                        {request.title}
                    </h3>
                    <p className="text-sm text-[var(--foreground-muted)] line-clamp-2">
                        {request.description}
                    </p>
                </div>

                <div className="mt-auto pt-2 flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {request.city}
                </div>
            </div>

            <div className="p-4 bg-[var(--background-subtle)]/50 border-t border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[var(--border)] overflow-hidden">
                        {request.ngo.logo_url ? (
                            <img src={request.ngo.logo_url} alt={request.ngo.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="material-symbols-outlined text-[var(--primary)] text-sm">volunteer_activism</span>
                        )}
                    </div>
                    <span className="text-sm font-medium text-[var(--foreground)] truncate max-w-[120px]">
                        {request.ngo.name}
                    </span>
                </div>

                <Link href={`/requests/${request.id}`}>
                    <Button variant="primary" size="sm" className="shadow-none hover:shadow-md">
                        View
                    </Button>
                </Link>
            </div>
        </Card>
    );
}
