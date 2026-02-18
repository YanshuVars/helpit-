"use client";

import { useState } from "react";
import Link from "next/link";

const availableSkills = [
    "First Aid", "CPR", "Driving", "Teaching", "Photography", "Video Editing",
    "Social Media", "Cooking", "Medical", "Nursing", "Counseling", "Translation",
    "Computer Skills", "Event Planning", "Fundraising", "Animal Care", "Gardening",
    "Construction", "Electrical", "Plumbing", "Language", "Music", "Art", "Sports"
];

export default function EditVolunteerProfilePage() {
    const [name, setName] = useState("Alex Johnson");
    const [username, setUsername] = useState("@alexvolunteer");
    const [bio, setBio] = useState("Passionate volunteer dedicated to helping communities in need.");
    const [location, setLocation] = useState("Mumbai, Maharashtra");
    const [phone, setPhone] = useState("+91 98765 43210");
    const [skills, setSkills] = useState<string[]>(["First Aid", "Driving", "Teaching", "Photography"]);
    const [isAvailable, setIsAvailable] = useState(true);
    const [availabilityHours, setAvailabilityHours] = useState("Weekends");
    const [isSaving, setIsSaving] = useState(false);

    const toggleSkill = (skill: string) => {
        if (skills.includes(skill)) {
            setSkills(skills.filter(s => s !== skill));
        } else {
            setSkills([...skills, skill]);
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            window.history.back();
        }, 1000);
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/volunteer/profile" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-xl font-bold">Edit Profile</h1>
            </div>

            {/* Profile Picture */}
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-400 flex items-center justify-center text-white text-3xl font-bold mb-3">
                    {name.charAt(0)}
                </div>
                <button className="text-[var(--primary)] text-sm font-semibold">Change Photo</button>
            </div>

            {/* Form */}
            <div className="space-y-4">
                {/* Basic Info */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-4">
                    <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Basic Information</h3>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Phone</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                        />
                    </div>
                </div>

                {/* Availability */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-4">
                    <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Availability</h3>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Available for Volunteering</p>
                            <p className="text-sm text-gray-500">Turn on to receive notifications about opportunities</p>
                        </div>
                        <button
                            onClick={() => setIsAvailable(!isAvailable)}
                            className={`relative w-14 h-8 rounded-full transition-colors ${isAvailable ? "bg-green-500" : "bg-gray-300"}`}
                        >
                            <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${isAvailable ? "left-7" : "left-1"}`} />
                        </button>
                    </div>

                    {isAvailable && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">When are you available?</label>
                            <select
                                value={availabilityHours}
                                onChange={(e) => setAvailabilityHours(e.target.value)}
                                className="w-full h-12 rounded-xl border border-gray-200 px-4 bg-white"
                            >
                                <option value="Weekdays Morning">Weekdays - Morning</option>
                                <option value="Weekdays Evening">Weekdays - Evening</option>
                                <option value="Weekends">Weekends</option>
                                <option value="Flexible">Flexible</option>
                                <option value="Anytime">Anytime</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Skills */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Skills</h3>
                        <span className="text-xs text-gray-400">{skills.length} selected</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {availableSkills.map((skill) => (
                            <button
                                key={skill}
                                onClick={() => toggleSkill(skill)}
                                className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${skills.includes(skill)
                                        ? "bg-[var(--primary)] text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-4">
                    <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Preferences</h3>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Maximum Travel Distance</label>
                        <select className="w-full h-12 rounded-xl border border-gray-200 px-4 bg-white">
                            <option value="5">Within 5 km</option>
                            <option value="10">Within 10 km</option>
                            <option value="25" selected>Within 25 km</option>
                            <option value="50">Within 50 km</option>
                            <option value="any">Any distance</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Preferred Causes</label>
                        <div className="flex flex-wrap gap-2">
                            {["Education", "Health", "Environment", "Animal Welfare", "Disaster Relief"].map((cause) => (
                                <button
                                    key={cause}
                                    className="px-3 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                                >
                                    {cause}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="sticky bottom-24 bg-[var(--background-light)] pt-4 space-y-3">
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
                            Save Changes
                        </>
                    )}
                </button>
                <Link
                    href="/volunteer/profile"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white font-semibold text-sm"
                >
                    Cancel
                </Link>
            </div>
        </div>
    );
}
