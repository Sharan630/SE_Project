'use client'

import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { Search, Mic, Camera, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Home() {
    const [query, setQuery] = useState('');
    const [mentors, setMentors] = useState([]);
    const [filteredMentors, setFilteredMentors] = useState([]);
    const inputRef = useRef(null);
    const router = useRouter();

    const handleClear = () => {
        setQuery('');
        setFilteredMentors(mentors);
        inputRef.current.focus();
    };

    useEffect(() => {
        const email = sessionStorage.getItem('email');
        if (!email) {
            // Redirect to login page
            router.push('/login');
            return;
        }

        const fetchMentors = async () => {
            try {
                const res = await axios.get('/api/user');
                console.log(res.data);
                setMentors(res.data);
                setFilteredMentors(res.data);
            } catch (error) {
                console.error("Error fetching mentors:", error);
            }
        }

        fetchMentors();
    }, [router]);

    // Filter mentors as user types
    useEffect(() => {
        if (!query.trim()) {
            setFilteredMentors(mentors);
            return;
        }

        const lowerCaseQuery = query.toLowerCase();
        const filtered = mentors.filter(mentor => {
            // Check if query matches mentor name
            if (mentor.name && mentor.name.toLowerCase().includes(lowerCaseQuery)) {
                return true;
            }

            // Check if query matches any of mentor's skills
            if (mentor.skills && Array.isArray(mentor.skills)) {
                return mentor.skills.some(skill =>
                    skill.toLowerCase().includes(lowerCaseQuery)
                );
            }

            return false;
        });

        setFilteredMentors(filtered);
    }, [query, mentors]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <Head>
                <title>Search Mentors | GuidanceHub</title>
                <meta name="description" content="Find the perfect mentor for your needs" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="w-full max-w-2xl mx-auto flex flex-col items-center">
                <form className="w-full">
                    <div className="relative w-full mt-20">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>

                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search mentors by name or skill..."
                            className="block w-full pl-10 pr-20 py-4 rounded-xl bg-white border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                        />

                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                            {query && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="p-1.5 rounded-full hover:bg-gray-100"
                                >
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                {/* Mentor Results */}
                <div className="w-full mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        {query ? `Results for "${query}"` : "All Mentors"}
                        <span className="text-gray-500 text-base ml-2">
                            ({filteredMentors.length})
                        </span>
                    </h2>

                    {filteredMentors.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-500">No mentors found matching your search</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredMentors.map((mentor) => (
                                <div key={mentor.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                            <span className="text-blue-500 font-bold">{mentor.name ? mentor.name.charAt(0) : '?'}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg">{mentor.name || 'Unnamed Mentor'}</h3>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {mentor.skills && mentor.skills.map((skill, index) => (
                                                    <span key={index} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                            onClick={() => router.push(`/profile/${mentor._id}`)}
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <footer className="mt-auto py-6 text-sm text-gray-500">
                © 2025 GuidanceHub • Privacy Policy • Terms of Service
            </footer>
        </div>
    );
}