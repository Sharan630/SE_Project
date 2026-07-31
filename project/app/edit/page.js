"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { 
    User, 
    Mail, 
    Phone, 
    Linkedin, 
    Briefcase, 
    Award, 
    DollarSign, 
    Camera, 
    Calendar, 
    CheckCircle, 
    AlertCircle,
    ArrowLeft,
    Sparkles,
    Loader2
} from "lucide-react";

export default function EditProfile() {
    const [user, setUser] = useState({
        name: "",
        picture: "",
        bio: "",
        skills: [],
        experience: "",
        phone: "",
        availability: [],
        fees: "",
        linkedin: "",
        role: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [activeTab, setActiveTab] = useState("personal");
    const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }

    const router = useRouter();

    useEffect(() => {
        const email = sessionStorage.getItem("email") || localStorage.getItem("email");
        console.log("[EDIT PROFILE] Retrieved email from storage:", email);

        if (!email) {
            console.warn("[EDIT PROFILE] No email found in storage, redirecting to /login");
            router.push('/login');
            return;
        }

        const fetchUser = async () => {
            try {
                setLoading(true);
                console.log("[EDIT PROFILE] Fetching user profile for email:", email);
                const res = await axios.get(`/api/user/${encodeURIComponent(email)}`);
                console.log("[EDIT PROFILE] Received user data:", res.data);
                if (res.data) {
                    setUser({
                        ...res.data,
                        skills: Array.isArray(res.data.skills) ? res.data.skills : [],
                        availability: Array.isArray(res.data.availability) ? res.data.availability : []
                    });
                } else {
                    console.error("[EDIT PROFILE] User data is empty/null from API");
                }
            } catch (error) {
                console.error("[EDIT PROFILE] Failed to fetch user profile:", error);
                setStatusMessage({ type: "error", text: "Failed to load user profile from database." });
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "picture" && files?.[0]) {
            setImageFile(files[0]);
            setPreview(URL.createObjectURL(files[0]));
        } else if (name === "skills") {
            setUser({ ...user, [name]: value.split(",").map(skill => skill.trim()) });
        } else if (name === "phone") {
            if (/^\d{0,10}$/.test(value)) {
                setUser({ ...user, [name]: value });
            }
        } else {
            setUser({ ...user, [name]: value });
        }
    };

    const handleAvailabilityChange = (day, timeSlotsStr) => {
        const updatedAvailability = user.availability.filter(a => a.day !== day);
        const slots = timeSlotsStr.split(",").map(slot => slot.trim()).filter(Boolean);
        updatedAvailability.push({ day, timeSlots: slots });
        setUser({ ...user, availability: updatedAvailability });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage(null);
        console.log("[EDIT PROFILE] handleSubmit triggered. Current user state:", user);

        if (user.phone && user.phone.length > 0 && user.phone.length !== 10) {
            console.warn("[EDIT PROFILE] Validation failed: Phone number length is not 10 digits");
            setStatusMessage({ type: "error", text: "Phone number must be exactly 10 digits." });
            return;
        }

        const rawRole = sessionStorage.getItem('role') || user.role;
        console.log("[EDIT PROFILE] Raw role resolved:", rawRole);

        if (!rawRole) {
            console.error("[EDIT PROFILE] Validation failed: Role not identified");
            setStatusMessage({ type: "error", text: "User role not identified. Please log in again." });
            return;
        }

        const normalizedRole = rawRole.toLowerCase().trim();
        console.log("[EDIT PROFILE] Normalized role for API route:", normalizedRole);

        try {
            setSaving(true);
            let imageUrl = user.picture;

            if (imageFile) {
                console.log("[EDIT PROFILE] Uploading image file...");
                const formData = new FormData();
                formData.append("image", imageFile);
                const imgRes = await axios.post("/api/imgupload", formData);
                console.log("[EDIT PROFILE] Image uploaded successfully. URL:", imgRes.data?.imageUrl);
                imageUrl = imgRes.data.imageUrl;
            }

            const updatedUser = { ...user, picture: imageUrl };
            const updateUrl = `/api/update/${normalizedRole}`;
            console.log(`[EDIT PROFILE] Posting update to URL: ${updateUrl} with body:`, updatedUser);

            const res = await axios.post(updateUrl, updatedUser);
            console.log("[EDIT PROFILE] API update response:", res.data);
            
            setUser(updatedUser);
            setStatusMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (err) {
            console.error("[EDIT PROFILE] Profile update failed:", err);
            console.error("[EDIT PROFILE] Error response data:", err.response?.data);
            console.error("[EDIT PROFILE] Error status code:", err.response?.status);
            setStatusMessage({ 
                type: "error", 
                text: err.response?.data?.message || err.message || "Failed to update profile. Please try again." 
            });
        } finally {
            setSaving(false);
        }
    };

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                <p className="text-slate-400 font-medium animate-pulse">Loading profile settings...</p>
            </div>
        );
    }

    const isMentor = user.role === "mentor";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center py-10 px-4 relative overflow-hidden">
            {/* Background Decorative Blur Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-3xl relative z-10 space-y-6">
                {/* Top Navigation */}
                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => router.back()} 
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-full text-xs font-semibold tracking-wide text-indigo-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{user.role ? user.role.toUpperCase() : "PROFILE"}</span>
                    </div>
                </div>

                {/* Profile Header Card */}
                <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Avatar Upload Container */}
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-indigo-500/50 shadow-xl bg-slate-800 flex items-center justify-center text-slate-500">
                                {preview || user.picture ? (
                                    <img 
                                        src={preview || user.picture} 
                                        alt={user.name || "Profile"} 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <User className="w-12 h-12" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-full cursor-pointer shadow-lg transition-transform transform hover:scale-105 border-2 border-slate-900">
                                <Camera className="w-4 h-4" />
                                <input 
                                    type="file" 
                                    name="picture" 
                                    accept="image/*" 
                                    onChange={handleChange} 
                                    className="hidden" 
                                />
                            </label>
                        </div>

                        {/* Info Header */}
                        <div className="text-center sm:text-left space-y-1">
                            <h1 className="text-2xl font-bold text-white tracking-tight">{user.name || "Your Name"}</h1>
                            <p className="text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                                {user.email}
                            </p>
                            <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs rounded-full font-medium">
                                    {isMentor ? "Mentor" : "Mentee"} Account
                                </span>
                                {user.phone && (
                                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full font-medium">
                                        +91 {user.phone}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Alert Message */}
                {statusMessage && (
                    <div className={`p-4 rounded-2xl border flex items-center gap-3 backdrop-blur-md animate-fade-in ${
                        statusMessage.type === 'success' 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}>
                        {statusMessage.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                        ) : (
                            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                        )}
                        <p className="text-sm font-medium">{statusMessage.text}</p>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8">
                    {/* Form Tabs */}
                    <div className="flex border-b border-slate-800 mb-6 gap-6">
                        <button
                            type="button"
                            onClick={() => setActiveTab("personal")}
                            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                                activeTab === "personal" 
                                    ? "border-indigo-500 text-indigo-400" 
                                    : "border-transparent text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            Personal Details
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("professional")}
                            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                                activeTab === "professional" 
                                    ? "border-indigo-500 text-indigo-400" 
                                    : "border-transparent text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            Professional & Skills
                        </button>
                        {isMentor && (
                            <button
                                type="button"
                                onClick={() => setActiveTab("availability")}
                                className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                                    activeTab === "availability" 
                                        ? "border-indigo-500 text-indigo-400" 
                                        : "border-transparent text-slate-400 hover:text-slate-200"
                                }`}
                            >
                                Availability Schedule
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Tab 1: Personal Details */}
                        {activeTab === "personal" && (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-indigo-400" /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={user.name || ""}
                                        onChange={handleChange}
                                        placeholder="e.g. Alex Johnson"
                                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5 text-indigo-400" /> Phone Number (10 Digits)
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={user.phone || ""}
                                        onChange={handleChange}
                                        placeholder="e.g. 9876543210"
                                        maxLength={10}
                                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Linkedin className="w-3.5 h-3.5 text-indigo-400" /> LinkedIn Profile URL
                                    </label>
                                    <input
                                        type="url"
                                        name="linkedin"
                                        value={user.linkedin || ""}
                                        onChange={handleChange}
                                        placeholder="https://linkedin.com/in/username"
                                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        Bio & About Yourself
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={user.bio || ""}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Write a brief overview about yourself, goals, or expectations..."
                                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-600 resize-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Tab 2: Professional Details */}
                        {activeTab === "professional" && (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Award className="w-3.5 h-3.5 text-indigo-400" /> Skills (Comma Separated)
                                    </label>
                                    <input
                                        type="text"
                                        name="skills"
                                        value={user.skills?.join(", ") || ""}
                                        onChange={handleChange}
                                        placeholder="React, Next.js, Node.js, Python, UI/UX"
                                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-600"
                                    />
                                    {/* Skills Badge Preview */}
                                    {user.skills?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {user.skills.map((skill, index) => (
                                                skill && (
                                                    <span key={index} className="px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs rounded-lg font-medium">
                                                        {skill}
                                                    </span>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Experience (in Years)
                                    </label>
                                    <input
                                        type="text"
                                        name="experience"
                                        value={user.experience || ""}
                                        onChange={handleChange}
                                        placeholder="e.g. 3"
                                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                {isMentor && (
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <DollarSign className="w-3.5 h-3.5 text-indigo-400" /> Mentorship Fee (₹ per session)
                                        </label>
                                        <input
                                            type="text"
                                            name="fees"
                                            value={user.fees || ""}
                                            onChange={handleChange}
                                            placeholder="e.g. 500"
                                            className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-600"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab 3: Availability Schedule (Mentor only) */}
                        {activeTab === "availability" && isMentor && (
                            <div className="space-y-4">
                                <p className="text-xs text-slate-400 mb-2">
                                    Set your available time slots for each day (separated by commas, e.g. <code className="text-indigo-400">10:00 AM, 02:00 PM, 06:00 PM</code>).
                                </p>
                                {daysOfWeek.map((day) => (
                                    <div key={day} className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                        <span className="w-28 text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {day}
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="e.g. 9:00 AM, 2:00 PM"
                                            value={user.availability?.find(a => a.day === day)?.timeSlots.join(", ") || ""}
                                            onChange={(e) => handleAvailabilityChange(day, e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-lg px-3 py-2 text-xs outline-none transition-all placeholder:text-slate-700"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-slate-800 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Save Profile Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}