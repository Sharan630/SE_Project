"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star } from "lucide-react";
import { useRouter } from 'next/navigation';

const Form = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [experience, setExperience] = useState('0');
    const [availability, setAvailability] = useState([]);
    const [day, setDay] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePath, setImagePath] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [fees, setfees] = useState('');

    const router = useRouter();

    useEffect(() => {
        const email = sessionStorage.getItem('email');
        if (!email) {
            router.push('/login');
            return;
        }
        setRole(sessionStorage.getItem('role'));
    }, [router]);

    const handleAddSkill = () => {
        if (skillInput.trim() !== '' && !skills.includes(skillInput.trim())) {
            setSkills([...skills, skillInput.trim()]);
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleAddTimeSlot = () => {
        if (timeSlot.trim() !== '') {
            setTimeSlots([...timeSlots, timeSlot.trim()]);
            setTimeSlot('');
        }
    };

    const handleAddAvailability = () => {
        if (day.trim() !== '' && timeSlots.length > 0) {
            const newAvailability = {
                day: day.trim(),
                timeSlots: [...timeSlots]
            };
            setAvailability([...availability, newAvailability]);
            setDay('');
            setTimeSlots([]);
        }
    };

    const handleRemoveAvailability = (index) => {
        const newAvailability = [...availability];
        newAvailability.splice(index, 1);
        setAvailability(newAvailability);
    };

    // const handleFileChange = (event) => {
    //     const file = event.target.files[0];
    //     setImageFile(file);
    // };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (file) {
            setImageFile(file);
            // Create a preview URL for the selected image
            setImagePreview(URL.createObjectURL(file));
        }
    };
    const handleUploadImage = async () => {
        if (!imageFile) {
            alert("Please select an image first!");
            return;
        }
        
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", imageFile);
            
            const uploadResponse = await axios.post("/api/imgupload", formData);
            
            if (uploadResponse.status === 200 && uploadResponse.data.success) {
                setImageUrl(uploadResponse.data.imageUrl);
                alert("Image uploaded successfully!");
            } else {
                // alert("Image upload failed!");
                throw new Error(uploadResponse.data.error || "Upload failed!");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload error: " + (error.response?.data?.error || error.message));
        } finally {
            setUploading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (phone.length !== 10 || isNaN(phone)) {
            alert('Phone No. must be exactly 10 digits');
            return;
        }

        if (!name || !role) {
            alert('Name, email, password and role are required');
            return;
        }
        if (role === 'mentor' && !fees) {
            alert('Fees are required for mentors');
            return;
        }

        try {
            // Upload image if provided
            let uploadedImageUrl = imageUrl;

            // Send registration data to API
            if (imageFile) {
                setUploading(true);
                const formData = new FormData();
                formData.append("image", imageFile);
    
                const uploadResponse = await axios.post("/api/imgupload", formData);
                if (uploadResponse.data.success) {
                    uploadedImageUrl = uploadResponse.data.imageUrl;
                } else {
                    alert("Image upload failed!");
                    setUploading(false);
                    return;
                }
                setUploading(false);
            }
             const email = sessionStorage.getItem('email');
            // console.log(role);
            const response = await axios.post(`/api/registration/${role}`, {
                name,
                email,
                password,
                role,
                phone,
                bio,
                fees,
                skills,
                experience,
                availability,
                picture: uploadedImageUrl,
            });

            console.log('Registration successful:', response.data);
            sessionStorage.setItem('phone', phone);
            
            sessionStorage.setItem('name', name);
            sessionStorage.setItem('registered', 'true');
            alert('Registration successful');
            router.push('/home');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-[100vh] overflow-hidden bg-[url('/registerbg.jpeg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-cover bg-center opacity-30"></div>
            <div className="relative bg-green-50 p-8 my-3 rounded-2xl shadow-2xl w-[90vw] max-w-2xl overflow-y-auto max-h-[140vh] scrollbar-hide">
                <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
                    Registration
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-6">
                        {/* Basic Information */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                                placeholder="Enter your name"
                                className="mt-1 p-3 border rounded-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                                required
                            />
                        </div>
                        {role === 'mentor' && <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Fees * (per month)
                            </label>
                            <input
                                type="number"
                                value={fees}
                                onChange={(e) => setfees(e.target.value)}
                                placeholder="Enter your Fees"
                                className="mt-1 p-3 border rounded-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                                required
                            />
                        </div>}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Phone *
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="Enter your phone"
                                className="mt-1 p-3 border rounded-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                                required
                                maxLength={10}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Bio
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Enter your Bio"
                                className="mt-1 p-3 border rounded-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                                rows={3}
                            />
                        </div>

                        {/* Experience */}
                        {role === 'mentor' && <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Experience (in years)
                            </label>
                            <input
                                type="number"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                placeholder="Enter your experience"
                                className="mt-1 p-3 border rounded-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                                min="0"
                            />
                        </div>}

                        {/* Profile Picture */}
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Profile Picture
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="mt-1 p-3 border rounded-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                                accept="image/*"
                            />
                        </div> */}
                          <div className="col-span-full">
                            <label className="block text-sm font-medium text-gray-700">
                                Profile Picture
                            </label>
                            <div className="flex items-center gap-4 mt-2">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="p-2 border rounded-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    accept="image/*"
                                />
                                <button
                                    type="button"
                                    onClick={handleUploadImage}
                                    disabled={uploading || !imageFile}
                                    className={`px-4 py-2 rounded-md text-white ${uploading || !imageFile ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                >
                                    {uploading ? "Uploading..." : "Upload"}
                                </button>
                            </div>
                            {imagePreview && (
                                <div className="mt-2">
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="h-20 w-20 object-cover rounded-full border-2 border-gray-300" 
                                    />
                                </div>
                            )}
                            {imageUrl && (
                                <p className="text-sm text-green-600 mt-1">
                                    Image uploaded successfully! ✓
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Skills
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {skills.map((skill, index) => (
                                <div key={index} className="bg-indigo-100 px-3 py-1 rounded-full flex items-center">
                                    <span>{skill}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(skill)}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                placeholder="Add a skill"
                                className="p-3 border rounded-l-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block flex-grow"
                            />
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-r-md"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Availability Section */}
                    {role === 'mentor' && <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Availability
                        </label>
                        <div className="mb-4">
                            {availability.map((item, index) => (
                                <div key={index} className="bg-indigo-50 p-3 rounded-md mb-2 flex justify-between items-center">
                                    <div>
                                        <strong>{item.day}:</strong> {item.timeSlots.join(', ')}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveAvailability(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                                <select
                                    value={day}
                                    onChange={(e) => setDay(e.target.value)}
                                    className="p-3 border rounded-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                                >
                                    <option value="">Select Day</option>
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                    <option value="Sunday">Sunday</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time Slots</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={timeSlot}
                                        onChange={(e) => setTimeSlot(e.target.value)}
                                        placeholder="e.g., 9:00 AM - 11:00 AM"
                                        className="p-3 border rounded-l-md text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block flex-grow"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTimeSlot}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-r-md"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {timeSlots.map((slot, index) => (
                                    <div key={index} className="bg-indigo-100 px-3 py-1 rounded-full flex items-center">
                                        <span>{slot}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newTimeSlots = [...timeSlots];
                                                newTimeSlots.splice(index, 1);
                                                setTimeSlots(newTimeSlots);
                                            }}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            x
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleAddAvailability}
                                disabled={!day || timeSlots.length === 0}
                                className={`w-full mt-2 ${!day || timeSlots.length === 0 ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold py-2 px-4 rounded-md`}
                            >
                                Add Availability
                            </button>
                        </div>
                    </div>}

                    <div className="mx-auto w-full flex justify-center items-center mt-8">
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-12 rounded-full w-auto"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Form;