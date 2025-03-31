"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import "../component_css/login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter();
    const [role, setrole] = useState('');

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("email");
        if (storedEmail) {
            // router.push("/home");
            return;
        }
    }, [router]);

    const toggleForm = () => {
        setItemIsSignUp((prev) => !prev);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (email && password) {
                let res;
                if (!isSignUp) {
                    res = await axios.post("/api/login", { email, pass });
                } else {
                    res = await axios.post("/api/signup", { email, password });
                }
                // console.log(res);

                if ([200, 201, 202].includes(res.status)) {
                    localStorage.setItem("email", email);
                    localStorage.setItem("password", password);
                    alert(isSignUp ? "Signed up successfully" : "Logged in successfully");
                    router.push("/home");
                } else {
                    alert(res.data?.message || "Authentication failed. Try again.");
                }
            } else {
                alert("Please fill in all details.");
            }
        } catch (err) {
            console.error(err);
            alert("Server error. Please try again.");
        }
    };

    // Inline styles for when we can't use external CSS
    const styles = {
        container: {
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f9fafb",
            overflow: "hidden",
            position: "relative"
        },
        redBackground: {
            position: "absolute",
            top: 0,
            right: 0,
            width: "33.333%",
            height: "33.333%",
            backgroundColor: "#f87171",
            borderBottomLeftRadius: "100%",
            zIndex: 0
        },
        yellowBackground: {
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "33.333%",
            height: "33.333%",
            backgroundColor: "#fcd34d",
            borderTopRightRadius: "100%",
            zIndex: 0
        },
        formContainer: {
            display: "flex",
            width: "100%",
            maxWidth: "56rem",
            position: "relative",
            zIndex: 10
        },
        greenPanel: {
            backgroundColor: "#10b981",
            color: "white",
            padding: "2.5rem",
            borderTopLeftRadius: "0.5rem",
            borderBottomLeftRadius: "0.5rem",
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
        },
        whitePanel: {
            backgroundColor: "white",
            padding: "2.5rem",
            borderTopRightRadius: "0.5rem",
            borderBottomRightRadius: "0.5rem",
            width: "50%",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        },
        logo: {
            marginBottom: "2rem"
        },
        heading: {
            fontSize: "1.875rem",
            fontWeight: "bold",
            marginBottom: "1rem"
        },
        paragraph: {
            textAlign: "center",
            marginBottom: "2rem"
        },
        button: {
            border: "2px solid white",
            color: "white",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
            borderRadius: "9999px",
            transition: "all 0.2s"
        },
        formContent: {
            width: "100%",
            maxWidth: "28rem",
            marginLeft: "auto",
            marginRight: "auto"
        },
        greenHeading: {
            fontSize: "1.875rem",
            fontWeight: "bold",
            color: "#10b981",
            marginBottom: "1.5rem",
            textAlign: "center"
        },
        socialContainer: {
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "1.5rem"
        },
        socialButton: {
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "9999px",
            backgroundColor: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        socialText: {
            color: "#6b7280"
        },
        orText: {
            color: "#6b7280",
            textAlign: "center",
            marginBottom: "1.5rem"
        },
        formGroup: {
            marginBottom: "1rem",
            position: "relative"
        },
        input: {
            width: "100%",
            padding: "0.75rem",
            paddingLeft: "2.5rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.375rem"
        },
        inputIcon: {
            position: "absolute",
            left: "0.75rem",
            top: "0.75rem",
            color: "#9ca3af"
        },
        forgotPassword: {
            textAlign: "right",
            fontSize: "0.875rem",
            color: "#4b5563",
            marginBottom: "1rem"
        },
        submitButton: {
            width: "100%",
            backgroundColor: "#10b981",
            color: "white",
            padding: "0.75rem",
            borderRadius: "9999px",
            transition: "background-color 0.2s"
        }
    };

    return (
        <div className="login relative flex items-center justify-center min-h-screen overflow-hidden">
            <motion.div
                animate={{ x: isSignUp ? "100%" : "0%" }}
                transition={{ type: "spring", stiffness: 100 }}
                className="details relative bg-white p-10 shadow-lg rounded-md w-96 z-10"
            >
                <h2 className="text2">{isSignUp ? "Sign Up" : "Login"}</h2>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    placeholder="Enter your password"
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                    type="submit"
                    onClick={handleSubmit}
                    value={isSignUp ? "Sign Up" : "Login"}
                    className="bg-green-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </motion.div>

            <motion.div
                animate={{ x: isSignUp ? "-100%" : "0%" }}
                transition={{ type: "spring", stiffness: 100 }}
                className="gradient relative z-0 text-white p-10 rounded-md shadow-lg w-96 bg-blue-500 flex flex-col items-center justify-center"
            >
                <h1>Welcome Friend</h1>
                {isSignUp ? <p>If you don’t have an account, sign up</p> : <p>Already have an account? Login</p>}
                <input
                    type="submit"
                    value={isSignUp ? "Login" : "Signup"}
                    onClick={toggleForm}
                    className="bg-white text-blue-500 p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                />
            </motion.div>
        </div>
    );
};

export default Login;