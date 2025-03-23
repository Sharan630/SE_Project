'use client';
import { useState } from 'react';

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const chats = [
    {
      id: 1,
      name: 'Luis1994',
      message: 'Pick me at 9:00 AM',
      img: 'https://w0.peakpx.com/wallpaper/845/658/HD-wallpaper-thala-dhoni-chennai-super-kings-ms-dhoni.jpg',
    },
    {
      id: 2,
      name: 'MERN Stack',
      message: 'Lusi : Thanks Everyone',
      img: 'https://w0.peakpx.com/wallpaper/845/658/HD-wallpaper-thala-dhoni-chennai-super-kings-ms-dhoni.jpg',
    },
    {
      id: 3,
      name: 'Javascript Indonesia',
      message: 'Evan : Someone can fix this?',
      img: 'https://w0.peakpx.com/wallpaper/845/658/HD-wallpaper-thala-dhoni-chennai-super-kings-ms-dhoni.jpg',
    },
  ];

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setIsProfileOpen(false); // Close profile when switching chats
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const goBack = () => {
    setSelectedChat(null);
    setIsProfileOpen(false);
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
        {/* Chat List (Show only if no chat is selected on mobile) */}
        <div
          className={`flex flex-col w-full md:w-1/3 border-r bg-white overflow-y-auto ${
            selectedChat ? 'hidden md:flex' : 'flex'
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

          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex flex-row py-4 px-2 items-center border-b cursor-pointer ${
                selectedChat?.id === chat.id ? 'bg-gray-200' : ''
              }`}
              onClick={() => handleChatClick(chat)}
            >
              <div className="w-1/4">
                <img src={chat.img} className="object-cover h-12 w-12 rounded-full" alt="" />
              </div>
              <div className="w-3/4">
                <div className="text-lg font-semibold">{chat.name}</div>
                <span className="text-gray-500">{chat.message}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Window (Show only when a chat is selected) */}
        <div
          className={`w-full md:w-2/3 flex flex-col ${
            selectedChat ? 'flex' : 'hidden md:flex'
          }`}
        >
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-3 bg-white border-b">
                <div className="flex items-center">
                  <button onClick={goBack} className="mr-3 md:hidden text-lg">
                    ⬅
                  </button>
                  <img
                    src={selectedChat.img}
                    className="object-cover h-10 w-10 rounded-full"
                    alt=""
                  />
                  <div className="ml-3 text-lg font-semibold">{selectedChat.name}</div>
                </div>
                <button
                  onClick={toggleProfile}
                  className="text-blue-500 hover:underline"
                >
                  View Profile
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-5 overflow-y-auto">
                <div className="flex justify-end mb-4">
                  <div className="mr-2 py-3 px-4 bg-blue-400 rounded-lg text-white">
                    Welcome to the group!
                  </div>
                  <img
                    src={selectedChat.img}
                    className="object-cover h-8 w-8 rounded-full"
                    alt=""
                  />
                </div>
                <div className="flex justify-start mb-4">
                  <img
                    src={selectedChat.img}
                    className="object-cover h-8 w-8 rounded-full"
                    alt=""
                  />
                  <div className="ml-2 py-3 px-4 bg-gray-400 rounded-lg text-white">
                    Hello! How are you?
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-3 bg-gray-200 flex items-center rounded-b-lg">
                <input
                  className="w-full px-4 py-2 rounded-lg outline-none"
                  type="text"
                  placeholder="Type a message..."
                />
                <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
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

        {/* Profile Section (Hidden Until Opened) */}
        {isProfileOpen && selectedChat && (
          <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-lg p-5">
            <button
              onClick={toggleProfile}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✖
            </button>
            <div className="text-xl font-semibold mb-3">Profile</div>
            <img
              src={selectedChat.img}
              className="object-cover rounded-xl w-32 h-32 mx-auto"
              alt=""
            />
            <div className="text-center mt-3">
              <div className="text-lg font-semibold">{selectedChat.name}</div>
              <div className="text-gray-500">Active now</div>
            </div>
            <div className="mt-5">
              <h3 className="text-lg font-semibold">About</h3>
              <p className="text-gray-600">This is a demo user profile</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
