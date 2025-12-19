// src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Picker from 'emoji-picker-react';
import Navbar from '../components/Navbar';
import { FaPaperclip, FaSmile, FaPaperPlane, FaCircle } from 'react-icons/fa';

const socket = io(import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:4000');

const ChatPage = () => {
  const username = localStorage.getItem('username') || 'Anonymous';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const messagesEnd = useRef(null);

  useEffect(() => {
    socket.emit('join', username);
    socket.on('chatMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on('userCount', (count) => {
      setOnlineUsers(count);
    });
    return () => {
      socket.off('chatMessage');
      socket.off('userCount');
    };
  }, [username]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() && !selectedImage) return;
    const messageData = {
      author: username,
      text: input.trim(),
      image: selectedImage,
    };
    socket.emit('sendMessage', messageData);
    setInput('');
    setSelectedImage(null);
  };

  const onEmojiClick = (emojiObject) => {
    setInput((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const isCurrentUser = (author) => author === username;

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-screen bg-white">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 shadow-md border-b border-gray-200">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Community Chat</h1>
              <p className="text-blue-100 text-sm">Connect with fellow learners</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
              <FaCircle size={8} className="text-green-300 animate-pulse" />
              <span className="text-sm font-medium">{onlineUsers} Online</span>
            </div>
          </div>
        </header>

        {/* Messages Container */}
        <main className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50">
          <div className="max-w-4xl mx-auto w-full space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-5xl mb-4">💬</p>
                  <p className="text-gray-500 text-lg">No messages yet. Start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${isCurrentUser(msg.author) ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl transition-all ${
                      isCurrentUser(msg.author)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {!isCurrentUser(msg.author) && (
                      <div className="font-semibold text-sm mb-1 text-gray-600">
                        {msg.author}
                      </div>
                    )}
                    {msg.text && (
                      <div className={`text-sm break-words ${isCurrentUser(msg.author) ? 'text-white' : 'text-gray-900'}`}>
                        {msg.text}
                      </div>
                    )}
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="attachment"
                        className="mt-2 rounded-lg max-h-64 max-w-sm"
                      />
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEnd} />
          </div>
        </main>

        {/* Input Area */}
        <footer className="bg-white border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Image Preview */}
            {selectedImage && (
              <div className="mb-4 relative inline-block">
                <img src={selectedImage} alt="preview" className="h-20 rounded-lg" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Input Bar */}
            <div className="flex items-end gap-3">
              {/* File Upload */}
              <label className="cursor-pointer text-gray-500 hover:text-blue-600 transition">
                <FaPaperclip size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* Emoji Picker Toggle */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-gray-500 hover:text-blue-600 transition"
              >
                <FaSmile size={20} />
              </button>

              {/* Message Input */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-grow px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-gray-900"
              />

              {/* Send Button */}
              <button
                onClick={sendMessage}
                disabled={!input.trim() && !selectedImage}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperPlane size={16} />
                Send
              </button>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="mt-4">
                <Picker onEmojiClick={onEmojiClick} theme="light" />
              </div>
            )}
          </div>
        </footer>
      </div>
    </>
  );
};

export default ChatPage;