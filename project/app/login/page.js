"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (storedEmail) {
            router.push("/home");
            return;
        }
    }, [router]);

    const toggleForm = () => {
        setIsSignUp((prev) => !prev);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if ((!isSignUp && email && password) || (isSignUp && email && password && name)) {
                let res;
                if (!isSignUp) {
                    res = await axios.post("/api/login", { email, password });
                } else {
                    res = await axios.post("/api/signup", { email, password, name });
                }

                if ([200, 201, 202].includes(res.status)) {
                    localStorage.setItem("email", email);
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
        <div style={styles.container}>
            {/* Colored backgrounds similar to the image */}
            <div style={styles.redBackground}></div>
            <div style={styles.yellowBackground}></div>
            
            <div style={styles.formContainer}>
                {/* Left Panel - Sign In */}
                <motion.div
                    animate={{ 
                        x: isSignUp ? "-100%" : "0%",
                        opacity: isSignUp ? 0 : 1
                    }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 100 }}
                    style={styles.greenPanel}
                >
                    <div style={styles.logo}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="4" fill="white" fillOpacity="0.2"/>
                            <path d="M12 6L18 12L12 18L6 12L12 6Z" fill="white"/>
                        </svg>
                        <span style={{ marginLeft: "0.5rem", fontSize: "1.125rem", fontWeight: "bold" }}>Guidance Hub</span>
                    </div>
                    <h2 style={styles.heading}>Welcome Back!</h2>
                    <p style={styles.paragraph}>To keep connected with us please login with your personal info</p>
                    <button
                        onClick={toggleForm}
                        style={styles.button}
                    >
                        SIGN IN
                    </button>
                </motion.div>

                {/* Right Panel - Sign Up */}
                <motion.div
                    animate={{ 
                        x: isSignUp ? "0%" : "100%",
                        opacity: isSignUp ? 1 : 0
                    }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 100 }}
                    style={{
                        ...styles.whitePanel,
                        display: isSignUp ? "flex" : "none"
                    }}
                >
                    <div style={styles.formContent}>
                        <h2 style={styles.greenHeading}>Create Account</h2>
                        
                        <div style={styles.socialContainer}>
                            <a href="#" style={styles.socialButton}>
                                <span style={styles.socialText}>f</span>
                            </a>
                            <a href="#" style={styles.socialButton}>
                                <span style={styles.socialText}>G+</span>
                            </a>
                            <a href="#" style={styles.socialButton}>
                                <span style={styles.socialText}>in</span>
                            </a>
                        </div>
                        
                        <p style={styles.orText}>or use your email for registration:</p>
                        
                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Name"
                                    style={styles.input}
                                    required={isSignUp}
                                />
                                <span style={styles.inputIcon}>👤</span>
                            </div>
                            
                            <div style={styles.formGroup}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    style={styles.input}
                                    required
                                />
                                <span style={styles.inputIcon}>✉️</span>
                            </div>
                            
                            <div style={styles.formGroup}>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    style={styles.input}
                                    required
                                />
                                <span style={styles.inputIcon}>🔒</span>
                            </div>
                            
                            <button
                                type="submit"
                                style={styles.submitButton}
                            >
                                SIGN UP
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* Left Panel - Sign Up Mode */}
                <motion.div
                    animate={{ 
                        x: isSignUp ? "0%" : "-100%",
                        opacity: isSignUp ? 1 : 0
                    }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 100 }}
                    style={{
                        ...styles.greenPanel,
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        display: isSignUp ? "flex" : "none"
                    }}
                >
                    <div style={styles.logo}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="4" fill="white" fillOpacity="0.2"/>
                            <path d="M12 6L18 12L12 18L6 12L12 6Z" fill="white"/>
                        </svg>
                        <span style={{ marginLeft: "0.5rem", fontSize: "1.125rem", fontWeight: "bold" }}>Guidance Hub</span>
                    </div>
                    <h2 style={styles.heading}>Welcome Back!</h2>
                    <p style={styles.paragraph}>To keep connected with us please login with your personal info</p>
                    <button
                        onClick={toggleForm}
                        style={styles.button}
                    >
                        SIGN IN
                    </button>
                </motion.div>

                {/* Right Panel - Sign In Mode */}
                <motion.div
                    animate={{ 
                        x: isSignUp ? "100%" : "0%",
                        opacity: isSignUp ? 0 : 1
                    }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 100 }}
                    style={{
                        ...styles.whitePanel,
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        display: isSignUp ? "none" : "flex"
                    }}
                >
                    <div style={styles.formContent}>
                        <h2 style={styles.greenHeading}>Sign in to Guidance Hub</h2>
                        
                        <div style={styles.socialContainer}>
                            <a href="#" style={styles.socialButton}>
                                <span style={styles.socialText}>f</span>
                            </a>
                            <a href="#" style={styles.socialButton}>
                                <span style={styles.socialText}>G+</span>
                            </a>
                            <a href="#" style={styles.socialButton}>
                                <span style={styles.socialText}>in</span>
                            </a>
                        </div>
                        
                        <p style={styles.orText}>or use your email account:</p>
                        
                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    style={styles.input}
                                    required
                                />
                                <span style={styles.inputIcon}>✉️</span>
                            </div>
                            
                            <div style={styles.formGroup}>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    style={styles.input}
                                    required
                                />
                                <span style={styles.inputIcon}>🔒</span>
                            </div>
                            
                            <div style={styles.forgotPassword}>
                                <a href="#">Forgot your password?</a>
                            </div>
                            
                            <button
                                type="submit"
                                style={styles.submitButton}
                            >
                                SIGN IN
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;