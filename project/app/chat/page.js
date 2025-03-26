'use client';
import { useState, useEffect, useCallback } from 'react';
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
    const email = sessionStorage.getItem('email');

    // Initialize socket and fetch user data
    useEffect(() => {
        const newSocket = io('http://localhost:3001'
        );
        setSocket(newSocket);

        const fetchData = async () => {
            try {
                const [userRes, connectionsRes] = await Promise.all([
                    axios.get(`/api/user/${email}`),
                    axios.get(`/api/user/connected/${email}`)
                ]);
                setConnections(connectionsRes.data);
                setUserId(userRes.data._id);
                console.log(userRes.data._id);
                console.log(connectionsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        return () => {
            newSocket.disconnect();
        };
    }, [email]);

    // Handle incoming messages
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            setMessages(prev => [...prev, {
                content: message.content,
                sender: message.from,
                receiver: message.to,
                // timestamp: message.timestamp || new Date()
            }]);
            // console.log(message);
        };
        // if (socket) {
        // console.log("received");
        socket.on('receiveMessage', handleReceiveMessage);
        // }

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, [socket]);

    // if (socket && roomId) {
    //     socket.emit('joinRoom', {
    //         user_id: userId,
    //         roomId: roomId
    //     });
    // }

    // Handle room joining when chat is selected
    useEffect(() => {
        if (!selectedChat?._id || !socket || !userId) return;

        const newRoomId = [userId, selectedChat._id].sort().join('_');
        setRoomId(newRoomId);

        // Fetch message history
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`/api/messages/${userId}/${selectedChat._id}`);
                setMessages(res.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

    }, [selectedChat, socket, userId]);

    useEffect(() => {
        if (!socket || !roomId || !userId) return;

        // return () => {
        //     socket.off('joinRoom', {
        //         user_id: userId,
        //         roomId: roomId
        //     });
        // }
    }, [socket, roomId, userId])

    const handleChatClick = useCallback((chat) => {
        setSelectedChat(chat);
        socket.emit('joinRoom', {
            user_id: userId,
            roomId: roomId
        });
        setIsProfileOpen(false);
    }, []);

    const sendMessage = () => {
        if (!message.trim() || !selectedChat || !roomId) return;
        // console.log("reached")

        socket.emit('joinRoom', {
            user_id: userId,
            roomId: roomId
        });

        // Optimistic update
        setMessages(prev => [...prev, {
            content: message,
            sender: userId,
            receiver: selectedChat._id,
            // timestamp: new Date(),
        }]);

        socket.emit('sendMessage', {
            content: message,
            from: userId,
            to: selectedChat._id,
            roomId: roomId
        });

        setMessage("");
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

                    {connections.map((chat) => (
                        <div
                            key={chat._id}
                            className={`flex flex-row py-4 px-2 items-center border-b cursor-pointer ${selectedChat?._id === chat.id ? 'bg-gray-200' : ''
                                }`}
                            onClick={() => handleChatClick(chat)}
                        >
                            <div className="w-1/4">
                                <img src={chat.picture !== "" ? chat.picture : "404"} alt="No image" className="object-cover h-12 w-12 rounded-full" />
                            </div>
                            <div className="w-3/4">
                                <div className="text-lg font-semibold">{chat.name ? `${chat.name}` : `${chat.email}`}</div>
                                {/* <span className="text-gray-500">{chat.message}</span> */}
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
                                    <button /*onClick={goBack}*/ className="mr-3 md:hidden text-lg">
                                        ⬅
                                    </button>
                                    <img
                                        src={selectedChat?.picture || "/default-avatar.png"}
                                        className="object-cover h-10 w-10 rounded-full"
                                        alt=""
                                    />
                                    <div className="ml-3 text-lg font-semibold">{selectedChat.name ? selectedChat.name : selectedChat.email}</div>
                                </div>
                                <button
                                    // onClick={toggleProfile}
                                    className="text-blue-500 hover:underline"
                                >
                                    View Profile
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 p-5 overflow-y-auto">
                                {messages.length === 0 ? (
                                    <div className="text-gray-500 text-center">Start a conversation</div>
                                ) : (
                                    messages.map((msg, index) => (
                                        <div key={index} className={`flex mb-4 ${msg.sender.toString() === userId ? "justify-end" : "justify-start"}`}>
                                            {msg.sender !== userId && (
                                                <img src={selectedChat?.picture || "/default-avatar.png"} className="object-cover h-8 w-8 rounded-full" alt="" />
                                            )}
                                            <div className={`py-3 px-4 rounded-lg text-white ${msg.sender.toString() === userId ? "bg-blue-500" : "bg-gray-400"} mx-2`}>
                                                {msg.content}
                                            </div>
                                            {msg.sender.toString() === userId && (
                                                <img src={selectedChat?.picture || "/default-avatar.png"} className="object-cover h-8 w-8 rounded-full" alt="" />
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Message Input */}
                            <div className="p-3 bg-gray-200 flex items-center rounded-b-lg">
                                <input
                                    className="w-full px-4 py-2 rounded-lg outline-none"
                                    type="text"
                                    placeholder="Type a message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
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
                            <button /*onClick={toggleProfile}*/ className="absolute top-3 right-3 text-gray-500 hover:text-black">
                                ✖
                            </button>
                            <div className="text-xl font-semibold mb-3">Profile</div>
                            <img src={selectedChat?.picture} className="object-cover rounded-xl w-32 h-32 mx-auto" alt="" />
                            <div className="text-center mt-3">
                                <div className="text-lg font-semibold">{selectedChat.name}</div>
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
