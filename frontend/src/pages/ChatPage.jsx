// src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import Picker from 'emoji-picker-react';

const socket = io(import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:4000');

const ChatPage = () => {
  const username = localStorage.getItem('username') || 'Anonymous';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEnd = useRef(null);

  useEffect(() => {
    socket.emit('join', username);
    socket.on('chatMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off('chatMessage');
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

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">
      <header className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chat Room</h1>
      </header>

      <main className="flex-grow overflow-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 p-3 rounded-lg max-w-lg"
          >
            <div className="text-purple-300 font-semibold">{msg.author}</div>
            <div className="text-white">{msg.text}</div>
            {msg.image && (
              <img src={msg.image} alt="attachment" className="mt-2 rounded max-h-64" />
            )}
          </motion.div>
        ))}
        <div ref={messagesEnd} />
      </main>

      <footer className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message…"
            className="flex-grow bg-gray-800 p-2 rounded"
          />
          <label className="cursor-pointer">
            📎
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-xl"
          >
            😀
          </button>
          <button
            onClick={sendMessage}
            className="px-4 bg-purple-600 rounded hover:bg-purple-700"
          >
            Send
          </button>
        </div>
        {showEmojiPicker && (
          <div className="absolute bottom-24">
            <Picker onEmojiClick={onEmojiClick} theme="dark" />
          </div>
        )}
      </footer>
    </div>
  );
};

export default ChatPage;
