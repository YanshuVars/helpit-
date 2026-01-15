import { PageHeader } from "@/components/ui/PageHeader";

export default function VolunteerProfilePage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="My Profile" showBack fallbackRoute="/volunteer" />

            {/* Profile Header */}
            <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-400 flex items-center justify-center text-white text-3xl font-bold mb-4">
                    A
                </div>
                <h2 className="text-xl font-bold">Alex Johnson</h2>
                <p className="text-sm text-gray-500">@alexvolunteer</p>
                <button className="mt-3 text-[var(--primary)] text-sm font-semibold min-h-[44px]">Edit Profile</button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center justify-center p-5 min-h-[100px] bg-white rounded-xl border border-gray-200">
                    <p className="text-2xl font-bold">124</p>
                    <p className="text-xs text-gray-500 mt-1">Hours</p>
                </div>
                <div className="flex flex-col items-center justify-center p-5 min-h-[100px] bg-white rounded-xl border border-gray-200">
                    <p className="text-2xl font-bold">18</p>
                    <p className="text-xs text-gray-500 mt-1">Tasks</p>
                </div>
                <div className="flex flex-col items-center justify-center p-5 min-h-[100px] bg-white rounded-xl border border-gray-200">
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-xs text-gray-500 mt-1">NGOs</p>
                </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {["First Aid", "Driving", "Teaching", "Photography"].map((skill) => (
                        <span key={skill} className="px-3 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Achievements Preview */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Achievements</h3>
                    <button className="text-[var(--primary)] text-sm font-semibold min-h-[44px]">View All</button>
                </div>
                <div className="flex gap-3">
                    {["🏆", "⭐", "🎖️"].map((emoji, i) => (
                        <div key={i} className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-xl">
                            {emoji}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

