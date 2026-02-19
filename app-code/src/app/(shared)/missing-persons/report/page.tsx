"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { missingPersonsApi } from "@/lib/api";

export default function ReportMissingPersonPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        age: "",
        gender: "",
        photo_url: "",
        height: "",
        build: "",
        hair_color: "",
        eye_color: "",
        distinguishing_marks: "",
        last_seen_date: "",
        last_seen_location: "",
        last_seen_city: "",
        last_seen_state: "",
        clothing_description: "",
        medical_conditions: "",
        contact_name: "",
        contact_phone: "",
        contact_email: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await missingPersonsApi.create({
                full_name: formData.full_name,
                age: formData.age ? parseInt(formData.age) : null,
                gender: formData.gender as any || null,
                photo_url: formData.photo_url || null,
                height: formData.height || null,
                build: formData.build || null,
                hair_color: formData.hair_color || null,
                eye_color: formData.eye_color || null,
                distinguishing_marks: formData.distinguishing_marks || null,
                last_seen_date: formData.last_seen_date || null,
                last_seen_location: formData.last_seen_location || null,
                last_seen_city: formData.last_seen_city || null,
                last_seen_state: formData.last_seen_state || null,
                clothing_description: formData.clothing_description || null,
                medical_conditions: formData.medical_conditions || null,
                contact_name: formData.contact_name || null,
                contact_phone: formData.contact_phone || null,
                contact_email: formData.contact_email || null,
            });

            alert("Report submitted successfully!");
            router.push("/missing-persons");
        } catch (error) {
            console.error("Error submitting report:", error);
            alert("Failed to submit report. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <PageHeader
                title="Report Missing Person"
                showBack
                fallbackRoute="/missing-persons"
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Person Details */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-semibold mb-4">Missing Person Details</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full h-12 rounded-xl border border-gray-200 px-4"
                                placeholder="Enter person's full name"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Age</label>
                                <input
                                    type="number"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4"
                                    placeholder="Age"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Gender</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4"
                                >
                                    <option value="">Select gender</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Photo URL</label>
                            <input
                                type="url"
                                value={formData.photo_url}
                                onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                                className="w-full h-12 rounded-xl border border-gray-200 px-4"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>

                {/* Physical Description */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-semibold mb-4">Physical Description</h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Height</label>
                                <input
                                    type="text"
                                    value={formData.height}
                                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4"
                                    placeholder="e.g., 5 ft 8 in"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Build</label>
                                <input
                                    type="text"
                                    value={formData.build}
                                    onChange={(e) => setFormData({ ...formData, build: e.target.value })}
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4"
                                    placeholder="e.g., Slim, Average"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Hair Color</label>
                                <input
                                    type="text"
                                    value={formData.hair_color}
                                    onChange={(e) => setFormData({ ...formData, hair_color: e.target.value })}
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4"
                                    placeholder="e.g., Black, Brown"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Eye Color</label>
                                <input
                                    type="text"
                                    value={formData.eye_color}
                                    onChange={(e) => setFormData({ ...formData, eye_color: e.target.value })}
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4"
                                    placeholder="e.g., Black, Brown"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Distinguishing Marks</label>
                            <textarea
                                value={formData.distinguishing_marks}
                                onChange={(e) => setFormData({ ...formData, distinguishing_marks: e.target.value })}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 resize-none"
                                rows={2}
                                placeholder="Scars, tattoos, birthmarks, etc."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Clothing Description</label>
                            <textarea
                                value={formData.clothing_description}
                                onChange={(e) => setFormData({ ...formData, clothing_description: e.target.value })}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 resize-none"
                                rows={2}
                                placeholder="What was the person wearing?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Medical Conditions</label>
                            <textarea
                                value={formData.medical_conditions}
                                onChange={(e) => setFormData({ ...formData, medical_conditions: e.target.value })}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 resize-none"
                                rows={2}
                                placeholder="Any known medical conditions"
                            />
                        </div>
                    </div>
                </div>

                {/* Last Seen Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-semibold mb-4">Last Seen Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Last Seen Date</label>
                            <input
                                type="date"
                                value={formData.last_seen_date}
                                onChange={(e) => setFormData({ ...formData, last_seen_date: e.target.value })}
                                className="w-full h-12 rounded-xl border border-gray-200 px-4"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Last Seen Location</label>
                            <input
                                type="text"
                                value={formData.last_seen_location}
                                onChange={(e) => setFormData({ ...formData, last_seen_location: e.target.value })}
                                className="w-full h-12 rounded-xl border border-gray-200 px-4"
                                placeholder="Specific location/address"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">City</label>
                                <input
                                    type="text"
                                    value={formData.last_seen_city}
                                    onChange={(e) => setFormData({ ...formData, last_seen_city: e.target.value })}
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4"
                                    placeholder="City"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">State</label>
                                <input
                                    type="text"
                                    value={formData.last_seen_state}
                                    onChange={(e) => setFormData({ ...formData, last_seen_state: e.target.value })}
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4"
                                    placeholder="State"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-semibold mb-4">Contact Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Contact Name</label>
                            <input
                                type="text"
                                value={formData.contact_name}
                                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                                className="w-full h-12 rounded-xl border border-gray-200 px-4"
                                placeholder="Your name"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.contact_phone}
                                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4"
                                    placeholder="Phone number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.contact_email}
                                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4"
                                    placeholder="Email address"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="p-6">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl disabled:opacity-50"
                    >
                        {submitting ? "Submitting..." : "Submit Report"}
                    </button>
                </div>
            </form>
        </div>
    );
}
