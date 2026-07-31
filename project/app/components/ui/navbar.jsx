import { useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const handleLogout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
        router.push("/");
      };


return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md py-4 px-12 flex flex-row justify-between items-center z-50">
        <h1 className="text-3xl font-bold text-gray-900">GuidanceHub</h1>
        <div className="flex space-x-8">

          {!isLoggedIn ? (
            <>
              <button onClick={() => router.push("/login")} className="text-gray-800 font-medium hover:text-blue-600">Log in</button>
              <button onClick={() => router.push("/login")} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">Sign Up</button>
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
)}

export default Navbar;