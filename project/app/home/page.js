'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn } from "react-icons/fa6"
import { FaSearch, FaEdit, FaChartBar } from "react-icons/fa";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";


// const mentors = [
//   {
//     name: "Ayla S.",
//     role: "Top-rated marketing expe...",
//     price: "150/month",
//   },
//   {
//     name: "Francois J.",
//     role: "Full-Stack Software Deve...",
//     price: "99/month",

//   },
//   {
//     name: "Annie L.",
//     role: "UX Designer",
//     price: "50/month",

//   },
// ];

const Home = () => {

  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [email, setEmail] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [featuredMentor, setFeaturedMentor] = useState(null);






  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = sessionStorage.getItem("email");

      if (!storedEmail) {
        router.push("/login");
      } else {
        setEmail(storedEmail);
        setIsLoggedIn(true);
      }
    }
  }, [router]);



  useEffect(() => {
    if (email) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`/api/user/${email}`);
          sessionStorage.setItem("role", response.data.role);
          sessionStorage.setItem("name", response.data.name);
          console.log("User role:", response.data.role);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [email]);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    router.push("/");
  };

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get("/api/mentors");
        setMentors(response.data.mentors); // this is correct according to your backend route
      } catch (error) {
        console.error("Failed to fetch mentors:", error);
      }
    };

    fetchMentors();
  }, []);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get("/api/mentors");
        const mentors = response.data.mentors;
        if (mentors.length > 0) {
          setFeaturedMentor(mentors[0]); // show the first mentor
        }
      } catch (error) {
        console.error("Failed to fetch mentors:", error);
      }
    };

    fetchMentors();
  }, []);


  return (
    <div className="font-inter text-gray-900 bg-white">


      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md py-4 px-12 flex flex-row justify-between items-center z-50">
        <h1 className="text-3xl font-bold text-gray-900">GuidanceHub</h1>
        <div className="flex space-x-8">

          {!isLoggedIn ? (
            <>
              <button className="text-gray-800 font-medium hover:text-blue-600">Log in</button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">Sign Up</button>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-gray-800 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-gray-900 transition"
              >
                Dashboard
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <ul className="text-gray-800">
                    {/* <li><a href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</a></li> */}
                    <li><a href="/edit" className="block px-4 py-2 hover:bg-gray-100">Edit Profile</a></li>
                    <li><a href="/register" className="block px-4 py-2 hover:bg-gray-100">Registration</a></li>
                    <li><a href="/chat" className="block px-4 py-2 hover:bg-gray-100">Chat</a></li>
                    <li><a href="/search" className="block px-4 py-2 hover:bg-gray-100">Search</a></li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
      <header
        className="relative bg-cover bg-bottom text-white text-center pt-40 pb-28 px-6"
        style={{
          backgroundImage: "url('/uploads/mentormentee.avif')",
          backgroundPositionY: '20%'
        }}
      >
        <div className="absolute inset-0 bg-black/30 z-0" /> {/* Optional dark overlay for contrast */}

        <div className="relative z-10">

          <motion.h1
            className="text-5xl md:text-6xl font-extrabold leading-tight max-w-4xl mx-auto"
            initial={{ opacity: 0, y: -50, color: "#ffffff" }}
            animate={{
              opacity: 20,
              y: 0,
              color: ["#ffffff", "#38bdf8", "#facc15", "#ffffff"], // white → blue → yellow → white
            }}
            transition={{
              duration: 6,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            Find a mentor to supercharge your career
          </motion.h1>

          <motion.p
            className="text-xl mt-4 max-w-2xl mx-auto opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Get 1-on-1 mentorship from industry professionals and accelerate your learning.
          </motion.p>

          <div className="mt-8 flex justify-center">
            <input
              type="text"
              placeholder="Search mentors"
              className="w-3/5 md:w-2/5 p-4 rounded-l-lg border border-blue-300 text-gray-800 focus:outline-none bg-white shadow-sm"
              onFocus={() => router.push("/search")}
            />
            <button
              onClick={() => router.push("/search")}
              className="bg-blue-500 text-white px-6 py-4 rounded-r-lg font-semibold hover:bg-blue-600 transition"
            >
              Search
            </button>
          </div>
        </div>
      </header>


      <section className="bg-gray-100 py-16 px-6 rounded-3xl">
        <div className="container mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-12">

          {/* Mentor Card - Left Side */}
          {/* <div className="relative w-full max-w-sm lg:max-w-md lg:flex-shrink-0">
            <div className="absolute top-4 left-4 w-full h-full bg-white rounded-xl shadow-lg transform rotate-1"></div>
            <div className="relative bg-white p-6 rounded-xl shadow-2xl">
              <div className="flex items-center space-x-4">
                <img
                  src="https://via.placeholder.com/80"
                  alt="Mentor"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                />
                <div>
                  <h3 className="text-lg font-semibold">Akash Aloti</h3>
                  <p className="text-gray-500 text-sm">Staff Software Engineer</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm font-semibold">Mentorship <span className="text-green-600">&#8377;240/month</span></p>
              </div>
              
            </div>
          </div> */}

          {featuredMentor && (
            <div className="relative w-full max-w-sm lg:max-w-md lg:flex-shrink-0">
              <div className="absolute top-4 left-4 w-full h-full bg-white rounded-xl shadow-lg transform rotate-1"></div>
              <div className="relative bg-white p-6 rounded-xl shadow-2xl">
                <div className="flex items-center space-x-4">
                  <img
                    src={featuredMentor.picture || "https://via.placeholder.com/80"} // optional image field fallback
                    alt={featuredMentor.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{featuredMentor.name}</h3>
                    <p className="text-gray-500 text-sm">{featuredMentor.role}</p>
                    <p className="text-gray-500 text-sm">{featuredMentor.bio}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {featuredMentor.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <p className="text-sm font-semibold">
                    Mentorship <span className="text-green-600">&#8377;{featuredMentor.fees}/month</span>
                  </p>
                </div>
              </div>
            </div>
          )}


          {/* Right Side Content */}
          <div className="flex-1 max-w-2xl">
            <h2 className="text-4xl font-extrabold text-gray-900">
              At your fingertips: <br /> a dedicated career coach
            </h2>
            <p className="text-gray-600 text-lg mt-4">
              Looking to kickstart your dream career? Build a successful startup?
              Eager to master high-demand skills? Gain expert advice and guidance from an online mentor
              who matches your ambition. With Guidance Hub, nothing can hold you back.
            </p>

            {/* Features List in Two Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-gray-700">
              {[
                "Flexible program structures",
                "Free trial",
                "Personal chats",
                "1-on-1 calls",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-green-600 text-lg">✔</span>
                  <p className="text-base">{feature}</p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button onClick={() => router.push("/search")} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-transform transform hover:scale-105">
              Find a mentor →
            </button>
          </div>

        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto text-center px-4 sm:px-6 lg:px-12">

          {/* Section Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142245] mb-10">
            Explore available mentors
          </h2>

          {/* Mentor Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Tech Mentors", icon: "🖥️" },
              { title: "Career Mentors", icon: "💼" },
              { title: "Product & Startup Mentors", icon: "📊" },
              { title: "Design Mentors", icon: "🎨" },
            ].map((mentor, index) => (
              <div
                key={index}
                className="bg-gray-100 shadow-md rounded-xl p-6 flex flex-col items-center transition-all hover:shadow-lg"
              >
                {/* Icon - Centered Above the Title */}
                <div className="bg-[#142245] p-3 rounded-md mb-4">
                  <span className="text-white text-2xl">{mentor.icon}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 text-center">
                  {mentor.title}
                </h3>
              </div>
            ))}
          </div>

        </div>
      </section>

      <section className="bg-[#142245] py-16 px-4 sm:px-8 lg:px-16 text-white">


        {/* Testimonials Section */}
        <div className="container mx-auto mt-20 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Side - Convincing Message */}
            <div className="bg-[#142245] text-white p-6 rounded-lg">
              <h3 className="text-2xl sm:text-3xl font-semibold">
                Still not convinced? Don’t just take our word for it
              </h3>
              <p className="mt-2 text-gray-300 text-sm sm:text-base">
                We've already delivered 1-on-1 mentorship to thousands of students, professionals, and executives.
              </p>
              <button onClick={() => router.push("/search")} className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Find a mentor
              </button>
            </div>

            {/* Right Side - Testimonial Cards */}
            {/* <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  name: "Arjun",
                  role: "Leadership Mentee",
                  quote: "Amazing mentor! She is supportive and knowledgeable with extensive experience.",
                },
                {
                  name: "Apurav",
                  role: "Programming Mentee",
                  quote: "Brandon has been supporting me with a software engineering job hunt.",
                },
                {
                  name: "Ramcharan",
                  role: "Web Development Mentee",
                  quote: "Sandrine helped me improve as an engineer. A huge step beyond my expectations.",
                },
                {
                  name: "Aksith",
                  role: "Java Mentee",
                  quote: "Amit is the best mentor I have ever met. He helps to solve almost any problem.",
                },
                {
                  name: "Sharan",
                  role: "Business Mentee",
                  quote: "Drag me was the missing piece that offered me down-to-earth guidance in business.",
                },
                {
                  name: "Kailash",
                  role: "Design Mentee",
                  quote: "Anna really helped a lot. Her mentoring was very structured and insightful.",
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white text-black p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <p className="mt-2 text-gray-700 text-sm sm:text-base">"{testimonial.quote}"</p>
                </div>
              ))}
            </div> */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {mentors.slice(0, 4).map((mentor, index) => (
                <div
                  key={index}
                  className="bg-white text-black p-6 rounded-lg shadow-md transition-all hover:shadow-lg"
                >
                  <h4 className="font-semibold">{mentor.name}</h4>
                  <p className="text-sm text-gray-500">{mentor.role}</p>
                  <p className="mt-2 text-gray-700 text-sm sm:text-base">
                    "{mentor.bio || 'An amazing mentor with great insights and guidance!'}"
                  </p>
                </div>
              ))}
            </div>


          </div>
        </div>
      </section>


      {/* Featured Mentors Section */}
      {/* <section className="container mx-auto my-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Mentors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {["Rahul Saurav", "Angelia", "David Lee"].map((mentor, index) => (
            <motion.div
              key={index}
              className="p-6 border rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 bg-white"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <img src={`/mentor${index + 1}.jpg`} alt={mentor} className="w-24 h-24 mx-auto rounded-full mb-4" />
              <h3 className="text-2xl font-semibold">{mentor}</h3>
              <p className="text-gray-600 text-lg">{index === 0 ? "Software Engineer at Google" : index === 1 ? "Product Manager at Amazon" : "Data Scientist at Facebook"}</p>
              <button className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-md text-lg font-medium hover:bg-blue-700 transition">View Profile</button>
            </motion.div>
          ))}
        </div>
      </section> */}

      {/* 🔥 Mentor Pricing Section */}
      <section className="bg-gradient-to-b from-[#e0f0f8] to-[#a6d5d8] py-16 px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142245] leading-tight">
          An arsenal of industry veterans and <br className="hidden sm:block" />
          mentoring packages at a flexible price.
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto mt-4 text-sm sm:text-base">
          Pick from a curated collection of mentors and services. Try them out with no
          obligation. Move to a low-cost, monthly mentoring subscription. No hidden fees.
        </p>

        {/* Mentor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {mentors.map((mentor, index) => (
            <Link href={`/profile/${mentor._id}`} key={index}>
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-5 sm:p-6 text-left border border-gray-200 transition-transform transform hover:scale-105 duration-200"
              >
                {/* Mentor Name & Role */}
                <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                <p className="text-gray-500 text-sm">{mentor.role}</p>

                {/* Mentorship Price */}
                <div className="bg-gray-100 text-green-600 text-sm font-semibold py-2 px-4 rounded-md mt-4 inline-block">
                  Mentorship &#8377;
                  {mentor.fees}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Features Section */}
        {/* <div className="bg-white shadow-md rounded-lg mt-10 p-6 md:p-8 flex flex-wrap justify-center gap-6 md:gap-12"> */}
        {/* Feature 1 */}
        {/* <div className="flex items-center space-x-4">
            <FaSearch className="text-blue-500 text-2xl" />
            <div>
              <h4 className="font-semibold text-gray-900">Free Trial</h4>
              <p className="text-gray-600 text-sm">Get a free trial with every mentor</p>
            </div>
          </div> */}
        <div className="bg-white shadow-md rounded-lg mt-10 p-6 md:p-8 flex flex-wrap justify-center gap-6 md:gap-12">
          {/* Feature 1 - Clickable */}
          <div
            onClick={() => router.push("/search")}
            className="flex items-center space-x-4 cursor-pointer hover:bg-gray-100 p-3 rounded-md transition"
          >
            <FaSearch className="text-blue-500 text-2xl" />
            <div>
              <h4 className="font-semibold text-gray-900">Free Trial</h4>
              <p className="text-gray-600 text-sm">Get a free trial with every mentor</p>
            </div>
          </div>
        </div>

        {/* Feature 2
          <div className="flex items-center space-x-4">
            <FaEdit className="text-green-500 text-2xl" />
            <div>
              <h4 className="font-semibold text-gray-900">No Strings</h4>
              <p className="text-gray-600 text-sm">Cancel anytime</p>
            </div>
          </div> */}

        {/* Feature 3 */}
        {/* <div className="flex items-center space-x-4">
            <FaChartBar className="text-yellow-500 text-2xl" />
            <div>
              <h4 className="font-semibold text-gray-900">Fully Vetted</h4>
              <p className="text-gray-600 text-sm">We demand the highest quality service</p>
            </div>
          </div> */}
        {/* </div> */}



        {/* <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {typeof window !== "undefined" && sessionStorage.getItem("role") === "mentor" ? (
            <>
              <button
                onClick={() => router.push("/search")}
                className="bg-[#142245] text-white py-3 px-6 rounded-md text-lg font-medium hover:bg-[#0f1a33] transition duration-200"
              >
                Find my mentee
              </button>
              <a href="/login" className="text-[#142245] font-medium hover:underline text-lg">
                Become a Mentee
              </a>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/search")}
                className="bg-[#142245] text-white py-3 px-6 rounded-md text-lg font-medium hover:bg-[#0f1a33] transition duration-200"
              >
                Find my mentor
              </button>
              <a href="/login" className="text-[#142245] font-medium hover:underline text-lg">
                Become a Mentor
              </a>
            </>
          )}
        </div> */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {typeof window !== "undefined" && sessionStorage.getItem("role") === "mentor" ? (
            <>
              <button
                onClick={() => router.push("/search")}
                className="bg-[#142245] text-white py-3 px-6 rounded-md text-lg font-medium hover:bg-[#0f1a33] transition duration-200"
              >
                Find my mentee
              </button>
              <button
                onClick={() => router.push("/login")}
                className="text-[#142245] font-medium hover:underline text-lg bg-transparent border-none p-0"
              >
                Become a Mentee
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/search")}
                className="bg-[#142245] text-white py-3 px-6 rounded-md text-lg font-medium hover:bg-[#0f1a33] transition duration-200"
              >
                Find my mentor
              </button>
              <button
                onClick={() => router.push("/login")}
                className="text-[#142245] font-medium hover:underline text-lg bg-transparent border-none p-0"
              >
                Become a Mentor
              </button>
            </>
          )}
        </div>

      </section>


      {/* Footer */}
      <footer className="bg-gray-100 text-gray-700 py-12 ">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mx-auto gap-8"> */}
          <div className="flex justify-between gap-8">

            {/* Left Section - Title, Tagline, Social Icons */}
            <div className="col-span-2">
              <h2 className="text-2xl font-semibold text-[#142245]">Guidance Hub</h2>
              <p className="mt-4 text-gray-600">
                Your go-to platform for connecting with top mentors and industry experts to advance your career.
              </p>
              {/* Social Icons */}
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-500 hover:text-gray-800 transition text-xl">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>

            {/* Right Section - Navigation Columns */}
            {[
              {
                title: "PLATFORM",
                links: ["Browse Mentors", "Book a Session", "Become a Mentor"],
              },

            ].map((section, index) => (
              <div key={index}>
                <h4 className="text-sm font-semibold text-gray-600 uppercase">{section.title}</h4>
                <ul className="mt-2 space-y-1">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-500 hover:text-gray-800 transition">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
                {section.extraTitle && (
                  <>
                    <h4 className="text-sm font-semibold text-gray-600 uppercase mt-6">{section.extraTitle}</h4>
                    <ul className="mt-2 space-y-1">
                      {section.extraLinks.map((link, i) => (
                        <li key={i}>
                          <a href="#" className="text-gray-500 hover:text-gray-800 transition">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}

          </div>

          {/* Copyright */}
          <div className="text-center text-gray-500 text-sm mt-10">
            &copy; 2025 Guidance Hub. All Rights Reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
