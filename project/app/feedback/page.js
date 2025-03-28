"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";

export default function FeedbackPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        rating: 5,
        comments: "",
    });
    const [rating, setRating] = useState(0);

    const handleRatingChange = (num) => {
        setRating(num);
    };

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.comments) {
            setMessage("Please fill in all fields.");
            return;
        }

        try {
            // Mock API Call - Replace with actual API
            const response = await axios.post("/api/feedback", {
                formData
            });

            console.log(response.data); 
            setMessage("Thank you for your feedback!");

            setFormData({ name: "", email: "", rating: 5, comments: "" });
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/feedbackbg.jpg')] bg-cover bg-cente p-6">
            <div className="w-full max-w-lg  bg-white bg-opacity-20 backdrop-blur-md shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Give Your Feedback</h2>

                {message && <p className="text-center text-green-600 mt-2">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>


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
                                    <span className={`text - 2xl ${num <= rating ? "text-yellow-500" : "text-gray-300"}`}>
                                        ★
                                    </span>

                                </label>

                            ))}
                            <span className="text-xl  font-bold mx-2">{rating} Star</span>
                        </div>
                    </div>


                    <div>
                        <label className="block text-gray-700">Comments</label>
                        <textarea
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Submit Feedback
                    </button>
                </form>
            </div >
        </div >
    );
}