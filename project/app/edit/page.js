"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function EditProfile() {
    const [user, setUser] = useState({
        name: '',
        Password: '',
        Email: '',
        Bio: '',
        Skills: '',
        Experience: '',
        Availability: '',
        Phone: '',
        fullName: '',
        nickName: '',
        gender: '',
        country: '',
        language: '',
        timeZone: ''
    });
    
    const router = useRouter();
    
    useEffect(() => {
        // Keeping all the comments as requested
        const email = localStorage.getItem("email");
        const name = localStorage.getItem("name");
        const password = localStorage.getItem("password");
        // const role = localStorage.getItem("role");
        const phone = localStorage.getItem("phone");
        const bio = localStorage.getItem("bio");
        const skills = localStorage.getItem("skills");
        const experience = localStorage.getItem("experience");
        const availability = localStorage.getItem("availability");
        const rating = localStorage.getItem("rating");
        const connected = localStorage.getItem("connected");
        const imagePath = localStorage.getItem("imagePath");

       // if (!email) {
         //   router.push('/login');
        //    return;
      //  }

        // if (!name) {
        //   router.push('/form');
        //   return;
        // }

        // const fetch = async () => {
        //   try {
        //     const res = await axios.get(/api/users/email/${email});
        //     setUser(res.data);
        //     console.log(res.data);
        //   } catch (error) {
        //     console.error(error);
        //   }
        // }

        // fetch();

    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        console.log(name, value);
        // console.log("ok")
        
        setUser({ ...user, [name]: value });

        // if (name === "pin") {
        //   if (/^\d{0,6}$/.test(value)) {
        //     setUser({ ...user, [name]: value });
        //   }
        // } else if (name === "phone") {

        //   if (/^\d{0,10}$/.test(value)) {
        //     setUser({ ...user, [name]: value });
        //   }
        // } else {
        //   setUser({ ...user, [name]: value });
        // }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (user && user.Phone.length !== 10) {
        //   alert("Phone number must be exactly 10 digits.");
        //   return;
        // }

        // console.log("Updated User Data:", user);
        // try {
        //     const res = await axios.post("/api/update", {
        //         name: user.Name,

        //         email: user.Email,
        //         phone: user.Phone,

        //     });
        //     alert("Profile updated successfully!");
        // } catch (err) {
        //     // console.error(err);
        //     alert("Failed to update profile. Please try again later.");
        // }
    };

    const handleAddEmail = () => {
        // Implementation for adding another email
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-100">
            {/* Header area */}
            <div className="p-6 bg-white rounded-lg shadow mx-auto max-w-6xl mt-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-gray-700 text-xl font-medium">Welcome, Amanda</h1>
                        <p className="text-gray-500 text-sm">Tue, 07 June 2022</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input 
                                type="text" 
                                placeholder="Search" 
                                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                            />
                        </div>
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-blue-500 overflow-hidden">
                            {/* Profile image */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="p-8 bg-white rounded-lg shadow mx-auto max-w-6xl mt-6 mb-8">
                <div className="flex items-center mb-8">
                    <div className="h-16 w-16 rounded-full bg-gray-300 overflow-hidden mr-4">
                        {/* Profile image */}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Alexa Rawles</h2>
                        <p className="text-gray-500">alexarawles@gmail.com</p>
                    </div>
                    <button 
                        onClick={handleSubmit}
                        className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Edit
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={user.fullName}
                                onChange={handleChange}
                                placeholder="Your First Name"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Gender</label>
                            <div className="relative">
                                <select
                                    name="gender"
                                    value={user.gender}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent appearance-none"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Language</label>
                            <div className="relative">
                                <select
                                    name="language"
                                    value={user.language}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent appearance-none"
                                >
                                <option value="">Select Language</option>
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                                <option value="Chinese">Chinese</option>
                                <option value="Japanese">Japanese</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Arabic">Arabic</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Nick Name</label>
                            <input
                                type="text"
                                name="nickName"
                                value={user.nickName}
                                onChange={handleChange}
                                placeholder="Your nick name"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Country</label>
                            <div className="relative">
                                <select
                                    name="country"
                                    value={user.country}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent appearance-none"
                                >
                                    <option value="">Select country</option>
                                    <option value="usa">United States</option>
                                    <option value="canada">Canada</option>
                                    <option value="uk">United Kingdom</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Time Zone</label>
                            <div className="relative">
                                <select
                                    name="timeZone"
                                    value={user.timeZone}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent appearance-none"
                                >
                                    <option value="">Select time zone</option>
                                    <option value="est">Eastern Standard Time (EST)</option>
                                    <option value="cst">Central Standard Time (CST)</option>
                                    <option value="pst">Pacific Standard Time (PST)</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email section */}
                <div className="mt-10">
                    <h3 className="text-lg font-medium mb-4">My email Address</h3>
                    <div className="bg-gray-50 p-4 rounded-md flex items-center mb-4">
                        <div className="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-gray-700">alexarawles@gmail.com</p>
                            <p className="text-gray-500 text-sm">1 month ago</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleAddEmail}
                        className="text-blue-500 hover:text-blue-700 flex items-center font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Email Address
                    </button>
                </div>
            </div>
        </div>
    );
}