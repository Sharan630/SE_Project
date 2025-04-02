"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";

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
        linkedin: ""
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const email = sessionStorage.getItem("email");
        const name = sessionStorage.getItem("name");

        if (!email) {
            router.push('/login');
            return;
        }

        if (!name) {
            router.push('/register');
            return;
        }

        const fetchUser = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/user/${email}`);
                setUser({
                    ...res.data,
                    skills: Array.isArray(res.data.skills) ? res.data.skills : [],
                    availability: Array.isArray(res.data.availability) ? res.data.availability : []
                });
                console.log(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "skills") {
            setUser({ ...user, [name]: value.split(",").map(skill => skill.trim()) });
        } else if (name === "phone") {
            if (/^\d{0,10}$/.test(value)) {
                setUser({ ...user, [name]: value });
            }
        } else {
            setUser({ ...user, [name]: value });
        }
    };

    const handleAvailabilityChange = (day, timeSlots) => {
        const updatedAvailability = user.availability.filter(a => a.day !== day);
        updatedAvailability.push({ day, timeSlots: timeSlots.split(",").map(slot => slot.trim()) });
        setUser({ ...user, availability: updatedAvailability });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (user.phone && user.phone.length !== 10) {
            alert("Phone number must be exactly 10 digits.");
            return;
        }

        if (user.password && user.password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        const role = sessionStorage.getItem('role');

        try {
            const res = await axios.post(`/api/update/${role}`, user);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile. Please try again later.");
        }
    };

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/editbg.jpeg')] bg-cover bg-center p-4">
            <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-lg shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-center text-black mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[70vh]" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    <div>
                        <label className="block text-black py-2 font-bold">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={user.name || ""}
                            onChange={handleChange}
                            className="w-full bg-white bg-opacity-50 text-black p-2 rounded border-2 border-black focus:outline-none focus:ring focus:ring-blue-100"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-black py-2 font-bold">Profile Picture URL</label>
                        <input
                            type="file"
                            name="picture"
                            value={user.picture || ""}
                            onChange={handleChange}
                            className="w-full bg-white bg-opacity-30 text-black p-2 rounded border-2 border-black focus:outline-none focus:ring focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="block text-black py-2 font-bold">Bio</label>
                        <textarea
                            name="bio"
                            value={user.bio || ""}
                            onChange={handleChange}
                            className="w-full bg-white bg-opacity-30 text-black p-2 rounded border-2 border-black focus:outline-none focus:ring focus:ring-blue-100"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-black py-2 font-bold">Skills (comma-separated)</label>
                        <input
                            type="text"
                            name="skills"
                            value={user.skills?.join(", ") || ""}
                            onChange={handleChange}
                            className="w-full bg-white bg-opacity-30 text-black p-2 rounded border-2 border-black focus:outline-none focus:ring focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="block text-black py-2 font-bold">Experience (years)</label>
                        <input
                            type="text"
                            name="experience"
                            value={user.experience || ""}
                            onChange={handleChange}
                            className="w-full bg-white bg-opacity-30 text-black p-2 border-2 border-black focus:outline-none focus:ring focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="block text-black py-2 font-bold">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={user.phone || ""}
                            onChange={handleChange}
                            className="w-full bg-white bg-opacity-30 text-black p-2 rounded border-2 border-black focus:outline-none focus:ring focus:ring-blue-100"
                            maxLength={10}
                        />
                    </div>

                    <div>
                        <label className="block text-black py-2 font-bold">LinkedIn Profile</label>
                        <input
                            type="text"
                            name="linkedin"
                            value={user.linkedin || ""}
                            onChange={handleChange}
                            className="w-full bg-white bg-opacity-30 text-black p-2 rounded border-2 border-black focus:outline-none focus:ring focus:ring-blue-100"
                        />
                    </div>

                    {user.role === "mentor" && (
                        <div>
                            <label className="block text-black py-2 font-bold">Fees</label>
                            <input
                                type="text"
                                name="fees"
                                value={user.fees || ""}
                                onChange={handleChange}
                                className="w-full bg-white bg-opacity-30 text-black p-2 rounded border-2 border-black focus:outline-none focus:ring focus:ring-blue-100"
                            />
                        </div>
                    )}

                    {user.role === "mentor" && (
                        <div>
                            <label className="block text-black py-2 font-bold">Availability</label>
                            {daysOfWeek.map((day) => (
                                <div key={day} className="mb-2">
                                    <label className="inline-block mr-2">{day}:</label>
                                    <input
                                        type="text"
                                        placeholder="9:00 AM, 2:00 PM, 6:00 PM"
                                        value={user.availability.find(a => a.day === day)?.timeSlots.join(", ") || ""}
                                        onChange={(e) => handleAvailabilityChange(day, e.target.value)}
                                        className="w-full bg-white bg-opacity-30 text-black p-2 rounded border-2 border-black focus:outline-none focus:ring focus:ring-blue-100"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
}