"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";

// import "../component_css/login.css";
// import sessionStorage from "js-cookie";

const Login = () => {
    const [email, setItemEmail] = useState("");
    const [pass, setItempass] = useState("");
    const [fname, setItemfname] = useState(null);
    const [lname, setItemlname] = useState(null);
    const [phone, setItemphone] = useState(null);
    const [isSignUp, setItemIsSignUp] = useState(false);
    const router = useRouter();
    const [role, setrole] = useState('');

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("email");
        if (storedEmail) {
            router.push("/home");
            return;
        }
    }, [router]);

    const toggleForm = () => {
        setItemIsSignUp((prev) => !prev);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (email && pass) {
                let res;
                if (!isSignUp) {
                    res = await axios.post("/api/login", { email, pass });
                } else {
                    res = await axios.post("/api/signup", { email, pass, role });
                }
                // console.log(res);

                if ([200, 201, 202].includes(res.status)) {
                    sessionStorage.setItem("email", email);
                    sessionStorage.setItem("pass", pass);
                    if (phone) sessionStorage.setItem("phone", phone);
                    if (fname) sessionStorage.setItem("fname", fname);
                    if (lname) sessionStorage.setItem("lname", lname);
                    // console.log(sessionStorage.getItem("email"));
                    // const email = sessionStorage.getItem("email");
                    // console.log(email);
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
                    onChange={(e) => setItemEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                    type="password"
                    value={pass}
                    onChange={(e) => setItempass(e.target.value)}
                    name="pass"
                    placeholder="Enter your pass"
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {isSignUp && <input
                    type="text"
                    name="fname"
                    value={fname}
                    onChange={(e) => setItemfname(e.target.value)}
                    placeholder="Enter your Fname"
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />}
                {isSignUp && <input
                    type="text"
                    name="lname"
                    value={lname}
                    onChange={(e) => setItemlname(e.target.value)}
                    placeholder="Enter your Lname"
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />}
                {isSignUp && <input
                    type="role"
                    name="role"
                    value={role}
                    onChange={(e) => setrole(e.target.value)}
                    placeholder="Enter your role"
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />}
                {isSignUp && <input
                    type="number"
                    name="phone"
                    value={phone}
                    onChange={(e) => setItemphone(e.target.value)}
                    placeholder="Enter your Phone number"
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />}
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
                {!isSignUp ? <p>If you don’t have an account?</p> : <p>Already have an account?</p>}
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