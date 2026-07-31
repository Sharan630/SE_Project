"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function FeedbackPage() {
    const [formData, setFormData] = useState({
        rating: 5,
        comment: "",
    });
    const [rating, setRating] = useState(5);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const [mentor, setmentor] = useState([]);

    useEffect(() => {
        const email = sessionStorage.getItem('email');
        if (!email) {
            router.push('/login');
            return;
        }

        const mentorId = sessionStorage.getItem('feedback');
        if (!mentorId) {
            router.push('/home');
            return;
        }
        const fetch = async () => {
            const res = await axios.get(`/api/user/id/${mentorId}`);
            console.log(res);
            setmentor(res.data);
        }

        fetch();

        const menteeId = sessionStorage.getItem('mentee');
        if (!menteeId) {
            router.push('/home');
            return;
        }
    }, [])

    const handleRatingChange = (num) => {
        setRating(num);
        setFormData({
            ...formData,
            rating: num
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.comment) {
            setMessage("Please provide your comments.");
            setIsSubmitting(false);
            return;
        }

        try {
            const mentorId = sessionStorage.getItem('feedback');
            if (!mentorId) {
                router.push('/home');
                return;
            }
            const menteeId = sessionStorage.getItem('mentee');
            const response = await axios.post("/api/feedback", {
                mentor: mentorId,
                mentee: menteeId,
                rating: formData.rating,
                comment: formData.comment
            });

            // console.log(response);

            setMessage("Thank you for your feedback!");
            setFormData({ rating: 5, comment: "" });
            sessionStorage.removeItem('feedback');
            sessionStorage.removeItem('mentee');
            setRating(5);

            router.push('/home');
            return;
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/feedbackbg.jpg')] bg-cover bg-center p-6">
            <div className="w-full max-w-lg bg-white bg-opacity-20 backdrop-blur-md shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Rate Your Mentor</h2>

                {message && <p className="text-center text-green-600 mt-2">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-gray-700">Rating</label>
                        <div className="flex flex-row items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <label key={num} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={num}
                                        checked={rating === num}
                                        onChange={() => handleRatingChange(num)}
                                        className="hidden"
                                    />
                                    <span className={`text-2xl ${num <= rating ? "text-yellow-500" : "text-gray-300"}`}>
                                        ★
                                    </span>
                                </label>
                            ))}
                            <span className="text-xl font-bold mx-2">{rating} Star</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700">Mentor Name</label>
                        <p>
                            {mentor.name}
                        </p>
                        <label className="block text-gray-700">Mentor Email</label>
                        <p>
                            {mentor.email}
                        </p>
                    </div>

                    <div>
                        <label className="block text-gray-700">Comments</label>
                        <textarea
                            name="comment"
                            value={formData.comment}
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            </div>
        </div>
    );
}