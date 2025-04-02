"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaSearch, FaFilter, FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MentorManagement() {
    // Initialize with empty arrays instead of undefined
    const [mentors, setMentors] = useState([]);
    const [mentees, setMentees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("mentors");
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);

    // Fetch mentors and mentees data
    useEffect(() => {
        fetchMentorshipData();
    }, []);

    const fetchMentorshipData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/user/admin');
            // Add safety checks when setting state
            setMentors(response.data.mentor || []);
            setMentees(response.data.mentee || []);
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching mentorship data:", error);
            toast.error("Failed to load mentorship data");
            // Ensure we have empty arrays on error
            setMentors([]);
            setMentees([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle user deletion
    const handleDelete = async (userId) => {
        if (confirmDelete === userId) {
            setIsDeleting(true);
            try {
                const res = await axios.delete(`/api/user/admin/${userId}`);
                console.log(res);
                toast.success("User deleted successfully");
                fetchMentorshipData(); // Refresh data
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user");
            } finally {
                setIsDeleting(false);
                setConfirmDelete(null);
            }
        } else {
            setConfirmDelete(userId);
            // Auto-reset confirmation after 3 seconds
            setTimeout(() => setConfirmDelete(null), 3000);
        }
    };

    // Filter data based on search term - with safety checks
    const filteredData = activeTab === "mentors"
        ? mentors.filter(mentor =>
            ((mentor.name || '').toLowerCase() || (mentor.email || '').toLowerCase())
                .includes(searchTerm.toLowerCase()))
        : mentees.filter(mentee =>
            ((mentee.name || '').toLowerCase() || (mentee.email || '').toLowerCase())
                .includes(searchTerm.toLowerCase()));

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`px-4 py-2 font-medium ${activeTab === "mentors"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("mentors")}
                >
                    Mentors ({mentors.length})
                </button>
                <button
                    className={`px-4 py-2 font-medium ${activeTab === "mentees"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("mentees")}
                >
                    Mentees ({mentees.length})
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
                <button className="flex items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                    <FaFilter className="mr-2" /> Filter
                </button>
            </div>

            {/* Users Table */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-blue-500 text-4xl" />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredData.length > 0 ? (
                                filteredData.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                                                    {user.profileImage ? (
                                                        <img
                                                            src={user.picture}
                                                            alt={user.name || user.email}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-lg font-medium">{((user.name || user.email) || '').charAt(0).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium">
                                                        {user.name || "No name"}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {activeTab === "mentors" ? "Mentor" : "Mentee"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                                }`}>
                                                {user.fees ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex space-x-2">
                                                <button className="text-blue-500 hover:text-blue-700">
                                                    <FaEdit size={18} />
                                                </button>
                                                <button
                                                    className={`${confirmDelete === user._id ? "text-red-600" : "text-gray-500 hover:text-red-500"}`}
                                                    onClick={() => handleDelete(user._id)}
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting && confirmDelete === user._id ? (
                                                        <FaSpinner className="animate-spin" size={18} />
                                                    ) : (
                                                        <FaTrash size={18} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No {activeTab} found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default MentorManagement;