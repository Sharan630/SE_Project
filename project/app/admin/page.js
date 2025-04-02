"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBars, FaUserTie, FaUsers, FaCalendarCheck, FaCog } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import axios from "axios";
import MentorManagement from "./MentorManagement"; // Import the new component

// Placeholder components (replace with actual implementations)
function MenteeManagement() { 
  // We'll reuse the MentorManagement component but with the "mentees" tab active by default
  return <MentorManagement defaultTab="mentees" />; 
}
function BookingManagement() { return <div>Booking Management</div>; }
function Settings() { return <div>Settings</div>; }

// Main Admin Panel Component
export default function AdminPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    mentors: 0,
    mentees: 0,
    bookings: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/user/admin');
        setStats({
          mentors: response.data.mentor.length || 0,
          mentees: response.data.mentee.length || 0,
          bookings: 75 // Placeholder, replace with actual API data
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

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
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Top Navbar */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 shadow rounded-lg">
          <h1 className="text-xl font-semibold">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Notifications
              </button>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-700 font-medium">A</span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="mt-6">
          {activeTab === "dashboard" && <Dashboard stats={stats} isLoading={isLoading} />}
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
function Dashboard({ stats, isLoading }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[
        { title: "Mentors", count: stats.mentors, icon: <FaUserTie size={30} className="text-blue-500" /> },
        { title: "Mentees", count: stats.mentees, icon: <FaUsers size={30} className="text-green-500" /> },
        { title: "Bookings", count: stats.bookings, icon: <FaCalendarCheck size={30} className="text-yellow-500" /> },
      ].map((card) => (
        <motion.div
          key={card.title}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center"
          whileHover={{ scale: 1.05 }}
        >
          {card.icon}
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{card.title}</h3>
            {isLoading ? (
              <div className="h-6 w-12 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-2xl font-bold">{card.count}</p>
            )}
          </div>
        </motion.div>
      ))}
      
      {/* Recent Activity */}
      <div className="col-span-1 sm:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">No recent activity to display</div>
          )}
        </div>
      </div>
    </div>
  );
}