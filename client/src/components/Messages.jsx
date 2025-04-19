import React, { useState } from "react";
import { Send } from "lucide-react";

// Mock data - in a real app this would come from an API
const MOCK_CHATS = [
  {
    id: "1",
    partner: {
      id: "101",
      name: "Emma Wilson",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    messages: [
      {
        id: "m1",
        sender: "partner",
        text: "Hi there! I saw your profile and I think we could help each other out. I need help with Python and I can teach you Spanish.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: "m2",
        sender: "user",
        text: "Hey Emma! That sounds great. I'd love to help you with Python. What specific areas are you looking to learn?",
        timestamp: new Date(Date.now() - 1.8 * 60 * 60 * 1000),
      },
      {
        id: "m3",
        sender: "partner",
        text: "I'm trying to build a simple data analysis project but struggling with pandas and matplotlib. Could you help me with those?",
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      },
    ],
    unread: 0,
  },
  {
    id: "2",
    partner: {
      id: "103",
      name: "Sophie Taylor",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    messages: [
      {
        id: "m1",
        sender: "partner",
        text: "Hello! I noticed you want to learn graphic design. I could teach you Illustrator basics if you're interested in a skill exchange.",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
    ],
    unread: 1,
  },
];

const Messages = () => {
  const [activeChat, setActiveChat] = useState(MOCK_CHATS[0]);
  const [message, setMessage] = useState("");

  const formatTime = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // In a real app, this would involve an API call
    // For demo purposes, we'll just update the state directly
    const newMessage = {
      id: `m${Date.now()}`,
      sender: "user",
      text: message,
      timestamp: new Date(),
    };

    // Update the active chat with the new message
    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, newMessage],
    };

    // Update the chat in the list
    const updatedChats = MOCK_CHATS.map((chat) =>
      chat.id === activeChat.id ? updatedChat : chat
    );

    setActiveChat(updatedChat);
    setMessage("");
  };

  if (MOCK_CHATS.length === 0) {
    return (
      <div className="text-center py-6">
        <h3 className="text-lg font-medium text-gray-900">No messages</h3>
        <p className="mt-2 text-sm text-gray-500">
          When you connect with other users, your conversations will appear
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[500px] overflow-hidden rounded-lg border border-gray-200">
      {/* Sidebar with chat list */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Messages</h3>
        </div>
        <div className="overflow-y-auto h-[calc(500px-64px)]">
          {MOCK_CHATS.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`p-4 border-b border-gray-200 cursor-pointer ${
                activeChat.id === chat.id ? "bg-teal-50" : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={chat.partner.avatar}
                    alt={chat.partner.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {chat.unread > 0 && (
                    <span className="absolute top-0 right-0 h-3 w-3 bg-teal-500 rounded-full"></span>
                  )}
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chat.partner.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {chat.messages[chat.messages.length - 1].text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b border-gray-200 flex items-center">
          <img
            src={activeChat.partner.avatar}
            alt={activeChat.partner.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">
              {activeChat.partner.name}
            </h3>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeChat.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3/4 rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-teal-100"
                      : "text-gray-500"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-200"
        >
          <div className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded-r-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Messages;
