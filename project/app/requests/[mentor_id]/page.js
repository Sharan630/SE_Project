'use client';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function MenteeRequests() {
    // Sample data - in a real app, this would come from API/database
    const [mentees, setmentees] = useState([]);
    const router = useRouter();
    const { mentoremail } = useParams();
    const [notifi, setnotifications] = useState([]);

    const [menteeRequests, setMenteeRequests] = useState([]);

    useEffect(() => {

        const email = sessionStorage.getItem("email");
        if (!email) {
            router.push("/login");
            return;
        }

        const fetchMentors = async () => {
            try {
                const res = await axios.get(`/api/user/mentor/${email}`);
                const mentor_ids = res.data;  // Array of mentor objects with 'from' field
                // console.log(mentor_ids);

                // Fetch mentor details and combine with their IDs
                const data = await Promise.all(
                    mentor_ids.map(async (mentor) => {
                        const fetched = await axios.get(`/api/user/id/${mentor.from}`);
                        return {
                            message: mentor.message,
                            mentee_data: fetched.data,
                            id: mentor._id
                        };
                    })
                );

                setMenteeRequests(data);

                console.log("Final Data:", data);
            } catch (error) {
                console.error("Error fetching mentors:", error);
            }
        };

        fetchMentors();
    }, [])

    // Function to handle accepting a request
    const handleAccept = async (id) => {
        // console.log(id);
        const email = sessionStorage.getItem('email');
        const plan = "free";
        const paymentId = "";
        await axios.delete(`/api/notification/${id}`);
        const res = await axios.post('/api/notofication/book', {plan, email, paymentId, });
        console.log(res);
        // In a real app, you would also make an API call to update the status
    };

    // Function to handle rejecting a request
    const handleReject = async (id) => {
        // console.log(id);
        await axios.delete(`/api/notification/${id}`);

        // In a real app, you would also make an API call to update the status
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>Mentee Requests | Mentor Dashboard</title>
                <meta name="description" content="Review and manage mentee requests" />
            </Head>

            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-indigo-600">Mentor Portal</h1>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <a href="#" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Requests
                                </a>
                                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    My Mentees
                                </a>
                                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Schedule
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <Image
                                        className="h-8 w-8 rounded-full"
                                        src="/api/placeholder/32/32"
                                        alt="User profile"
                                        width={32}
                                        height={32}
                                    />
                                    <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="py-10">
                <header>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-2xl font-bold leading-tight text-gray-900">Mentee Requests</h1>
                    </div>
                </header>
                <main>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="px-4 py-8 sm:px-0">
                            {menteeRequests.length === 0 ? (
                                <div className="bg-white overflow-hidden shadow rounded-lg p-6 text-center">
                                    <p className="text-gray-500">No pending mentee requests</p>
                                </div>
                            ) : (
                                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                    <ul className="divide-y divide-gray-200">
                                        {menteeRequests && menteeRequests.map((request) => (
                                            <li key={request.mentee_data._id}>
                                                <div className="px-4 py-5 sm:px-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-12 w-12">
                                                                <Image
                                                                    className="h-12 w-12 rounded-full"
                                                                    src={request.mentee_data.picture}
                                                                    alt={request.mentee_data.name}
                                                                    width={48}
                                                                    height={48}
                                                                />
                                                            </div>
                                                            <div className="ml-4">
                                                                <h2 className="text-lg font-medium text-gray-900">{request.mentee_data.name}</h2>
                                                                <div className="flex items-center">
                                                                    <p className="text-sm text-gray-500">{request.mentee_data.bio}</p>
                                                                    <span className="mx-1 text-gray-500">•</span>
                                                                    <p className="text-sm text-gray-500">{request.mentee_data.email}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {
                                                                <div className="flex space-x-3">
                                                                    <button
                                                                        onClick={() => handleAccept(request.id)}
                                                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                    >
                                                                        Accept
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleReject(request.id)}
                                                                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                    >
                                                                        Decline
                                                                    </button>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <p className="mt-2 text-sm text-gray-700">{request.message}</p>
                                                        <div className="mt-2">
                                                            {request.mentee_data.skills.map((skill) => (
                                                                <span
                                                                    key={skill}
                                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}