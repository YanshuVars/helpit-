"use client";

import { useState } from "react";
import Link from "next/link";

interface ToggleState {
    [key: string]: boolean;
}

export default function NotificationSettingsPage() {
    const [pushToggles, setPushToggles] = useState<ToggleState>({
        "New volunteer applications": true,
        "Donation updates": true,
        "Request status changes": true,
        "Messages": true,
    });

    const [emailToggles, setEmailToggles] = useState<ToggleState>({
        "Weekly summary": true,
        "Important updates only": true,
        "Marketing & tips": false,
    });

    const [isSaving, setIsSaving] = useState(false);

    const togglePush = (key: string) => {
        setPushToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleEmail = (key: string) => {
        setEmailToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/notifications" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold">Notification Preferences</h1>
            </div>

            <div className="space-y-4">
                {/* Push Notifications */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-gray-500 uppercase">Push Notifications</h3>
                        <span className="flex items-center gap-1 text-xs text-green-600">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Enabled
                        </span>
                    </div>

                    {Object.entries(pushToggles).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-none">
                            <span className="text-sm font-medium">{key}</span>
                            <button
                                onClick={() => togglePush(key)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${value ? "bg-[var(--primary)]" : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${value ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Email Notifications */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-gray-500 uppercase">Email Notifications</h3>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                            Via Resend
                        </span>
                    </div>

                    {Object.entries(emailToggles).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-none">
                            <span className="text-sm font-medium">{key}</span>
                            <button
                                onClick={() => toggleEmail(key)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${value ? "bg-[var(--primary)]" : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${value ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Notification Sound */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-sm text-gray-500 uppercase">Sound & Vibration</h3>
                    </div>

                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium">Notification Sound</span>
                            <select className="text-sm bg-gray-100 rounded-lg px-3 py-1.5 border-none">
                                <option>Default</option>
                                <option>Silent</option>
                                <option>Custom</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Vibrate</span>
                            <button className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[var(--primary)] transition-colors">
                                <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quiet Hours */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-sm text-gray-500 uppercase">Quiet Hours</h3>
                                <p className="text-xs text-gray-400 mt-1">Pause notifications during specific hours</p>
                            </div>
                            <button className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-300 transition-colors">
                                <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Do Not Disturb */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">Do Not Disturb</h3>
                                <p className="text-xs text-gray-400 mt-1">Pause all notifications temporarily</p>
                            </div>
                            <button className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg">
                                Enable
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isSaving ? (
                    <>
                        <span className="material-symbols-outlined animate-spin">sync</span>
                        Saving...
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined">save</span>
                        Save Preferences
                    </>
                )}
            </button>
        </div>
    );
}
