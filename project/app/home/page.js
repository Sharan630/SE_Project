'use client';

import React from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn } from "react-icons/fa6"
import { FaSearch, FaEdit, FaChartBar } from "react-icons/fa";

const mentors = [
  {
    name: "Ayla S.",
    role: "Top-rated marketing expe...",
    price: "$150/month",
    services: [
      { name: "Intro Session", price: "$39" },
      { name: "CV Review", price: "$69" },
      { name: "Launch Plan", price: "$129" },
    ],
  },
  {
    name: "Francois J.",
    role: "Full-Stack Software Deve...",
    price: "$99/month",
    services: [
      { name: "Intro Session", price: "$39" },
      { name: "CV Review", price: "$69" },
      { name: "Launch Plan", price: "$129" },
    ],
  },
  {
    name: "Annie L.",
    role: "UX Designer",
    price: "$50/month",
    services: [
      { name: "Intro Session", price: "$39" },
      { name: "Portfolio Review", price: "$69" },
      { name: "Expert Session", price: "$140" },
    ],
  },
];

const Home = () => {
  return (
    <div className="font-inter text-gray-900 bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md py-4 px-12 flex flex-row justify-between items-center z-50">
        <h1 className="text-3xl font-bold text-gray-900">MentorClone</h1>
        <div className="flex space-x-8">
          <button className="text-gray-800 font-medium hover:text-blue-600">Log in</button>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">Sign Up</button>
        </div>
      </nav>

      {/* Category Navigation */}
      <div className="bg-gray-100 py-4 mt-16 shadow-sm">
        <div className="container mx-auto flex justify-center space-x-8 text-gray-700 font-medium">
          {["Engineering", "Design", "Marketing", "Product", "Business"].map((category, index) => (
            <button key={index} className="hover:text-blue-600 transition">{category} Mentors</button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <header className="bg-blue-600 text-white text-center pt-40 pb-28 px-6">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold leading-tight max-w-4xl mx-auto"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
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
            placeholder="Search mentors by skill, company, or industry..."
            className="w-3/5 md:w-2/5 p-4 rounded-l-lg border border-blue-300 text-gray-800 focus:outline-none bg-white shadow-sm"
          />
          <button className="bg-yellow-500 text-white px-6 py-4 rounded-r-lg font-semibold hover:bg-yellow-600 transition">Search</button>
        </div>
      </header>

      <section className="bg-gray-100 py-16 px-6 rounded-3xl">
  <div className="container mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-12">
    
    {/* Mentor Card - Left Side */}
    <div className="relative w-full max-w-sm lg:max-w-md lg:flex-shrink-0">
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
          <p className="text-sm font-semibold">Mentorship <span className="text-green-600">$240/month</span></p>
        </div>
        <div className="mt-4 space-y-2">
          {["Intro Session", "CV Review", "Expert Session"].map((session, i) => (
            <button 
              key={i} 
              className="w-full py-3 text-gray-700 bg-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300"
            >
              {session}
            </button>
          ))}
        </div>
      </div>
    </div>

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
          "Thousands of mentors available",
          "Flexible program structures",
          "Free trial",
          "Personal chats",
          "1-on-1 calls",
          "97% satisfaction rate"
        ].map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-green-600 text-lg">✔</span>
            <p className="text-base">{feature}</p>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-transform transform hover:scale-105">
        Find a mentor →
      </button>
    </div>

  </div>
</section>

<section className="py-16 bg-white">
  <div className="container mx-auto text-center px-4 sm:px-6 lg:px-12">
    
    {/* Section Title */}
    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142245] mb-10">
      Explore 900+ available mentors
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
  <div className="container mx-auto text-center max-w-6xl">
    
    {/* Header */}
    <h2 className="text-2xl sm:text-3xl font-extrabold">
      Not sure if mentorship is right for you?
    </h2>
    <p className="mt-2 text-base sm:text-lg">
      A quick, easy call with an expert is just one click away with our attractive one-off sessions.
    </p>

    {/* Mentor Session Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      {[
        {
          title: "Introductory Call",
          desc: "If you're looking for a mentor and you're not sure about how this all works – this should be your first call.",
          duration: "Approx. 30 minutes",
          price: "$39",
        },
        {
          title: "Study Plan",
          desc: "Looking to learn a new skill? A mentor can help you set up a custom study plan to follow.",
          duration: "Approx. 45 minutes",
          price: "$39",
        },
        {
          title: "Interview Preparation",
          desc: "Some big interviews coming up? Get help from an experienced mentor in a mock interview session.",
          duration: "Approx. 60 minutes",
          price: "$99",
        },
      ].map((session, index) => (
        <div key={index} className="bg-white text-black p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold">{session.title}</h3>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">{session.desc}</p>
          <p className="mt-4 font-semibold text-green-600">{session.duration}</p>
          <p className="text-lg font-bold">{session.price}</p>
          <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Explore →
          </button>
        </div>
      ))}
    </div>

    {/* Show More Button */}
    <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700">
      Show me more
    </button>
  </div>

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
        <button className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Find a mentor
        </button>
      </div>

      {/* Right Side - Testimonial Cards */}
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
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
      </div>

    </div>
  </div>
</section>


      {/* Featured Mentors Section */}
      <section className="container mx-auto my-20 px-6">
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
      </section>

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
      <div
        key={index}
        className="bg-white shadow-lg rounded-lg p-5 sm:p-6 text-left border border-gray-200 transition-transform transform hover:scale-105 duration-200"
      >
        {/* Mentor Name & Role */}
        <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
        <p className="text-gray-500 text-sm">{mentor.role}</p>

        {/* Mentorship Price */}
        <div className="bg-gray-100 text-green-600 text-sm font-semibold py-2 px-4 rounded-md mt-4 inline-block">
          Mentorship {mentor.price}
        </div>

        {/* Services */}
        <div className="mt-4 space-y-2">
          {mentor.services.map((service, i) => (
            <div key={i} className="flex justify-between bg-gray-100 p-2 rounded-md text-gray-700">
              <span>{service.name}</span>
              <span className="font-semibold">{service.price}</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>

  {/* Features Section */}
  <div className="bg-white shadow-md rounded-lg mt-10 p-6 md:p-8 flex flex-wrap justify-center gap-6 md:gap-12">
    {/* Feature 1 */}
    <div className="flex items-center space-x-4">
      <FaSearch className="text-blue-500 text-2xl" />
      <div>
        <h4 className="font-semibold text-gray-900">Free Trial</h4>
        <p className="text-gray-600 text-sm">Get a free trial with every mentor</p>
      </div>
    </div>

    {/* Feature 2 */}
    <div className="flex items-center space-x-4">
      <FaEdit className="text-green-500 text-2xl" />
      <div>
        <h4 className="font-semibold text-gray-900">No Strings</h4>
        <p className="text-gray-600 text-sm">Cancel anytime</p>
      </div>
    </div>

    {/* Feature 3 */}
    <div className="flex items-center space-x-4">
      <FaChartBar className="text-yellow-500 text-2xl" />
      <div>
        <h4 className="font-semibold text-gray-900">Fully Vetted</h4>
        <p className="text-gray-600 text-sm">We demand the highest quality service</p>
      </div>
    </div>
  </div>

  {/* Buttons */}
  <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
    <button className="bg-[#142245] text-white py-3 px-6 rounded-md text-lg font-medium hover:bg-[#0f1a33] transition duration-200">
      Find my mentor
    </button>
    <a href="#" className="text-[#142245] font-medium hover:underline text-lg">
      Become a Mentor
    </a>
  </div>
</section>

     
      {/* Footer */}
      <footer className="bg-gray-100 text-gray-700 py-12">
  <div className="container mx-auto px-6 md:px-12 lg:px-20">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
      
      {/* Left Section - Title, Tagline, Social Icons */}
      <div className="col-span-2">
        <h2 className="text-2xl font-semibold text-[#142245]">Guidance Hub</h2>
        <p className="mt-4 text-gray-600">
        Your go-to platform for connecting with top mentors and industry experts to advance your career.
        </p>
        {/* Social Icons */}
        <div className="flex space-x-4 mt-4">
          <a href="#" className="text-gray-500 hover:text-gray-800 transition text-xl">
            <FaFacebookF />
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-800 transition text-xl">
            <FaInstagram />
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-800 transition text-xl">
            <FaXTwitter />
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-800 transition text-xl">
            <FaLinkedinIn />
          </a>
        </div>
      </div>

      {/* Right Section - Navigation Columns */}
      {[
        {
          title: "PLATFORM",
          links: ["Browse Mentors", "Book a Session", "Become a Mentor", "Mentorship for Teams", "Testimonials"],
        },
        {
          title: "RESOURCES",
          links: ["Newsletter", "Books", "Perks", "Templates", "Career Paths", "Blog"],
        },
        {
          title: "COMPANY",
          links: ["About", "Case Studies", "Partner Program", "Code of Conduct", "Privacy Policy", "DMCA"],
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
