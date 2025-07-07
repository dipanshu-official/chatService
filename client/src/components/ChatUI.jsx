import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { getAllUserDataSelector } from "../store/globalSelector";
import { getAllUser } from "../store/globalAction";

const ChatUI = () => {
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState({
    0: [
      {
        id: 1,
        text: "Hey! How's your day going?",
        sender: "them",
        time: "10:30 AM",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      },
      {
        id: 2,
        text: "Pretty good! Just working on some new designs. What about you?",
        sender: "me",
        time: "10:32 AM",
      },
      {
        id: 3,
        text: "Same here! I'm excited to show you what I've been working on",
        sender: "them",
        time: "10:33 AM",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      },
      {
        id: 4,
        text: "Can't wait to see it! 🎨",
        sender: "me",
        time: "10:35 AM",
      },
    ],
    1: [
      {
        id: 1,
        text: "The meeting is scheduled for 3 PM",
        sender: "them",
        time: "9:15 AM",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      },
      { id: 2, text: "Perfect! I'll be there", sender: "me", time: "9:16 AM" },
    ],
    2: [
      { id: 1, text: "Happy birthday! 🎉", sender: "me", time: "8:00 AM" },
      {
        id: 2,
        text: "Thank you so much! 💕",
        sender: "them",
        time: "8:30 AM",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      },
    ],
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allUser = useSelector(getAllUserDataSelector);

  // Initialize socket here, outside of useEffect, but memoize if necessary for production
  // For simplicity, we'll keep it here, but be aware of re-renders creating new sockets
  const socket = useRef(null); // Use useRef to persist socket instance

  useEffect(() => {
    // Initialize socket connection only once
    if (!socket.current) {
      socket.current = io("http://localhost:5000");
    }

    socket.current.on("receiveMessage", (msg) => {
      // Assuming msg contains information to identify the recipient/sender
      // For this example, let's assume 'msg.receiverId' or similar
      // Or if it's a direct message, we need to know which chat it belongs to.
      // For simplicity, if 'msg.sender' matches 'them' and it's for the currently selected user, add it.
      // In a real app, you'd likely have a 'chatId' or 'conversationId'
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        // This logic needs to be more robust in a real app to identify the correct conversation
        // For demonstration, we'll assume the received message is for the currently selected user
        // Or you might need a way to map the message to a specific conversation ID.
        // For example, if msg contained a `conversationId`:
        // if (newMessages[msg.conversationId]) {
        //   newMessages[msg.conversationId] = [...newMessages[msg.conversationId], msg];
        // }
        // For now, let's just add it to the current selected user's messages if it's from 'them'
        if (msg.sender === "them" && newMessages[selectedUserIndex]) {
             newMessages[selectedUserIndex] = [...(newMessages[selectedUserIndex] || []), msg];
        }
        return newMessages;
      });
    });

    return () => {
      if (socket.current) {
        socket.current.off("receiveMessage");
        // Don't disconnect here if you want to maintain connection across component unmounts
        // Or disconnect only when the user logs out from the entire app.
        // socket.current.disconnect();
      }
    };
  }, [selectedUserIndex]); // Re-run if selectedUserIndex changes to update receiveMessage logic if needed

  useEffect(() => {
    dispatch(getAllUser());
  }, [dispatch]);

  const messagesEndRef = useRef(null);

  const currentUser =
    allUser.length > selectedUserIndex ? allUser[selectedUserIndex] : null;

  const currentMessages = messages[selectedUserIndex] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = () => {
    if (message.trim() && currentUser) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: "me",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Update local state first
      setMessages((prev) => ({
        ...prev,
        [selectedUserIndex]: [...(prev[selectedUserIndex] || []), newMessage],
      }));

      // Emit message to socket server
      if (socket.current) {
        socket.current.emit("sendMessage", {
          text: message,
          sender: "me",
          receiverId: currentUser._id, // You'll need a way to identify the recipient on the server
          time: newMessage.time,
        });
      }

      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredUsers = allUser.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const theme = darkMode ? "dark" : "";

  return (
    <div className={`h-screen flex ${theme}`}>
      {/* Sidebar */}
      <div
        className={`w-80 ${
          darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        } border-r flex flex-col`}
      >
        {/* Header */}
        <div
          className={`p-4 ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-gray-50 border-gray-200"
          } border-b`}
        >
          <div className="flex items-center justify-between mb-4">
            <h1
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Messages
            </h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-200 text-gray-600"
                } transition-colors`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                className={`p-2 rounded-lg ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-200 text-gray-600"
                } transition-colors`}
              >
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
              size={18}
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user, index) => (
            <div
              key={user._id || index} // Use _id if available, fallback to index
              onClick={() => setSelectedUserIndex(index)} // Store the index
              className={`p-4 cursor-pointer transition-all duration-200 ${
                selectedUserIndex === index
                  ? darkMode
                    ? "bg-blue-600 bg-opacity-20"
                    : "bg-blue-50 border-r-2 border-blue-500"
                  : darkMode
                  ? "hover:bg-gray-800"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white font-semibold text-2xl flex items-center justify-center">
                    {user?.avatar}
                  </div>

                  {user.online && ( // Corrected: check user.online
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      } truncate`}
                    >
                      {user.name}
                    </p>
                    <span
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {user.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } truncate`}
                    >
                      {user.lastMessage}
                    </p>
                    {user.unread > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {user.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col ${
          darkMode ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        {/* Chat Header */}
        <div
          className={`p-4 ${
            darkMode
              ? "bg-gray-900 border-gray-700"
              : "bg-white border-gray-200"
          } border-b flex items-center justify-between`}
        >
          {currentUser ? ( // Only render if currentUser exists
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-semibold text-xl flex items-center justify-center">
                  {currentUser.avatar}
                </div>

                {currentUser.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h2
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {currentUser.name}
                </h2>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {currentUser.online ? "Active now" : "Last seen recently"}
                </p>
              </div>
            </div>
          ) : (
            <div
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Select a chat to start messaging
            </div>
          )}
          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded-lg ${
                darkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-100 text-gray-600"
              } transition-colors`}
            >
              <Phone size={20} />
            </button>
            <button
              className={`p-2 rounded-lg ${
                darkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-100 text-gray-600"
              } transition-colors`}
            >
              <Video size={20} />
            </button>
            <div className="relative">
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={`p-2 rounded-lg ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                } transition-colors`}
              >
                <MoreVertical size={20} />
              </button>

              {isOpen && (
                <div
                  className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-50 ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  }`}
                >
                  <ul className="py-1">
                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      Profile
                    </li>
                    <li
                      onClick={() => {
                        navigate("/");
                      }}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentMessages.map((msg) => (
            <div
              key={msg.id} // Use msg.id as key for messages
              className={`flex ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                  msg.sender === "me" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                {msg.sender === "them" &&
                  msg.avatar && ( // Render avatar for "them" if available
                    <img
                      src={msg.avatar}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    msg.sender === "me"
                      ? "bg-blue-500 text-white"
                      : darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-gray-900"
                  } shadow-sm`}
                >
                  <p>{msg.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.sender === "me"
                        ? "text-blue-100"
                        : darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div
          className={`p-4 ${
            darkMode
              ? "bg-gray-900 border-gray-700"
              : "bg-white border-gray-200"
          } border-t`}
        >
          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded-lg ${
                darkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-100 text-gray-600"
              } transition-colors`}
            >
              <Paperclip size={20} />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className={`w-full px-4 py-2 pr-12 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              <button
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                  darkMode
                    ? "hover:bg-gray-600 text-gray-300"
                    : "hover:bg-gray-200 text-gray-600"
                } transition-colors`}
              >
                <Smile size={18} />
              </button>
            </div>
            <button
              onClick={handleSendMessage} // Changed to handleSendMessage
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;