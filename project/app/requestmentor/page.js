"use client";

import { useState } from "react";

export default function RequestMentorship() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mentor: "",
        message: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.mentor || !formData.message) {
            setMessage("Please fill in all fields.");
            return;
        }

        try {
            // Mock API Call - Replace with actual API
            // const response = await fetch("/api/request-mentorship", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(formData),
            // });

            // const result = await response.json();
            setMessage("Your mentorship request has been sent!");

            setFormData({ name: "", email: "", mentor: "", message: "" });
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/requestbg.jpeg')] bg-cover bg-center p-6">
            
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Request Mentorship</h2>

                {message && <p className="text-center text-green-600 mt-2">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-gray-700">Your Name</label>
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
                        <label className="block text-gray-700">Select Mentor</label>
                        <select
                            name="mentor"
                            value={formData.mentor}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">-- Select a Mentor --</option>
                            <option value="mentor1">John Doe</option>
                            <option value="mentor2">Jane Smith</option>
                            <option value="mentor3">Michael Brown</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700">Your Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
}
