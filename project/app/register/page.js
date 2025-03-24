"use client";
import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import { Star } from "lucide-react";
import { useRouter } from 'next/navigation';
// import Modal from '../modal/page';
// import mongoose from "mongoose";
const Form = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState([]);
    const [experience, setExperience] = useState(0);
    const [availability, setAvailability] = useState([]);
    const [rating, setRating] = useState([]);
    const [connected, setConnected] = useState([]);
    // const [showModal, setShowModal] = useState(false);
    const [imageFile, setImageFile] = useState();
    const [imagePath, setimagepath] = useState("");


    const router = useRouter();
    useEffect(() => {
        const email = localStorage.getItem('email');
        const password = localStorage.getItem('password');
        if (!email || !password) {
            router.push('/home');
            return;
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (phone.length !== 10 || isNaN(phone)) {
            alert('Phone No. must be exactly 10 digits');
            return;
        }
        submitForm();
    };

    const submitForm = async () => {
        try {
            var uploadedImagePath = "";
            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);

                const uploadResponse = await axios.post("/api/upload", formData);
                console.log("Upload Response:", uploadResponse.data);

                if (!uploadResponse.data.success) {
                    alert("Image upload failed!");
                    return;
                }
                uploadedImagePath = uploadResponse.data.path;
                setimagepath(uploadedImagePath);
            }

            console.log(uploadedImagePath);

            if (!name || !phone) {
                alert('All fields are required');
                return;
            }


            const email = localStorage.getItem('email');
            const password = localStorage.getItem('password');

            const response = await axios.post('/api/registration', {
                name,
                bio,
                skills,
                experience,
                availability,
                rating,
                connected,
                role,
                phone,
                email,
                password,
                uploadedImagePath,
            });

            console.log('Registration successful:', response.message);
            localStorage.setItem('phone', phone);
            alert('Registration successful');
            localStorage.setItem('registered', 'true');
            router.push('/home');


            return;
            setPhone('');
            setName('');
            setAvailability('');
            setBio('');
            setRating([]);
            setSkills([]);
            setEmail('');
            setPassword('');
            setRole('');
            setExperience('');
            setConnected('');
            setImageLink('');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed');
        }
    };

    // const handleModalConfirm = () => {
    //   setShowModal(false);
    //   submitForm();
    // };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImageFile(file);
    };

    // const handleModalCancel = () => {
    //   setShowModal(false);
    // };

    return (
        <div className="relative flex items-center justify-center min-h-[100vh] overflow-hidden  bg-[url('/registerbg.jpeg')] bg-cover bg-center">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                // style={{ backgroundImage: url('/bg.jpg') }}
            ></div>
            <div className="relative bg-green-50 p-8 my-3  rounded-2xl shadow-2xl w-[90vw] max-w-2xl overflow-y-auto max-h-[140vh] scrollbar-hide">
                <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
                    Registration
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-6">
                        <div>
                            <label className="block text-sm   overflow-y-auto max-h-80 font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                                placeholder="Enter your name"
                                className="mt-1 p-3 border rounded-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your Email"
                                className="mt-1 p-3 border rounded-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your Password"
                                className="mt-1 p-3 border rounded-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Phone
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="Enter your phone"
                                className="mt-1 p-3 border rounded-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Role
                            </label>
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                                placeholder="Enter your Role "
                                className="mt-1 p-3 border rounded-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Bio
                            </label>
                            <input
                                type="text"
                                value={bio}
                                onChange={(e) => setBio(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                                placeholder="Enter your Bio"
                                className="mt-1 p-3 border rounded-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Skills
                            </label>
                            <input
                                type="text"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                                placeholder="Enter your Skills"
                                className="mt-1 p-3 border rounded-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Experience
                            </label>
                            <input
                                type="text"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                placeholder="Enter your Experience"
                                className="mt-1 p-3 border rounded-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Availability
                            </label>
                            <input
                                type="text"
                                value={availability}
                                onChange={(e) => setAvailability(e.target.value)}
                                placeholder="Enter your  Availability "
                                className="mt-1 p-3 border rounded-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Connected
                            </label>
                            <input
                                type="text"
                                value={connected}
                                onChange={(e) => setConnected(e.target)}
                                placeholder=" Connected "
                                className="mt-1 p-3 border rounded-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Image Link
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                placeholder="Enter image link"
                                className="mt-1 p-3 border rounded-md  text-gray-700   shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Rating</label>
                            <div className="flex space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`w-8 h-8 cursor-pointer transition ${star <= rating ? "text-yellow-500" : "text-gray-300"
                                            }`}
                                        fill={star <= rating ? "currentColor" : "none"}
                                        stroke="currentColor"
                                    />
                                ))}
                            </div>
                            <p className="text-gray-600 text-sm">Your rating: {rating} / 5</p>
                        </div>
                    </div>
                    <div className='mx-auto w-full flex justify-center items-center'>
                        <button
                            type="submit"
                            className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-12 rounded-full w-auto "
                        >
                            Submit
                        </button>
                    </div>

                </form>


                {/* {showModal && (
          <Modal
            onConfirm={handleModalConfirm}
            onCancel={handleModalCancel}
          />
        )} */}
            </div>
        </div>
    );
};

export default Form;