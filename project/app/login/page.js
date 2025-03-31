"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { FaGoogle, FaFacebook, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import "../component_css/login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (email && password) {
                const res = await axios.post("/api/login", { email, password });
                if ([200, 201, 202].includes(res.status)) {
                    if (rememberMe) {
                        localStorage.setItem("email", email);
                    }
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

    const handleSocialLogin = (platform) => {
        // Implement social login logic here
        console.log(`Logging in with ${platform}`);
    };

    return (
        <div className="login-page">
            <div className="login-left">
                <h1 className="welcome-text">Welcome Back !</h1>
                <div className="skip-lag">Skip the lag ?</div>
            </div>
            
            <motion.div 
                className="login-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="login-title">Login</h2>
                <p className="login-subtitle">Glad you're back!</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div className="form-group password-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="password-toggle"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            Remember me
                        </label>
                        <a href="/forgot-password" className="forgot-password">
                            Forgot password?
                        </a>
                    </div>

                    <button type="submit" className="login-button">
                        Login
                    </button>

                    <div className="social-login">
                        <div className="divider">Or</div>
                        <div className="social-buttons">
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('google')}
                                className="social-button google"
                            >
                                <FaGoogle />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('facebook')}
                                className="social-button facebook"
                            >
                                <FaFacebook />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('github')}
                                className="social-button github"
                            >
                                <FaGithub />
                            </button>
                        </div>
                    </div>
                </form>

                <div className="login-footer">
                    <p className="signup-prompt">
                        Don't have an account? <a href="/register">Signup</a>
                    </p>
                    <div className="footer-links">
                        <a href="/terms">Terms & Conditions</a>
                        <a href="/support">Support</a>
                        <a href="/customer-care">Customer Care</a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;