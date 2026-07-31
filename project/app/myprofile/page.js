"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function MyProfile() {
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
        role: "",
        email: "",
        ratings: { average: 0, reviews: [] },
        connected: []
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [connectedUsers, setConnectedUsers] = useState([]);

    useEffect(() => {
        const fetchConnections = async () => {
            if (user.connected && user.connected.length > 0) {
                const uniquePairs = new Set();
                const uniqueConnections = [];

                for (const conn of user.connected) {
                    console.log(conn);
                    const pairKey = `${conn.mentorid}-${conn.menteeid}`;
                    if (!uniquePairs.has(pairKey)) {
                        uniquePairs.add(pairKey);

                        const res = await fetch(`/api/user/id/${conn.user}`);
                        const data = await res.json();

                        uniqueConnections.push(data);
                    }
                }

                setConnectedUsers(uniqueConnections);
                console.log(uniqueConnections)
            }
        };

        fetchConnections();
    }, [user.connected]);

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
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = () => {
        sessionStorage.clear();
        // sessionStorage.removeItem("email");
        // sessionStorage.removeItem("name");
        // sessionStorage.removeItem("role");
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white mb-4 md:mb-0 md:mr-6">
                                {user.picture ? (
                                    <img
                                        src={user.picture}
                                        alt={user.name || "Profile"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                        <span className="text-gray-500 text-2xl">
                                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold">{user.name || "User"}</h1>
                                <p className="text-lg opacity-90 capitalize">{user.role}</p>
                                <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                                    {user.skills?.map((skill, index) => (
                                        <span key={index} className="bg-white text-black bg-opacity-20 px-3 py-1 rounded-full text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Personal Information</h2>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xl text-black-500">Email</p>
                                        <p className="text-gray-800">{user.email}</p>
                                    </div>
                                    {user.phone && (
                                        <div>
                                            <p className="text-xl text-black-500">Phone</p>
                                            <p className="text-gray-800">{user.phone}</p>
                                        </div>
                                    )}
                                    {user.bio && (
                                        <div>
                                            <p className="text-xl text-black-500">Bio</p>
                                            <p className="text-gray-800">{user.bio}</p>
                                        </div>
                                    )}
                                    {user.experience && (
                                        <div>
                                            <p className="text-xl text-black-500">Experience</p>
                                            <p className="text-gray-800">{user.experience} years</p>
                                        </div>
                                    )}
                                    {user.linkedin && (
                                        <div>
                                            <p className="text-xl text-black-500">LinkedIn</p>
                                            <a href={user.linkedin} target="_blank" rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline">{user.linkedin}</a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                {user.role === "mentor" && (
                                    <>
                                        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Mentorship Details</h2>
                                        {user.fees && (
                                            <div className="mb-4">
                                                <p className="text-xl text-black-500">Fees</p>
                                                <p className="text-gray-800">{user.fees}</p>
                                            </div>
                                        )}
                                        {user.ratings && (
                                            <div className="mb-4">
                                                <p className="text-xl text-black-500">Rating</p>
                                                <div className="flex items-center">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <svg key={star} className={`w-5 h-5 ${star <= Math.round(user.ratings?.average || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                    <span className="ml-2 text-gray-700">
                                                        {(user.ratings?.average ?? 0).toFixed(1)} ({user.ratings?.reviews?.length || 0} reviews)
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        {user.availability && user.availability.length > 0 && (
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800 mb-2">Availability</h2>
                                                {user.availability
                                                    .filter(slot => slot.timeSlots?.length)
                                                    .sort((a, b) => {
                                                        const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                                                        return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
                                                    })
                                                    .map((slot, index) => (
                                                        <div key={index} className="mb-2">
                                                            <strong>{slot.day}</strong>
                                                            <ul className="list-disc list-inside">
                                                                {slot.timeSlots.map((time, idx) => (
                                                                    <li key={idx}>{time}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </>
                                )}

                                <div>
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Connections</h2>
                                    <p className="text-gray-700 mb-3">
                                        {connectedUsers?.length || 0} connections
                                    </p>
                                    {connectedUsers && connectedUsers.length > 0 ? (
                                        <ul className="space-y-2">
                                            {connectedUsers.map((connection, index) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    {connection.picture && (
                                                        <img
                                                            src={connection.picture}
                                                            alt={`${connection.name}'s avatar`}
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                    )}
                                                    <span className="text-gray-800">{connection.name}</span>
                                                    <span className="text-gray-800">{connection.endDate}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 italic">No connections yet</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-8 flex justify-center md:justify-end space-x-4">
                            <Link href="/edit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Edit Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}