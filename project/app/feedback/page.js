"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function FeedbackPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        rating: 4,
        comments: ""
    });
    const [showSurvey, setShowSurvey] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRatingChange = (num) => {
        setFormData({
            ...formData,
            rating: num
        });
    };

    const handleSurveyStart = () => {
        setShowSurvey(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Mock API Call
            setMessage("Thank you for your feedback!");
            setFormData({ name: "", email: "", rating: 4, comments: "" });
            setShowSurvey(false);
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6">
            <div className="relative w-full max-w-6xl flex justify-center">
                {/* Left Card */}
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full z-10 mr-16">
                    {!showSurvey ? (
                        <>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Can we ask you something?</h2>
                            <p className="text-center text-gray-600 mb-8">
                                Let us know what we're getting right and what we can improve.
                            </p>
                            <button 
                                onClick={handleSurveyStart}
                                className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors font-medium"
                            >
                                Take the survey
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please rate your experience</h2>
                            
                            {message && <p className="text-center text-indigo-600 mb-4">{message}</p>}
                            
                            <div>
                                <label className="block text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    required
                                />
                            </div>
                            
                            <div>
                                <div className="flex flex-col items-center">
                                    <div className="flex space-x-4 mb-2">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <button
                                                type="button"
                                                key={num}
                                                onClick={() => handleRatingChange(num)}
                                                className="focus:outline-none"
                                            >
                                                <Star 
                                                    className={`w-8 h-8 ${num <= formData.rating ? "text-orange-400 fill-orange-400" : "text-gray-200"}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-between w-full text-sm font-medium">
                                        <span>Hated it</span>
                                        <span>Loved it!</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 mb-1">Comments</label>
                                <textarea
                                    name="comments"
                                    value={formData.comments}
                                    onChange={handleChange}
                                    placeholder="Tell us more about your experience..."
                                    rows="4"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    required
                                />
                            </div>
                            
                            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors font-medium">
                                Submit Feedback
                            </button>
                        </form>
                    )}
                </div>

                {/* Center Character - Positioned more precisely */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg width="200" height="400" viewBox="0 0 200 400" className="mt-8">
                        {/* Base/Shadow Line */}
                        <line x1="30" y1="380" x2="170" y2="380" stroke="#333" strokeWidth="2" />
                        
                        {/* Hair */}
                        <path d="M75 30 C60 5, 110 5, 125 30 L125 70 C110 80, 90 80, 75 70 Z" fill="#2A2F4C" />
                        
                        {/* Face */}
                        <path d="M75 60 Q100 80 125 60 L125 80 Q100 100 75 80 Z" fill="#F5E2CD" />
                        
                        {/* Neck */}
                        <rect x="93" y="80" width="14" height="15" fill="#F5E2CD" />
                        
                        {/* Shirt */}
                        <path d="M70 95 L130 95 L140 160 L130 240 L70 240 L60 160 Z" fill="#E2E8F0" />
                        
                        {/* Arms */}
                        <path d="M70 100 L40 130 L50 150 L80 120 Z" fill="#E2E8F0" />
                        <path d="M130 100 L160 130 L150 150 L120 120 Z" fill="#E2E8F0" />
                        
                        {/* Folded arms detail */}
                        <path d="M70 150 L130 150 L130 170 L70 170 Z" fill="#D1D8E5" />
                        <path d="M60 135 L85 155 L80 170 L55 150 Z" fill="#E2E8F0" />
                        <path d="M140 135 L115 155 L120 170 L145 150 Z" fill="#E2E8F0" />
                        
                        {/* Pants */}
                        <path d="M70 240 L130 240 L135 375 L110 375 L100 320 L90 375 L65 375 Z" fill="#4A5568" />
                        
                        {/* Shoes */}
                        <ellipse cx="75" cy="380" rx="15" ry="5" fill="#FFFFFF" />
                        <ellipse cx="125" cy="380" rx="15" ry="5" fill="#FFFFFF" />
                        
                        {/* Ankle detail */}
                        <rect x="65" y="370" width="20" height="5" fill="#FFFFFF" rx="2" />
                        <rect x="115" y="370" width="20" height="5" fill="#FFFFFF" rx="2" />
                        
                        {/* Face details for better look */}
                        <circle cx="87" cy="65" r="2" fill="#333" /> {/* Left eye */}
                        <circle cx="113" cy="65" r="2" fill="#333" /> {/* Right eye */}
                        <path d="M95 75 Q100 80 105 75" stroke="#333" strokeWidth="1" fill="none" /> {/* Smile */}
                    </svg>
                </div>

                {/* Right Card - Star Badge & Rating - Positioned further away */}
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-xs w-full ml-64 mt-16 z-10 hidden lg:block">
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-indigo-100 rounded-full p-4 mb-4">
                            <Star className="text-indigo-600 w-8 h-8" />
                        </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Please rate your experience</h2>
                    
                    <div className="flex flex-col items-center">
                        <div className="flex space-x-4 mb-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <Star 
                                    key={num}
                                    className={`w-8 h-8 ${num <= 4 ? "text-orange-400 fill-orange-400" : "text-gray-200"}`}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between w-full text-sm font-medium mt-2">
                            <span>Hated it</span>
                            <span>Loved it!</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}