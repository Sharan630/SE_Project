'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function MenteeRequests() {
    const router = useRouter();

    const [menteeRequests, setMenteeRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        const email = sessionStorage.getItem('email');

        if (!email) {
            router.push('/login');
            return;
        }

        const fetchRequests = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await axios.get(`/api/user/mentor/${email}`);
                const notifications = Array.isArray(res.data) ? res.data : [];

                const results = await Promise.allSettled(
                    notifications.map(async (notif) => {
                        try {
                            const menteeRes = await axios.get(`/api/user/id/${notif.from}`);

                            if (!menteeRes?.data) return null;

                            return {
                                id: notif._id,
                                message: notif.message || '',
                                mentee: menteeRes.data,
                            };
                        } catch {
                            return null;
                        }
                    })
                );

                const safeData = results
                    .filter(r => r.status === 'fulfilled' && r.value)
                    .map(r => r.value);

                setMenteeRequests(safeData);
            } catch (err) {
                console.error(err);
                setError('Failed to load mentee requests.');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [router]);

    const handleAccept = async (id) => {
        try {
            setProcessingId(id);

            const email = sessionStorage.getItem('email');

            await axios.post('/api/notification/book', {
                plan: 'free',
                email,
                paymentId: '',
                price: 0,
                notif_id: id,
            });

            await axios.delete(`/api/notification/${id}`);

            setMenteeRequests(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to accept request. Please try again.');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        try {
            setProcessingId(id);

            await axios.delete(`/api/notification/${id}`);
            setMenteeRequests(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to reject request.');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading mentee requests...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-indigo-600">
                        Mentor Portal
                    </h1>
                    <Image
                        src="/avatar.png"
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-bold mb-6">Mentee Requests</h1>

                {menteeRequests.length === 0 ? (
                    <div className="bg-white p-6 rounded shadow text-center text-gray-500">
                        No pending mentee requests
                    </div>
                ) : (
                    <ul className="bg-white shadow rounded divide-y">
                        {menteeRequests.map(({ id, message, mentee }) => (
                            <li key={id} className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4 items-center">
                                        {/* <Image
                                            src={mentee?.picture ?? '/avatar.png'}
                                            alt={mentee?.name ?? 'User'}
                                            width={48}
                                            height={48}
                                            className="rounded-full"
                                        /> */}

                                        <div>
                                            <h2 className="font-semibold">
                                                {mentee?.name ?? 'Unknown User'}
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                {mentee?.bio ?? 'No bio available'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {mentee?.email ?? 'No email'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            disabled={processingId === id}
                                            onClick={() => handleAccept(id)}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            disabled={processingId === id}
                                            onClick={() => handleReject(id)}
                                            className="px-4 py-2 border rounded disabled:opacity-50"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>

                                {message && (
                                    <p className="mt-4 text-gray-700">{message}</p>
                                )}

                                {Array.isArray(mentee?.skills) && mentee.skills.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {mentee.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}
