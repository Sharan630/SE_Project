import { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "../components/ui/modal";

function BookingManagement() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMentor, setSelectedMentor] = useState("");
    const [mentors, setMentors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const response = await axios.get('/api/user/mentors');
                setMentors(response.data || []);
            } catch (error) {
                console.error("Error fetching mentors:", error);
                setMentors([]);
            }
        };

        fetchMentors();
    }, []);

    const fetchSubscriptions = async (mentorId = "") => {
        setLoading(true);
        try {
            const url = `/api/paymentdetails`;
            const response = await axios.get(url);
            setSubscriptions(response.data || []);
            // console.log(response.data);
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
            setSubscriptions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateEndDate = (subscription) => {
        if (subscription.endDate) {
            return new Date(subscription.endDate);
        }

        const startDate = new Date(subscription.startDate);
        const endDate = new Date(startDate);

        switch (subscription.plan) {
            case 'free':
                endDate.setDate(endDate.getDate() + 1);
                break;
            case 'monthly':
                endDate.setMonth(endDate.getMonth() + 1);
                break;
        }

        return endDate;
    };

    const formatEndDate = (subscription) => {
        const endDate = calculateEndDate(subscription);
        subscription.endDate = endDate;
        return formatDate(endDate);
    };


    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Active Subscriptions</h2>
                <div className="flex space-x-4">
                    {/* <select
                        value={selectedMentor}
                        onChange={(e) => {
                            setSelectedMentor(e.target.value);
                            fetchSubscriptions(e.target.value);
                        }}
                        className="p-2 border rounded-lg bg-white dark:bg-gray-700"
                    >
                        <option value="">All Mentors</option>
                        {mentors.map((mentor) => (
                            <option key={mentor._id} value={mentor._id}>
                                {mentor.name || mentor.email}
                            </option>
                        ))}
                    </select> */}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : subscriptions.length === 0 ? (
                <p className="text-gray-500 italic">No active subscriptions found</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mentee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mentor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Plan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">End Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {subscriptions.map((subscription) => (
                                <tr key={subscription._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {subscription.user?.name || subscription.user?.email || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {subscription.mentor?.name || subscription.mentor?.email || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                                        {subscription.plan}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatDate(subscription.startDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatEndDate(subscription)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${new Date(subscription.endDate) > new Date()
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {new Date(subscription.endDate) > new Date() ? 'Active' : 'Expired'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => {
                                                setSelectedSubscription(subscription);
                                                setIsModalOpen(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                        Subscription Details
                    </h3>
                    {selectedSubscription && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Mentee
                                </label>
                                <p className="text-gray-900 dark:text-white">
                                    {selectedSubscription.user?.email || selectedSubscription.user?.name || 'Unknown'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Mentor
                                </label>
                                <p className="text-gray-900 dark:text-white">
                                    {selectedSubscription.mentor?.email || selectedSubscription.mentor?.name || 'Unknown'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Plan
                                </label>
                                <p className="text-gray-900 dark:text-white capitalize">
                                    {selectedSubscription.plan}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Price
                                </label>
                                <p className="text-gray-900 dark:text-white">
                                    {(selectedSubscription.price).toLocaleString('en-IN', {
                                        style: 'currency',
                                        currency: 'INR'
                                    })}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Start Date
                                </label>
                                <p className="text-gray-900 dark:text-white">
                                    {formatDate(selectedSubscription.startDate)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    End Date
                                </label>
                                <p className="text-gray-900 dark:text-white">
                                    {formatDate(selectedSubscription.endDate)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Status
                                </label>
                                <p className="text-gray-900 dark:text-white">
                                    {new Date(selectedSubscription.endDate) > new Date() ? 'Active' : 'Expired'}
                                </p>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}

export default BookingManagement;