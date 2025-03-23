"use client";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const MentorProfile = () => {
    const mentorData = {
        name: "Dr. Sarah Johnson",
        title: "Senior Software Architect & Tech Mentor",
        location: "San Francisco, CA",
        email: "sarah.johnson@email.com",
    };

    const similarMentors = [
        { name: "James Anderson", title: "Cloud Solutions Architect", location: "Seattle, WA", image: "https://randomuser.me/api/portraits/men/1.jpg" },
        { name: "Emily Carter", title: "AI & Machine Learning Engineer", location: "New York, NY", image: "https://randomuser.me/api/portraits/women/2.jpg" },
        { name: "Michael Brown", title: "Full Stack Developer & Mentor", location: "Los Angeles, CA", image: "https://randomuser.me/api/portraits/men/3.jpg" },
        { name: "Sophia Martinez", title: "Product Manager & UX Strategist", location: "Chicago, IL", image: "https://randomuser.me/api/portraits/women/4.jpg" },
    ];

    const skills = [
        "Software Engineering", "Web Development", "Software Architecture", "System Design",
        "JavaScript", "Next.js", "Full Stack Development", "Front-end Development",
        "Back-end Development", "ReactJS", "Java", "Career Growth", "NodeJS",
        "Distributed Systems", "Technical Leadership",
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-100 py-6 px-4 sm:px-16">
            {/* Background Image */}
            <div className="h-60 w-full">
                <img
                    src="/back.jpg"
                    alt="Background"
                    className="w-full h-full object-cover rounded-t-lg"
                />
            </div>

            {/* Profile Card */}
            <div className="relative bg-white shadow-lg rounded-b-lg px-6 pb-6 pt-16 sm:pt-20 md:pt-24">
                {/* Profile Picture - Overlapping */}
                <div className="absolute -top-14 sm:-top-16 left-60 transform -translate-x-1/2">
                    <img
                        src="/virat.jpg"
                        alt="Profile"
                        className="w-24 h-24 sm:w-40 sm:h-40  rounded-full border-4 border-slate-600 shadow-lg"
                    />
                </div>

                {/* Profile and Plan Container */}
                {/* <div className="flex flex-col sm:flex-row items-center justify-center mt-4 sm:mt-6"> */}
                <div className="flex flex-col sm:flex-row items-center justify-around mt-4 sm:mt-6">
                    {/* User Details */}
                    <div className="text-center sm:mb-60 sm:text-left sm:mr-8">
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">{mentorData.name}</h2>
                        <p className="text-gray-600 text-sm sm:text-base">{mentorData.title}</p>
                        {/* Location & Social Links */}
                        <div className="flex flex-wrap justify-center sm:justify-start items-center space-x-3 text-gray-500 text-xs sm:text-sm mt-2">
                            <span className="flex items-center"><FaMapMarkerAlt className="mr-1" /> {mentorData.location}</span>
                            <a href="#" className="hover:text-gray-800"><FaLinkedin size={18} /></a>
                            <a href="#" className="hover:text-gray-800"><FaGithub size={18} /></a>
                            <a href="#" className="hover:text-gray-800"><FaTwitter size={18} /></a>
                            <a href={`mailto:${mentorData.email}`} className="hover:text-gray-800"><MdEmail size={18} /></a>
                        </div>
                    </div>
                    <div className=" w-full max-w-sm  p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 mt-4 sm:mt-0">
                        <h5 className="mb-4 text-xl font-medium text-gray-500">Standard plan</h5>
                        <div className="flex items-baseline text-gray-900">
                            <span className="text-3xl font-semibold">$</span>
                            <span className="text-5xl font-extrabold tracking-tight">49</span>
                            <span className="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
                        </div>
                        <ul role="list" className="space-y-5 my-7">
                            <li className="flex items-center">
                                <svg className="shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                </svg>
                                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">2 team members</span>
                            </li>
                            <li className="flex">
                                <svg className="shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                </svg>
                                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">Integration help</span>
                            </li>
                            <li className="flex line-through decoration-gray-500">
                                <svg className="shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                </svg>
                                <span className="text-base font-normal leading-tight text-gray-500 ms-3">24×7 phone & email support</span>
                            </li>
                        </ul>
                        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">Choose plan</button>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="bg-gray-100 rounded-lg p-4 sm:p-6 my-6 shadow-lg">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Skills</h2>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        {skills.map((skill, index) => (
                            <motion.span
                                key={index}
                                whileHover={{ scale: 1.1 }}
                                className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-800 rounded-full text-xs sm:text-sm font-medium shadow-sm transition"
                            >
                                {skill}
                            </motion.span>
                        ))}
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-gray-100 rounded-lg p-4 sm:p-6 shadow-lg">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">About</h2>
                    <p className="text-xs sm:text-sm text-gray-800">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque laudantium impedit debitis, perspiciatis voluptatibus repellat aspernatur, doloribus itaque praesentium odio soluta labore vel consequatur dignissimos autem molestiae ut perferendis magni eos nostrum quibusdam iure, ullam asperiores. Dolore cumque excepturi laudantium repudiandae consectetur quaerat, consequuntur ab?
                    </p>
                </div>

                {/* Similar Mentors Section */}
                <div className="bg-white rounded-lg p-4 sm:p-6 mt-8 shadow-lg overflow-hidden">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Similar Mentors</h2>
                    <div className="overflow-x-auto scrollbar-hide">
                        <motion.div
                            className="flex space-x-4 sm:space-x-6"
                            animate={{ x: ["0%", "-100%"] }}
                            transition={{ ease: "linear", duration: 25, repeat: Infinity }}
                        >
                            {[...similarMentors, ...similarMentors].map((mentor, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    className="flex flex-col items-center bg-gray-100 p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition w-44 sm:w-56"
                                >
                                    <img src={mentor.image} alt={mentor.name} className="w-16 h-16 sm:w-24 sm:h-24 rounded-full mb-2 object-cover" />
                                    <h3 className="text-sm sm:text-lg font-medium text-gray-800">{mentor.name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600">{mentor.title}</p>
                                    <div className="flex items-center text-gray-500 text-xs sm:text-sm mt-1">
                                        <FaMapMarkerAlt className="mr-1" size={12} />
                                        <span>{mentor.location}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-6 sm:mt-8">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-indigo-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        Book a Mentorship Session
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default MentorProfile;