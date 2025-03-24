"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";

export default function EditProfile() {
    const [user, setUser] = useState({});
    const [name, setName] = useState('');

    const router = useRouter();
    useEffect(() => {

        const email = Cookies.get("email");
        const name = Cookies.get("name");
        const password = Cookies.get("password");
        // const role = localStorage.getItem("role");
        const phone = Cookies.get("phone");
        const bio = Cookies.get("bio");
        const skills = Cookies.get("skills");
        const experience = Cookies.get("experience");
        const availability = Cookies.get("availability");
        const rating = Cookies.get("rating");
        const connected = Cookies.get("connected");
        const imagePath = Cookies.get("imagePath");

        if (!email) {
            router.push('/login');
            return;
        }

        if (!name) {
          router.push('/form');
          return;
        }

        const fetch = async () => {
          try {
            const res = await axios.get(`/api/users/email/${email}`);
            setUser(res.data);
            console.log(res.data);
          } catch (error) {
            console.error(error);
          }
        }

        fetch();

    }, [])

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        console.log(name, value);
        // console.log("ok")

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

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/editbg.jpeg')] bg-cover bg-center p-4">
            <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-lg shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-center text-black mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4  overflow-y-auto max-h-110  " style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    <div>
                        <label className="block text-black py-2 font-bold">Username</label>
                        <input
                            defaultValue={"not known"}
                            type="text"
                            name="Name"
                            value={user?.name}
                            onChange={handleChange}
                            className="w-full bg-white bg-opacity-50 text-black p-2 rounded border-2 border-black focus:outline-none focus:ring focus:ring-blue-100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-black py-2 font-bold">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={user ? user.Password : "not known"}
                            onChange={handleChange}
                            className="w-full bg-white bg-opacity-30 text-black p-2 rounded border-2 border-black focus:outline-none focus:ring focus:ring-blue-100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-black py-2 font-bold">Email</label>
                        <input
                            defaultValue={"not known"}
                            type="email"
                            name="Email"
                            value={user?.Email}
                            onChange={handleChange}
                            className="w-full bg-white bg-opacity-30 text-black p-2 rounded border-2 border-black focus:outline-none focus:ring focus:ring-blue-100"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-black py-2 font-bold">Bio</label>
                        <input
                            defaultValue={"not known"}
                            type="text"
                            name="Bio"
                            value={user?.Bio}
                            onChange={handleChange}
                            className="w-full bg-white bg-opacity-30 text-black p-2 rounded border-2 border-black focus:outline-none focus:ring focus:ring-blue-100"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-black py-2 font-bold">Skills</label>
                        <input
                            defaultValue={"not known"}
                            type="text"
                            name="Skills"
                            value={user?.Skills}
                            onChange={handleChange}
                            className="w-full bg-white bg-opacity-30 text-black p-2 rounded border-2 border-black focus:outline-none focus:ring focus:ring-blue-100"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-black py-2 font-bold">Experience</label>
                        <input
                            defaultValue={"not known"}
                            type="text"
                            name="Experience"
                            value={user?.Experience}
                            onChange={handleChange}
                            className="w-full bg-white bg-opacity-30 text-black p-2 border-2 border-black focus:outline-none focus:ring focus:ring-blue-100"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-black py-2 font-bold">Availability</label>
                        <input
                            defaultValue={"not known"}
                            type="text"
                            name="Availability"
                            value={user?.Availability}
                            onChange={handleChange}
                            className="w-full bg-white bg-opacity-30 text-black p-2 rounded border-2 border-black  focus:outline-none focus:ring focus:ring-blue-100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-black py-2 font-bold">Phone</label>
                        <input
                            defaultValue={"not known"}
                            type="tel"
                            name="Phone"
                            value={user?.Phone}
                            onChange={handleChange}

                            className="w-full bg-white bg-opacity-30 text-black p-2 rounded border-2 border-black  focus:outline-none focus:ring focus:ring-blue-100"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
}