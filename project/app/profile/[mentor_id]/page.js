"use client";
import React from 'react';
import Script from 'next/script';
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import axios from "axios";
import { Modal } from '@/app/components/ui/modal';
import {
    FaMapMarkerAlt,
    FaLinkedin,
    FaGithub,
    FaTwitter,
    FaStar,
    FaCalendarAlt,
    FaChalkboardTeacher,
    FaUserGraduate
} from "react-icons/fa";
import { FaExclamationTriangle } from "react-icons/fa";
import { MdEmail, MdVerified, MdOutlineSchedule } from "react-icons/md";
import { BiMessageSquareDetail } from "react-icons/bi";
import { useRouter } from "next/navigation";

const MentorProfile = () => {
    const params = useParams();
    const mentorId = params.mentor_id;
    const [mentorData, setMentorData] = useState({});
    const [skills, setSkills] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [AMOUNT, setamount] = useState();
    const [isProcessing, setIsProcessing] = useState(false);
    const [reviews, setreviews] = useState([]);
    const [menteeId, setmenteeid] = useState();

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                console.log('Razorpay script loaded');
                resolve(true);
            };
            script.onerror = () => {
                console.error('Razorpay script failed to load');
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    useEffect(() => {
        const fetchMentee = async () => {
            try {
                const email = sessionStorage.getItem("email"); // Assuming email is stored in session
                if (email) {
                    // sessionStorage.setItem('guest', '1');
                    const res = await axios.get(`/api/user/${email}`);
                    // console.log(res);
                    // console.log("Response structure:", JSON.stringify(res.data, null, 2));
                    // console.log(res.data._id);

                    setmenteeid(res.data._id); // Setting mentee ID
                }

            } catch (error) {
                console.error("Error fetching mentee ID:", error);
            }
        };

        fetchMentee();
    }, []);

    const ReportMentor = ({ mentorId, menteeId }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [selectedReason, setSelectedReason] = useState("");
        const [description, setDescription] = useState("");
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [reportSuccess, setReportSuccess] = useState(false);

        const reportReasons = [
            {
                value: "harassment",
                label: "Harassment",
                description: "The mentor used inappropriate or offensive language during a session."
            },
            {
                value: "scam",
                label: "Scam/Fraud",
                description: "The mentor asked for payment outside the platform or promoted suspicious links."
            },
            {
                value: "spam",
                label: "Spam",
                description: "The mentor kept sending irrelevant messages or unsolicited promotions."
            },
            {
                value: "inappropriate_content",
                label: "Inappropriate Content",
                description: "The mentor shared content that was not suitable for a professional environment."
            },
            {
                value: "unprofessional_behavior",
                label: "Unprofessional Behavior",
                description: "The mentor did not behave professionally or deviated from the session goals."
            },
            {
                value: "other",
                label: "Other",
                description: "Other reasons not listed above."
            }
        ];

        const handleSubmitReport = async () => {
            if (!selectedReason) {
                alert("Please select a reason for reporting");
                return;
            }

            setIsSubmitting(true);
            try {
                const response = await axios.post('/api/reports', {
                    mentorId,
                    menteeId,
                    reason: selectedReason,
                    description,
                    status: "submitted"
                });

                if (response.data.success) {
                    setReportSuccess(true);
                    setTimeout(() => {
                        setIsOpen(false);
                        setReportSuccess(false);
                    }, 2000);
                }
            } catch (error) {
                console.error("Error submitting report:", error);
                alert("Failed to submit report. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        };

        return (
            <div className="p-4">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    <FaExclamationTriangle className="mr-2" />
                    Report this Mentor
                </button>

                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        {reportSuccess ? (
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <svg
                                        className="h-6 w-6 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mt-3 text-lg font-medium text-gray-900">Report Submitted</h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Thank you for your report. We will review it shortly.
                                </p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                    Report Mentor
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Reason for reporting
                                        </label>
                                        <select
                                            value={selectedReason}
                                            onChange={(e) => setSelectedReason(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="">Select a reason</option>
                                            {reportReasons.map((reason) => (
                                                <option key={reason.value} value={reason.value}>
                                                    {reason.label}
                                                </option>
                                            ))}
                                        </select>
                                        {selectedReason && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                {reportReasons.find(r => r.value === selectedReason)?.description}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Additional details (optional)
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            placeholder="Please provide more details about the issue..."
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSubmitReport}
                                            disabled={isSubmitting || !selectedReason}
                                            className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? "Submitting..." : "Submit Report"}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Modal>
            </div>
        );
    };

    const handlePayment = async () => {
        const email = sessionStorage.getItem('email');
        if (!email) {
            router.push('/login');
            return;
        }

        const name = sessionStorage.getItem('name');
        if (!name) {
            router.push('/register');
            return;
        }

        var canPay = false;

        const check = async () => {
            // console.log(menteeId, mentorId)
            const res = await axios.post('/api/canpay', {
                mentorId, menteeId
            })

            console.log("canPay", res);

            canPay = res.data.canPay;
        }

        await check();

        if (canPay === true) {

            setIsProcessing(true);
            try {
                if (!window.Razorpay) {
                    const loaded = await loadRazorpayScript();
                    if (!loaded) {
                        throw new Error('Failed to load Razorpay script');
                    }
                }
                const response = await fetch('/api/create-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount: AMOUNT, currency: 'INR' }),
                });

                if (!response.ok) {
                    throw new Error('Failed to create order');
                }

                const data = await response.json();

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: AMOUNT,
                    currency: 'INR',
                    name: 'SE Project',
                    description: 'Payment Gateway',
                    order_id: data.orderId,
                    handler: (response) => handleSuccess(response, data.orderId),
                    prefill: {
                        name: 'John Doe',
                        email: 'john@example.com',
                        contact: '9999999999',
                    },
                    notes: {
                        address: 'Example Street',
                    },
                    theme: {
                        color: '#3880ff',
                    },
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.open();
            }
            catch (e) {
                console.error('Error in payment', e);
                alert('Payment failed, please try again.');
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleSuccess = async (response, orderId) => {
        setIsProcessing(false);
        console.log('Payment Successful', response);

        try {
            const captureResponse = await fetch('/api/capture-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_id: orderId,
                    payment_id: response.razorpay_payment_id,
                    mentorId,
                    menteeId
                }),
            });

            const data = await captureResponse.json();
            console.log(data);

            if (data.redirectUrl) {
                window.location.replace(data.redirectUrl);
            }
        } catch (error) {
            console.error('Error capturing payment', error);
        }
    };

    const connectionList = (connected) => {
        const uniqueMembers = new Set();
        // console.log("size ", connected.length);
        for (const pair of connected) {
            uniqueMembers.add(pair.user);
        }
        return uniqueMembers.size;
    };

    useEffect(() => {
        const fetchMentorData = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`/api/user/id/${mentorId}`);
                const mentor = res.data;

                setMentorData(mentor);
                setamount(mentor.fees);
                setSkills(mentor.skills || []);
                setAvailableTimes(mentor.availability || []);

                const reviews = mentor.ratings.reviews || [];
                // console.log(reviews);

                // Fetch mentee names for each review
                const enrichedReviews = await Promise.all(
                    reviews.map(async (review) => {
                        try {
                            const menteeRes = await axios.get(`/api/user/id/${review.userId}`);
                            // console.log(menteeRes);
                            return {
                                ...review,
                                name: menteeRes.data.name || "Unknown",
                            };
                        } catch (err) {
                            console.error(`Failed to fetch mentee with ID ${review.userId}`, err);
                            return {
                                ...review,
                                name: "Unknown",
                            };
                        }
                    })
                );

                // console.log(enrichedReviews);

                setreviews(enrichedReviews);
            } catch (error) {
                console.error("Error fetching mentor data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMentorData();
    }, [mentorId]);

    const handleBookSession = (timeSlot) => {
        router.push(`/requestmentor/${mentorData.phone}`)
        setSelectedTimeSlot(timeSlot);
    };

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-6 px-4 sm:px-8 md:px-16">
                <div className="max-w-5xl mx-auto">
                    <div className="h-64 w-full bg-gray-200 animate-pulse rounded-t-xl"></div>
                    <div className="bg-white rounded-b-xl p-6 shadow-lg">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-2/3">
                                <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-full mb-4"></div>
                                <div className="h-4 w-36 bg-gray-200 animate-pulse rounded-full mb-4"></div>
                                <div className="h-4 w-full bg-gray-200 animate-pulse rounded-full mb-2"></div>
                                <div className="h-4 w-full bg-gray-200 animate-pulse rounded-full mb-2"></div>
                                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded-full mb-6"></div>

                                <div className="h-6 w-36 bg-gray-200 animate-pulse rounded-full mb-4"></div>
                                <div className="flex flex-wrap gap-2">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="h-8 w-24 bg-gray-200 animate-pulse rounded-full"></div>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full lg:w-1/3">
                                <div className="h-10 w-full bg-gray-200 animate-pulse rounded-lg mb-4"></div>
                                <div className="h-60 w-full bg-gray-200 animate-pulse rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-6 px-4 sm:px-8 md:px-16">
            <div className="max-w-5xl mx-auto">
                {/* Cover Image */}
                <div className="h-64 w-full relative rounded-t-xl overflow-hidden shadow-lg">
                    <video
                        src="/uploads/cover-bg.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-b-xl shadow-lg">
                    <div className="container mx-auto">
                        {/* Profile Header */}
                        <div className="flex flex-col lg:flex-row p-6">
                            {/* Profile Info Section */}
                            <div className="w-full lg:w-2/3 pr-0 lg:pr-8">
                                <div className="flex items-start mb-6">
                                    <div className="relative mr-6">
                                        <img
                                            src={mentorData.picture || "/api/placeholder/120/120"}
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                        <span className="absolute bottom-0 right-0 bg-green-500 p-1 rounded-full border-2 border-white">
                                            <MdVerified className="text-white" size={14} />
                                        </span>
                                    </div>

                                    <div>
                                        <div className="flex items-center">
                                            <h1 className="text-2xl font-bold text-gray-800">{mentorData.name || "Mentor Name"}</h1>
                                            <div className="flex items-center ml-4">
                                                <FaStar className="text-yellow-400" />
                                                <span className="ml-1 text-gray-700 font-medium">{mentorData.ratings?.average || 0}</span>
                                            </div>
                                        </div>
                                        <p className="text-lg text-gray-600 font-medium">{mentorData.title || "Mentor Title"}</p>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-gray-600">
                                            {/* <span className="flex items-center text-sm">
                                                <FaMapMarkerAlt className="mr-1" />
                                                {mentorData.location || "Location"}
                                            </span> */}
                                            <span className="flex items-center text-sm">
                                                <FaChalkboardTeacher className="mr-1" />
                                                {mentorData.experience || "0"} years experience
                                            </span>
                                            <span className="flex items-center text-sm">
                                                <FaUserGraduate className="mr-1" />
                                                {connectionList(mentorData.connected) || "0"} mentees
                                            </span>
                                        </div>

                                        <div className="flex space-x-3 mt-4">
                                            <a href={mentorData.linkedin || "#"} className="text-blue-600 hover:text-blue-800 transition">
                                                <FaLinkedin size={20} />
                                            </a>
                                            <a href={`mailto:${mentorData.email}`} className="text-red-500 hover:text-red-700 transition">
                                                <MdEmail size={20} />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* About Section */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                                        <BiMessageSquareDetail className="mr-2" />
                                        About
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed">
                                        {mentorData.bio || "No bio available"}
                                    </p>
                                </div>

                                {/* Skills Section */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                                        <FaChalkboardTeacher className="mr-2" />
                                        Skills & Expertise
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.length > 0 ? (
                                            skills.map((skill, index) => (
                                                <motion.span
                                                    key={index}
                                                    whileHover={{ scale: 1.05 }}
                                                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                                                >
                                                    {skill}
                                                </motion.span>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No skills listed</p>
                                        )}
                                    </div>
                                </div>

                                {/* Availability Section */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                                        <MdOutlineSchedule className="mr-2" />
                                        Availability
                                    </h2>

                                    {availableTimes.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {availableTimes.map((slot, index) => (
                                                <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                    <div className="font-medium text-gray-800">{slot.day}</div>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        {slot.timeSlots.map((time, i) => (
                                                            <div key={i} className="mb-1 flex items-center">
                                                                <FaCalendarAlt className="mr-2 text-indigo-500" size={12} />
                                                                {time}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No availability information</p>
                                    )}
                                </div>
                            </div>

                            {/* Pricing & Booking Section */}
                            <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
                                <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden sticky top-6">
                                    <div className="bg-indigo-600 text-white p-4">
                                        <h3 className="text-xl font-bold">Book a Session</h3>
                                        <p className="text-indigo-100">Get personalized guidance</p>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <p className="text-gray-500 text-sm mb-1">Session Price</p>
                                                <div className="flex items-baseline">
                                                    <span className="text-3xl font-bold text-gray-900">₹{mentorData.fees}</span>
                                                    <span className="text-gray-500 ml-1">/month</span>
                                                </div>
                                            </div>
                                            {/* <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                4 spots left
                                            </div> */}
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            <h4 className="font-medium text-gray-800">What's included:</h4>
                                            <ul className="space-y-2">
                                                <li className="flex items-start">
                                                    <svg className="w-4 h-4 text-green-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-gray-600">One-on-one video consultation</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <svg className="w-4 h-4 text-green-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-gray-600">Personalized guidance & feedback</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <svg className="w-4 h-4 text-green-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-gray-600">Resource recommendations</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <svg className="w-4 h-4 text-green-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-gray-600">1 month of follow-up support</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-center shadow-sm transition duration-150"
                                            onClick={() => handleBookSession()}
                                        >
                                            Request Mentor
                                        </motion.button>

                                        {/* <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-center shadow-sm transition duration-150"
                                            onClick={() => Pay()}
                                        >
                                            Pay
                                        </motion.button> */}
                                        {/* <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" /> */}
                                        <div className="flex flex-col items-center justify-center py-3 bg-white-200">
                                            <button
                                                onClick={handlePayment}
                                                disabled={isProcessing}
                                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                                            >
                                                {isProcessing ? 'Processing...' : 'Pay Now'}
                                            </button>

                                        </div>

                                        <p className="text-xs text-gray-500 text-center mt-4">
                                            You won't be charged until after the session
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-200">
                        {(sessionStorage.getItem('name') !== "undefined" && sessionStorage.getItem('role') === 'mentee') &&
                            <ReportMentor mentorId={mentorId} menteeId={menteeId} />
                        }
                    </div>

                    {/* Similar Mentors Section */}
                    <div className="border-t border-gray-200 bg-gray-50 p-6 rounded-b-xl">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800">Ratings and Reviews</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {reviews.map((mentor) => (
                                <motion.div
                                    key={mentor._id}
                                    whileHover={{ y: -5 }}
                                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition"
                                >
                                    <div className="flex items-center mb-3">
                                        {/* <img src={mentor.picture} alt={mentor.name} className="w-12 h-12 rounded-full object-cover mr-3" /> */}
                                        <div>
                                            <h3 className="font-medium text-gray-800">{mentor.name}</h3>
                                            <div className="flex items-center text-xs text-yellow-500">
                                                <FaStar size={12} />
                                                <span className="ml-1 text-gray-600">{mentor.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <p className="text-sm text-gray-600 mb-2">{mentor.title}</p> */}
                                    <p className="text-xs text-gray-500">{mentor.comment}</p>
                                    {/* <button className="mt-3 text-sm w-full py-1.5 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg transition text-center">
                                        View Profile
                                    </button> */}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div >
    );
};

export default MentorProfile;