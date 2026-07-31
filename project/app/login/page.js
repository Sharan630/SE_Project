"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";

const Login = () => {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [role, setRole] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("email");
        if (storedEmail) router.push("/home");
    }, [router]);

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!email || !pass || (isSignUp && !role)) {
                alert("Please fill in all details.");
                return;
            }

            const payload = isSignUp ? { email, pass, role } : { email, pass };

            const res = await axios.post(isSignUp ? "/api/signup" : "/api/login", payload);

            if ([200, 201].includes(res.status)) {
                sessionStorage.setItem("email", email);
                sessionStorage.setItem("pass", pass);
                const userRole = res.data?.user?.role || role;
                if (userRole) sessionStorage.setItem("role", userRole);
                if (res.data?.user?.name) sessionStorage.setItem("name", res.data.user.name);

                alert(isSignUp ? "Signed up successfully" : "Logged in successfully");
                router.push("/home");
            } else {
                alert(res.data?.message || "Authentication failed.");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 p-4">
            <motion.div
                className="w-full max-w-4xl h-[520px] bg-white rounded-xl shadow-lg flex overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Left Panel */}
                <div className="w-1/2 bg-blue-700 text-white flex flex-col items-center justify-center p-10 space-y-4">
                    {isSignUp ? (
                        <>
                            <motion.h2
                                className="text-3xl font-bold"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                Ready to Dive In? 🚀
                            </motion.h2>
                            <motion.p
                                className="text-sm text-center"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                Join us and explore endless possibilities.
                            </motion.p>
                            <motion.div
                                className="bg-white bg-opacity-10 rounded-md p-4 text-sm text-black text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Adventure begins with the first step.
                            </motion.div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl font-bold">Welcome Back! 👋</h2>
                            <p className="text-sm text-center">
                                We're excited to see you again. Let's get started!
                            </p>
                        </>
                    )}
                    <button
                        onClick={toggleForm}
                        className="mt-4 bg-white text-blue-700 px-6 py-2 rounded-md hover:bg-gray-200 transition"
                    >
                        {isSignUp ? "Already have an account?" : "Create an account"}
                    </button>
                </div>

                {/* Right Panel */}
                <div className="w-1/2 p-10 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        {isSignUp ? "Sign Up" : "Login"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {isSignUp && (
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Select Role</option>
                                <option value="mentor">Mentor</option>
                                <option value="mentee">Mentee</option>
                            </select>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            {isSignUp ? "Sign Up" : "Login"}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;