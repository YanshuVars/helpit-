"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface NGOOption {
    id: string;
    name: string;
    logo_url: string | null;
    verification_status: string;
}

export default function DonatePage() {
    const router = useRouter();
    const [ngos, setNgos] = useState<NGOOption[]>([]);
    const [selectedNgo, setSelectedNgo] = useState("");
    const [amount, setAmount] = useState<number | null>(1000);
    const [customAmount, setCustomAmount] = useState("");
    const [loading, setLoading] = useState(true);
    const presetAmounts = [500, 1000, 2500, 5000, 10000];

    useEffect(() => {
        async function fetchNgos() {
            const supabase = createClient();
            const { data } = await supabase.from('ngos')
                .select('id, name, logo_url, verification_status')
                .eq('verification_status', 'APPROVED')
                .order('name', { ascending: true });
            setNgos(data || []);
            setLoading(false);
        }
        fetchNgos();
    }, []);

    const displayAmount = customAmount ? parseInt(customAmount) || 0 : (amount || 0);

    const handleContinue = () => {
        const ngoId = selectedNgo;
        if (!ngoId) return;
        const params = new URLSearchParams({
            ngoId,
            amount: displayAmount.toString(),
        });
        router.push(`/donor/donate/details?${params.toString()}`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
                <Link href="/donor" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span> Back
                </Link>
                <h1 className="page-title">Make a Donation</h1>
            </div>

            {/* Select NGO */}
            <div className="card" style={{ padding: 16 }}>
                <label className="field-label">Select an NGO to donate to:</label>
                {loading ? (
                    <div style={{ padding: 12, textAlign: 'center' }}>
                        <span className="material-symbols-outlined animate-spin" style={{ fontSize: 20, color: '#1de2d1' }}>progress_activity</span>
                    </div>
                ) : (
                    <select className="field-input" style={{ marginTop: 8 }}
                        value={selectedNgo} onChange={e => setSelectedNgo(e.target.value)}>
                        <option value="">Choose an NGO</option>
                        {ngos.map(ngo => (
                            <option key={ngo.id} value={ngo.id}>{ngo.name}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Amount Selection */}
            <div className="card" style={{ padding: 16 }}>
                <label className="field-label">Select Amount</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, margin: '10px 0 14px' }}>
                    {presetAmounts.map(preset => (
                        <button key={preset} onClick={() => { setAmount(preset); setCustomAmount(""); }}
                            className={amount === preset && !customAmount ? "btn btn-primary" : "btn btn-secondary"}
                            style={{ justifyContent: 'center', fontSize: 13 }}
                        >₹{preset.toLocaleString()}</button>
                    ))}
                </div>
                <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontWeight: 600 }}>₹</span>
                    <input type="number" placeholder="Enter custom amount" value={customAmount}
                        onChange={e => { setCustomAmount(e.target.value); setAmount(null); }}
                        className="field-input" style={{ paddingLeft: 28 }}
                    />
                </div>
            </div>

            {/* Continue Button */}
            <button
                onClick={handleContinue}
                disabled={!selectedNgo || displayAmount <= 0}
                className="btn btn-primary"
                style={{
                    width: '100%', justifyContent: 'center', height: 46, fontSize: 15, fontWeight: 700,
                    opacity: (!selectedNgo || displayAmount <= 0) ? 0.5 : 1,
                    cursor: (!selectedNgo || displayAmount <= 0) ? 'not-allowed' : 'pointer',
                }}
            >
                Continue • ₹{displayAmount.toLocaleString()}
            </button>
        </div>
    );
}
