'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";

export default function ChatPage() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [connections, setConnections] = useState([]);
    const [socket, setSocket] = useState(null);
    const [userId, setUserId] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [fileUploading, setFileUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [user, setuser] = useState({});

    // Initialize socket and fetch user data
    useEffect(() => {
        let newSocket = io('http://localhost:3001');
        setSocket(newSocket);

        const email = sessionStorage.getItem('email');
        if (!email) {
            router.push('/home');
            return;
        }

        const fetchData = async () => {
            try {
                // await axios.post('/api/reset');
                const [userRes, connectionsRes] = await Promise.all([
                    axios.get(`/api/user/${email}`),
                    axios.get(`/api/user/connected/${email}`)
                ]);
                const uniqueConnections = connectionsRes.data.filter(
                    (connection, index, self) =>
                        index === self.findIndex((c) => c.user._id === connection.user._id)
                );

                setConnections(uniqueConnections);
                setUserId(userRes.data._id);
                setuser(userRes.data);
                // console.log("User ID:", userRes.data._id);
                // console.log("Connections:", uniqueConnections);
                // setConnections(connectionsRes.data);
                // setUserId(userRes.data._id);
                // setuser(userRes.data);
                // console.log(userRes.data._id);
                // console.log("connections : ", connectionsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Sort messages by timestamp
    const sortMessagesByTimestamp = (msgs) => {
        return [...msgs].sort((a, b) => {
            const timestampA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timestampB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timestampA - timestampB;
        });
    };

    // Handle incoming messages
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            setMessages(prev => {
                const newMessages = [...prev, {
                    content: message.content,
                    sender: message.from,
                    receiver: message.to,
                    timestamp: message.timestamp || new Date().toISOString(),
                    fileUrl: message.fileUrl,
                    fileName: message.fileName,
                    fileType: message.fileType
                }];
                return sortMessagesByTimestamp(newMessages);
            });
        };

        socket.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, [socket]);

    // Handle room joining when chat is selected
    useEffect(() => {
        if (!selectedChat?._id || !socket || !userId) return;

        const newRoomId = [userId, selectedChat.user._id].sort().join('_');
        setRoomId(newRoomId);

        // Fetch message history
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`/api/messages/${userId}/${selectedChat.user._id}`);
                // Sort fetched messages by timestamp
                setMessages(sortMessagesByTimestamp(res.data));
                console.log(res);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

    }, [selectedChat, socket, userId]);

    // Add this after establishing socket connection
    useEffect(() => {
        if (socket && userId && roomId) {
            console.log("Attempting to join room:", roomId);
            socket.emit('joinRoom', {
                roomId: roomId,
                user_id: userId
            });

            // Listen for confirmation
            socket.on('roomJoined', (data) => {
                console.log("Room joined confirmation:", data);
            });
        }
    }, [socket, userId, roomId]);

    const handleChatClick = useCallback((chat) => {
        setSelectedChat(chat);
        const newRoomId = [userId, chat._id].sort().join('_');
        setRoomId(newRoomId);
        setIsProfileOpen(false);
    }, [userId]);

    const sendMessage = async () => {
        if ((!message.trim() && !fileUploading) || !selectedChat || !roomId || !socket) {
            console.error("Cannot send message, missing required data:", {
                hasMessage: !!message.trim(),
                hasSelectedChat: !!selectedChat,
                roomId,
                hasSocket: !!socket
            });
            return;
        }
        const timestamp = new Date().toISOString();
        socket.emit('joinRoom', {
            roomId: roomId,
            user_id: userId
        });

        // Optimistic update with sorted messages
        // setMessages(prev => {
        //     const newMessages = [...prev, {
        //         content: message,
        //         sender: userId,
        //         receiver: selectedChat.user._id,
        //         timestamp: timestamp,
        //     }];
        //     return sortMessagesByTimestamp(newMessages);
        // });

        socket.emit('sendMessage', {
            content: message,
            from: userId,
            to: selectedChat.user._id,
            roomId: roomId,
            timestamp: timestamp
        });

        setMessage("");
    };

    const handleFileSelect = () => {
        fileInputRef.current.click();
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !selectedChat || !roomId) return;

        setFileUploading(true);

        try {
            // Create form data
            const formData = new FormData();
            formData.append('file', file);
            formData.append('roomId', roomId);
            formData.append('senderId', userId);
            formData.append('receiverId', selectedChat.user._id);
            // console.log(formData);
            // console.log(file, roomId, userId, selectedChat.user._id);

            // Upload file
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const { fileUrl, filename } = response.data;
            // console.log(fileUrl, filename);

            // Send message with file info
            socket.emit('sendMessage', {
                content: `Sent a file: ${filename}`,
                from: userId,
                to: selectedChat.user._id,
                roomId: roomId,
                timestamp: new Date().toISOString(),
                fileUrl,
                fileName: filename,
                fileType: file.type
            });

            // Optimistic update
            // setMessages(prev => {
            //     const newMessages = [...prev, {
            //         content: `Sent a file: ${filename}`,
            //         sender: userId,
            //         receiver: selectedChat._id,
            //         timestamp: new Date().toISOString(),
            //         fileUrl,
            //         fileName: filename,
            //         fileType: file.type
            //     }];
            //     return sortMessagesByTimestamp(newMessages);
            // });
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file. Please try again.');
        } finally {
            setFileUploading(false);
            // Reset the input
            e.target.value = '';
        }
    };

    // Format timestamp for display
    const formatMessageTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Helper to determine file type
    const getFileType = (fileType, fileName) => {
        if (fileType && fileType.startsWith('image/')) {
            return 'image';
        }
        if (fileType === 'application/pdf' || (fileName && fileName.toLowerCase().endsWith('.pdf'))) {
            return 'pdf';
        }
        return 'other';
    };

    // Download file handler
    const handleDownload = (fileUrl, fileName) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto shadow-lg rounded-lg">
            {/* Header */}
            <div className="px-5 py-5 flex justify-between items-center bg-gray-200 border-b-2">
                <div className="font-semibold text-2xl">GoingChat</div>
                <div className="w-1/2 hidden md:block">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="rounded-2xl bg-gray-50 py-3 px-5 w-full"
                    />
                </div>
                <div className="h-12 w-12 p-2 bg-yellow-700 rounded-full text-white font-semibold flex items-center justify-center">
                    RA
                </div>
            </div>

            {/* Chat Section */}
            <div className="flex flex-row justify-between bg-gray-50 h-[calc(100vh-80px)]">
                {/* Chat List */}
                <div
                    className={`flex flex-col w-full md:w-1/3 border-r bg-white overflow-y-auto ${selectedChat ? 'hidden md:flex' : 'flex'
                        }`}
                >
                    <div className="border-b bg-white py-2 px-2 relative">
                        <input
                            type="text"
                            placeholder="Search chatting..."
                            className="py-2 pl-10 pr-2 border-2 border-gray-200 rounded-2xl w-full outline-none"
                        />
                        <img
                            src="/search.png"
                            alt="search"
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                        />
                    </div>

                    {connections && connections.map((chat) => (
                        <div
                            key={chat._id}
                            className={`flex flex-row py-4 px-2 items-center border-b cursor-pointer ${selectedChat?.user._id === chat.user._id ? 'bg-gray-200' : ''
                                }`}
                            onClick={() => handleChatClick(chat)}
                        >
                            <div className="w-1/4">
                                <img src={chat.user.picture !== "" ? chat.user.picture : "404"} alt="No image" className="object-cover h-12 w-12 rounded-full" />
                            </div>
                            <div className="w-3/4">
                                <div className="text-lg font-semibold">{chat.user.name ? `${chat.user.name}` : `${chat.user.email}`}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chat Window */}
                <div
                    className={`w-full md:w-2/3 flex flex-col ${selectedChat ? 'flex' : 'hidden md:flex'
                        }`}
                >
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="flex items-center justify-between p-3 bg-white border-b">
                                <div className="flex items-center">
                                    <button className="mr-3 md:hidden text-lg">
                                        ⬅
                                    </button>
                                    <img
                                        src={selectedChat?.user.picture || "/default-avatar.png"}
                                        className="object-cover h-10 w-10 rounded-full"
                                        alt=""
                                    />
                                    <div className="ml-3 text-lg font-semibold">
                                        {selectedChat.user.name ? selectedChat.user.name : selectedChat.user.email}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {/* Call Button (Video Call Icon) */}
                                    <button
                                        onClick={() => window.location.href = '/vcall'}  // Navigates to /vcall
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                                        title="Start Video Call"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </button>
                                    {/* View Profile Button */}
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 p-5 overflow-y-auto">
                                {messages.length === 0 ? (
                                    <div className="text-gray-500 text-center">Start a conversation</div>
                                ) : (
                                    messages.map((msg, index) => (
                                        <div key={index} className={`flex mb-4 ${msg.sender.toString() === userId ? "justify-end" : "justify-start"}`}>
                                            {msg.sender.toString() !== userId && (
                                                <img src={selectedChat?.user.picture || "/default-avatar.png"} className="object-cover h-8 w-8 rounded-full" alt="" />
                                            )}
                                            <div className="flex flex-col">
                                                <div className={`py-3 px-4 rounded-lg text-white ${msg.sender.toString() === userId ? "bg-blue-500" : "bg-gray-400"} mx-2`}>
                                                    {msg.content}

                                                    {/* Display file based on type */}
                                                    {msg.fileUrl && (
                                                        <div className="mt-2">
                                                            {getFileType(msg.fileType, msg.fileName) === 'image' && (
                                                                <img
                                                                    src={msg.fileUrl}
                                                                    alt={msg.fileName || "Image"}
                                                                    className="max-w-xs rounded"
                                                                />
                                                            )}

                                                            {getFileType(msg.fileType, msg.fileName) === 'pdf' && (
                                                                <div className="flex flex-col bg-white bg-opacity-20 p-2 rounded">
                                                                    <div className="flex items-center mb-2">
                                                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path d="M4 18h12a2 2 0 002-2V6a2 2 0 00-2-2h-4l-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                                        </svg>
                                                                        <span className="text-white font-medium">{msg.fileName || "PDF Document"}</span>
                                                                    </div>
                                                                    <div className="flex space-x-2">
                                                                        <a
                                                                            href={msg.fileUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                                                                        >
                                                                            View
                                                                        </a>
                                                                        <button
                                                                            onClick={() => handleDownload(msg.fileUrl, msg.fileName)}
                                                                            className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                                                                        >
                                                                            Download
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {getFileType(msg.fileType, msg.fileName) === 'other' && (
                                                                <div className="flex flex-col bg-white bg-opacity-20 p-2 rounded">
                                                                    <div className="flex items-center mb-2">
                                                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path d="M4 18h12a2 2 0 002-2V6a2 2 0 00-2-2h-4l-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                                        </svg>
                                                                        <span className="text-white font-medium">{msg.fileName || "File"}</span>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleDownload(msg.fileUrl, msg.fileName)}
                                                                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                                                                    >
                                                                        Download
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`text-xs text-gray-500 mx-2 mt-1 ${msg.sender.toString() === userId ? "text-right" : "text-left"}`}>
                                                    {formatMessageTime(msg.timestamp)}
                                                </div>
                                            </div>
                                            {msg.sender.toString() === userId && (
                                                <img src={user?.picture} className="object-cover h-8 w-8 rounded-full" alt="nothing" />
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Message Input and File Upload */}
                            <div className="p-3 bg-gray-200 flex items-center rounded-b-lg">
                                <button
                                    onClick={handleFileSelect}
                                    className="px-2 py-2 bg-gray-300 text-gray-600 rounded-lg mr-2"
                                    disabled={fileUploading}
                                >
                                    {fileUploading ? 'Uploading...' : (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                        </svg>
                                    )}
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <input
                                    className="w-full px-4 py-2 rounded-lg outline-none"
                                    type="text"
                                    placeholder="Type a message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <button
                                    onClick={sendMessage}
                                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                                    disabled={fileUploading}
                                >
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Select a chat to start messaging
                        </div>
                    )}
                </div>

                {/* Profile Section */}
                <div className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-5 transition-transform ${isProfileOpen ? 'translate-x-0' : 'translate-x-full'
                    } duration-300`}>
                    {selectedChat && (
                        <>
                            <button onClick={() => setIsProfileOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-black">
                                ✖
                            </button>
                            <div className="text-xl font-semibold mb-3">Profile</div>
                            <img src={selectedChat?.user.picture || "/default-avatar.png"} className="object-cover rounded-xl w-32 h-32 mx-auto" alt="" />
                            <div className="text-center mt-3">
                                <div className="text-lg font-semibold">{selectedChat.user.name || selectedChat.user.email}</div>
                                <div className="text-gray-500">Active now</div>
                            </div>
                            <div className="mt-5">
                                <h3 className="text-lg font-semibold">About</h3>
                                <p className="text-gray-600">This is a demo user profile</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}