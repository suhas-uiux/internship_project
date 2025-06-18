// --- ChatPage.jsx ---
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import Picker from 'emoji-picker-react';

const socket = io(import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:4000');

const ChatPage = () => {
  const username = localStorage.getItem('username') || 'Anonymous';
  const [messages, setMessages] = useState([]); // Start with empty, load from server
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [reactionMenuFor, setReactionMenuFor] = useState(null);
  const messagesEnd = useRef(null);

  useEffect(() => {
    socket.emit('join', username);

    // ✅ Always load fresh messages from server
    socket.on('chatHistory', (serverMessages) => {
      setMessages(serverMessages);
      localStorage.setItem('chatMessages', JSON.stringify(serverMessages)); // Optional: for reload backup
    });

    socket.on('chatMessage', (msg) => {
      setMessages((prev) => {
        const updated = [...prev, msg];
        localStorage.setItem('chatMessages', JSON.stringify(updated));
        return updated;
      });
    });

    socket.on('updateReactions', ({ id, reactions }) => {
      setMessages((prev) => {
        const updated = prev.map((msg) =>
          msg.id === id ? { ...msg, reactions } : msg
        );
        localStorage.setItem('chatMessages', JSON.stringify(updated));
        return updated;
      });
    });

    return () => {
      socket.off('chatHistory');
      socket.off('chatMessage');
      socket.off('updateReactions');
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
      reactions: {},
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

  const toggleReaction = (msgId, emoji) => {
    socket.emit('reactToMessage', { msgId, emoji, user: username });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white relative">
      <header className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chat Room</h1>
      </header>

      <main className="flex-grow overflow-auto p-4 space-y-2">
        {messages.map((msg) => {
          const isOwnMessage = msg.author === username;
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} relative`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs md:max-w-md break-words
                  ${isOwnMessage ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-800 text-white rounded-bl-none'}
                `}
              >
                <div className="text-sm font-semibold mb-1 text-purple-300">
                  {msg.author}
                </div>
                <div>{msg.text}</div>
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="attachment"
                    className="mt-2 rounded max-h-64 cursor-pointer"
                    onClick={() => setFullscreenImage(msg.image)}
                  />
                )}
                <div className="mt-2 flex gap-2 flex-wrap">
                  {msg.reactions &&
                    Object.entries(msg.reactions).map(([emoji, users]) => (
                      <div
                        key={emoji}
                        className="bg-black/30 px-2 py-1 rounded-full text-sm cursor-pointer"
                        onClick={() => toggleReaction(msg.id, emoji)}
                      >
                        {emoji} {users.length}
                      </div>
                    ))}
                  <button
                    className="text-xs bg-white/10 px-2 py-1 rounded"
                    onClick={() => setReactionMenuFor(msg.id)}
                  >
                    React
                  </button>
                </div>
              </div>
              {reactionMenuFor === msg.id && (
                <div className="absolute -bottom-12 bg-slate-800 p-2 rounded shadow z-20 flex gap-1">
                  {["👍", "❤️", "😂", "🔥", "😮", "😢"].map((emoji) => (
                    <span
                      key={emoji}
                      className="cursor-pointer text-xl"
                      onClick={() => {
                        toggleReaction(msg.id, emoji);
                        setReactionMenuFor(null);
                      }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
        <div ref={messagesEnd} />
      </main>

      <footer className="p-4 border-t border-gray-700 relative">
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
            onClick={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="px-4 bg-purple-600 rounded hover:bg-purple-700"
          >
            Send
          </button>
        </div>
        {showEmojiPicker && (
          <div className="absolute bottom-24 z-10">
            <Picker onEmojiClick={onEmojiClick} theme="dark" />
          </div>
        )}
      </footer>

      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
          onClick={() => setFullscreenImage(null)}
        >
          <img
            src={fullscreenImage}
            alt="Fullscreen"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default ChatPage;
