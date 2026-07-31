"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBars, FaUserTie, FaUsers, FaCalendarCheck, FaFileAlt, FaCog } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import axios from "axios";
import MentorManagement from "./MentorManagement";
import BookingManagement from "./bookingmanagement";
// import { Modal } from "@/components/ui";
import { Modal } from "../components/ui/modal";
import { useRouter } from "next/navigation";

// Placeholder components
function MenteeManagement() {
  return <MentorManagement defaultTab="mentees" />;
}

// function BookingManagement() {
//   return <BookingManagement />
// }

function ReportManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentee, setSelectedMentee] = useState("");
  const [mentees, setMentees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);


  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const response = await axios.get('/api/user/mentees').catch(() => ({ data: [] }));
        setMentees(response.data || []);
      } catch (error) {
        console.error("Error fetching mentees:", error);
        setMentees([]);
      }
    };

    fetchMentees();
  }, []);



  const fetchReports = async (menteeId = "") => {
    setLoading(true);
    try {
      const url = menteeId
        ? `/api/reports?menteeId=${menteeId}`
        : '/api/reports';
      const response = await axios.get(url);
      setReports(response.data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // const handleResolveReport = async (reportId) => {
  //   try {
  //     await axios.put(`/api/reports/${reportId}`, {
  //       status: "resolved"
  //     });
  //     fetchReports(selectedMentee);
  //   } catch (error) {
  //     console.error("Error resolving report:", error);
  //   }
  // };
  const handleResolveReport = async (reportId) => {
    try {
      const response = await axios.put(`/api/reports/${reportId}`, {
        status: "resolved"
      });

      if (response.data.success) {
        fetchReports(selectedMentee);
      } else {
        console.error("Failed to resolve report:", response.data.error);
        // Optionally show a toast notification to the user
      }
    } catch (error) {
      console.error("Error resolving report:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.status, error.response.data);
      }
      // Optionally show a toast notification to the user
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Reports Management</h2>
        <div className="flex space-x-4">
          {/* <select
            value={selectedMentee}
            onChange={(e) => {
              setSelectedMentee(e.target.value);
              fetchReports(e.target.value);
            }}
            className="p-2 border rounded-lg bg-white dark:bg-gray-700"
          >
            <option value="">All Mentees</option>
            {mentees.map((mentee) => (
              <option key={mentee._id} value={mentee._id}>
                {mentee.name || mentee.email}
              </option>
            ))}
          </select> */}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : reports.length === 0 ? (
        <p className="text-gray-500 italic">No reports found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mentee</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {reports.map((report) => (
                <tr key={report._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.mentee?.name || report.mentee?.email || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    {report.reason.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${report.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                      report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => {
                        setSelectedReport(report);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View
                    </button>
                    {report.status !== 'resolved' && (
                      <button
                        onClick={() => handleResolveReport(report._id)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
            Report Details
          </h3>
          {selectedReport && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mentee
                </label>
                <p className="text-gray-900 dark:text-white">
                  {selectedReport.mentee?.email || selectedReport.mentee?.name || 'Unknown'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mentor
                </label>
                <p className="text-gray-900 dark:text-white">
                  {selectedReport.mentor?.email || selectedReport.mentor?.name || 'Unknown'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason
                </label>
                <p className="text-gray-900 dark:text-white capitalize">
                  {selectedReport.reason.replace('_', ' ')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <p className="text-gray-900 dark:text-white">
                  {selectedReport.description || "No additional details provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date Submitted
                </label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(selectedReport.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default function AdminPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    mentors: 0,
    mentees: 0,
    bookings: 0,
    reports: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setuser] = useState({});

  const router = useRouter();

  useEffect(() => {

    const email = sessionStorage.getItem('email');

    if (!email) {
      router.push('/login');
      return;
    }

    const name = sessionStorage.getItem('name');
    if (!name) {
      router.push('/register');
      return;
    }

    const role = sessionStorage.getItem('role');
    if (!role || role !== 'admin') {
      router.push('/home');
      return;
    }

    const fetchUser = async () => {
      const user = await axios.get(`/api/user/${email}`)

      setuser(user.data);

      if (user.data.role !== 'admin') {
        router.push('/home');
        return;
      }
    }

    fetchUser();

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [usersResponse, bookingsResponse, reportsResponse] = await Promise.all([
          axios.get('/api/user/admin'),
          axios.get('/api/bookings/count').catch(() => ({ data: { count: 0 } })), // Fallback if endpoint doesn't exist
          axios.get('/api/reports/count').catch(() => ({ data: { count: 0 } })) // Fallback if endpoint doesn't exist
        ]);

        setStats({
          mentors: usersResponse.data.mentor?.length || 0,
          mentees: usersResponse.data.mentee?.length || 0,
          bookings: bookingsResponse.data?.count || 0,
          reports: reportsResponse.data?.count || 0
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        // Set default values if there's an error
        setStats({
          mentors: 0,
          mentees: 0,
          bookings: 0,
          reports: 0
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: <MdDashboard size={20} /> },
    { id: "mentors", name: "Users", icon: <FaUserTie size={20} /> },
    { id: "bookings", name: "Subscriptions", icon: <FaCalendarCheck size={20} /> },
    { id: "reports", name: "Reports", icon: <FaFileAlt size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 250 : 80 }}
        className="bg-blue-600 dark:bg-blue-800 h-screen p-5 text-white shadow-lg flex flex-col transition-all duration-300"
      >
        <div className="flex justify-between items-center">
          <h2 className={`text-xl font-bold ${!isSidebarOpen ? "hidden" : ""}`}>
            Admin
          </h2>
          <FaBars
            size={25}
            className="cursor-pointer hover:text-blue-200 transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>

        <nav className="mt-10 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center p-3 w-full rounded-lg transition-all ${activeTab === item.id
                ? "bg-blue-500 dark:bg-blue-700"
                : "hover:bg-blue-500 dark:hover:bg-blue-700"
                }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className={`ml-4 ${!isSidebarOpen ? "hidden" : ""}`}>
                {item.name}
              </span>
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Top Navbar */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 shadow rounded-lg mb-6">
          <h1 className="text-xl font-semibold">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <div className="flex items-center space-x-4">
            {/* <div className="relative">
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                Notifications
              </button>
            </div> */}
            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-gray-700 dark:text-gray-200 font-medium">A</span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="mt-6">
          {activeTab === "dashboard" && <Dashboard stats={stats} isLoading={isLoading} />}
          {activeTab === "mentors" && <MentorManagement />}
          {activeTab === "mentees" && <MenteeManagement />}
          {activeTab === "bookings" && <BookingManagement />}
          {activeTab === "reports" && <ReportManagement />}
        </div>
      </main>
    </div>
  );
}

function Dashboard({ stats, isLoading }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { title: "Mentors", count: stats.mentors, icon: <FaUserTie size={30} className="text-blue-500" />, color: "blue" },
        { title: "Mentees", count: stats.mentees, icon: <FaUsers size={30} className="text-green-500" />, color: "green" },
        { title: "Bookings", count: stats.bookings, icon: <FaCalendarCheck size={30} className="text-yellow-500" />, color: "yellow" },
        { title: "Reports", count: stats.reports, icon: <FaFileAlt size={30} className="text-red-500" />, color: "red" },
      ].map((card) => (
        <motion.div
          key={card.title}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className={`p-3 rounded-full bg-${card.color}-100 dark:bg-gray-700 mr-4`}>
            {card.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">{card.title}</h3>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-600 animate-pulse rounded mt-2"></div>
            ) : (
              <p className="text-2xl font-bold dark:text-white">{card.count}</p>
            )}
          </div>
        </motion.div>
      ))}

      {/* Recent Activity */}
      <div className="col-span-1 lg:col-span-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Activity</h3>
        <div className="space-y-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 animate-pulse rounded mb-2"></div>
                  <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-600 animate-pulse rounded"></div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 dark:text-gray-400 italic">No recent activity to display</div>
          )}
        </div>
      </div>
    </div>
  );
}