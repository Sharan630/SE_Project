"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaBars, FaUserTie, FaUsers, FaCalendarCheck, FaCog } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

// Placeholder components (replace with actual implementations)
function MentorManagement() { return <div>Mentor Management</div>; }
function MenteeManagement() { return <div>Mentee Management</div>; }
function BookingManagement() { return <div>Booking Management</div>; }
function Settings() { return <div>Settings</div>; }

// Main Admin Panel Component
export default function AdminPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: <MdDashboard size={20} /> },
    { id: "mentors", name: "Mentors", icon: <FaUserTie size={20} /> },
    { id: "mentees", name: "Mentees", icon: <FaUsers size={20} /> },
    { id: "bookings", name: "Bookings", icon: <FaCalendarCheck size={20} /> },
    { id: "settings", name: "Settings", icon: <FaCog size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 250 : 80 }}
        className="bg-blue-600 h-screen p-5 text-white shadow-lg flex flex-col"
      >
        <div className="flex justify-between items-center">
          <h2 className={`text-xl font-bold transition-all ${!isSidebarOpen ? "hidden" : ""}`}>
            Admin
          </h2>
          <FaBars
            size={25}
            className="cursor-pointer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>

        <nav className="mt-10 space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center p-3 w-full rounded-lg transition ${
                activeTab === item.id ? "bg-blue-400" : "hover:bg-blue-500"
              }`}
            >
              {item.icon}
              <span className={`ml-4 transition-all ${!isSidebarOpen ? "hidden" : ""}`}>
                {item.name}
              </span>
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Top Navbar */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 shadow rounded-lg">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Notifications</button>
        </div>

        {/* Dashboard Content */}
        <div className="mt-6">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "mentors" && <MentorManagement />}
          {activeTab === "mentees" && <MenteeManagement />}
          {activeTab === "bookings" && <BookingManagement />}
          {activeTab === "settings" && <Settings />}
        </div>
      </main>
    </div>
  );
}

// Dashboard Overview Component
function Dashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[
        { title: "Mentors", count: 120, icon: <FaUserTie size={30} className="text-blue-500" /> },
        { title: "Mentees", count: 250, icon: <FaUsers size={30} className="text-green-500" /> },
        { title: "Bookings", count: 75, icon: <FaCalendarCheck size={30} className="text-yellow-500" /> },
      ].map((card) => (
        <motion.div
          key={card.title}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center"
          whileHover={{ scale: 1.05 }}
        >
          {card.icon}
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="text-2xl font-bold">{card.count}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
