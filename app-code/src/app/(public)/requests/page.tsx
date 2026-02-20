"use client";

import { useEffect, useState, Suspense } from "react";
import { getPublicRequests } from "@/lib/api/requests";
import { RequestCard } from "@/components/ui/RequestCard";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function SearchFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [city, setCity] = useState(searchParams.get("city") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");

    function handleSearch() {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (city) params.set("city", city);
        if (category) params.set("category", category);
        router.push(`/requests?${params.toString()}`);
    }

    return (
        <Card className="mb-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                    <Input
                        placeholder="Search for requests..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        icon="search"
                    />
                </div>
                <div>
                    <Input
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        icon="location_on"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="relative w-full">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="h-11 w-full rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
                        >
                            <option value="">All Categories</option>
                            <option value="MEDICAL">Medical</option>
                            <option value="FOOD">Food</option>
                            <option value="EDUCATION">Education</option>
                            <option value="CLOTHING">Clothing</option>
                            <option value="OTHER">Other</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">expand_more</span>
                    </div>
                    <Button onClick={handleSearch} variant="primary" size="sm" icon="arrow_forward" />
                </div>
            </div>
        </Card>
    );
}

function RequestsContent() {
    const searchParams = useSearchParams();
    const [requests, setRequests] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const category = searchParams.get("category") || undefined;
    const city = searchParams.get("city") || undefined;

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const res = await getPublicRequests({
                    category: category as any,
                    city: city,
                    page: 1,
                    limit: 100
                });
                setRequests(res.requests);
                setTotal(res.total);
            } catch (error) {
                console.error("Failed to fetch requests", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [category, city]);

    return (
        <>
            <Suspense fallback={<div className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>}>
                <div className="animate-slideUp stagger-1">
                    <SearchFilters />
                </div>
            </Suspense>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse"></div>
                    ))}
                </div>
            ) : requests.length > 0 ? (
                <div className="animate-slideUp stagger-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[var(--foreground)]">
                            {total} {total === 1 ? 'Request' : 'Requests'} Found
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requests.map((req) => (
                            <RequestCard key={req.id} request={req} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-[var(--border)] animate-fadeIn">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <span className="material-symbols-outlined text-3xl">search_off</span>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">No requests found</h3>
                    <p className="text-[var(--foreground-muted)]">Try adjusting your filters or search terms.</p>
                </div>
            )}
        </>
    );
}

export default function RequestsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12 animate-slideDown">
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-[var(--foreground)] tracking-tight">
                    Volunteer <span className="text-gradient">Opportunities</span>
                </h1>
                <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
                    Find meaningful ways to contribute to your community. Browse urgent requests from verified NGOs and make a difference today.
                </p>
            </div>

            <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse"></div>
                    ))}
                </div>
            }>
                <RequestsContent />
            </Suspense>
        </div>
    );
}
