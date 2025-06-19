import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';

const socket = io(import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:5000', {
  transports: ['websocket'],
  autoConnect: true,
});

export default function ChatPage() {
  const username = localStorage.getItem('username') || 'Anonymous';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [reactionDrawerId, setReactionDrawerId] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEnd = useRef(null);

  // Handle socket connections and events
  useEffect(() => {
    const onConnect = () => {
      socket.emit('join', username);
    };

    socket.on('connect', onConnect);
    socket.on('chatHistory', setMessages);
    socket.on('chatMessage', msg => setMessages(prev => [...prev, msg]));
    socket.on('messageDeleted', id => setMessages(prev => prev.filter(m => m.id !== id)));
    socket.on('updateReactions', ({ id, reactions }) =>
      setMessages(prev => prev.map(m => (m.id === id ? { ...m, reactions } : m)))
    );

    return () => {
      socket.off('connect', onConnect);
      socket.off('chatHistory');
      socket.off('chatMessage');
      socket.off('messageDeleted');
      socket.off('updateReactions');
    };
  }, [username]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending messages (text, image, reply)
  const sendMsg = () => {
    if (!input.trim() && !imagePreview) return;
    socket.emit('sendMessage', {
      author: username,
      text: input,
      image: imagePreview || null,
      replyTo: replyTo?.id || null,
    });
    setInput('');
    setReplyTo(null);
    setImagePreview(null);
  };

  // Option handlers
  const deleteMsg = id => socket.emit('deleteMessage', id);
  const toggleReaction = (id, emoji) => {
    socket.emit('reactToMessage', { msgId: id, emoji, user: username });
    setReactionDrawerId(null);
  };

  // Image file selection & preview
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="p-4 bg-gray-800 text-xl">Chat Room</header>

      {/* Chat messages list */}
      <main className="flex-grow overflow-auto p-4 space-y-2">
        {messages.map(msg => {
          const isOwn = msg.author === username;
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`p-3 rounded-lg max-w-md relative ${isOwn ? 'bg-green-600 rounded-tr-none' : 'bg-gray-700 rounded-tl-none'}`}>
                {msg.repliedToMessage && (
                  <div className="text-xs italic border-l-4 border-gray-500 pl-2 mb-1">
                    Reply to <strong>{msg.repliedToMessage.author}:</strong> {msg.repliedToMessage.text}
                  </div>
                )}

                <div className="font-semibold">{msg.author}</div>
                <div>{msg.text}</div>

                {msg.image && (
                  <img
                    src={msg.image}
                    alt="attachment"
                    className="mt-2 max-w-xs rounded cursor-pointer"
                    onClick={() => window.open(msg.image, '_blank')}
                  />
                )}

                <div className="mt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    {msg.reactions && Object.entries(msg.reactions).map(([e, users]) => (
                      <button
                        key={e}
                        className="bg-black/30 px-2 py-1 rounded"
                        onClick={() => toggleReaction(msg.id, e)}
                      >
                        {e} {users.length}
                      </button>
                    ))}
                    <button onClick={() => setReactionDrawerId(reactionDrawerId === msg.id ? null : msg.id)}>React</button>
                    <button onClick={() => setReplyTo(msg)}>Reply</button>
                    {isOwn && <button className="text-red-400" onClick={() => deleteMsg(msg.id)}>Delete</button>}
                  </div>
                  <div>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>

                {reactionDrawerId === msg.id && (
                  <div className="absolute bottom-full mb-2 bg-gray-800 p-2 rounded flex space-x-2">
                    {["👍", "❤️", "😂", "🔥", "😮", "😢"].map(e => (
                      <span
                        key={e}
                        className="text-xl cursor-pointer"
                        onClick={() => toggleReaction(msg.id, e)}
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        <div ref={messagesEnd} />
      </main>

      {/* Image preview + cancel button */}
      {imagePreview && (
        <div className="p-4 flex items-center bg-gray-800">
          <img src={imagePreview} alt="preview" className="w-32 h-32 object-cover rounded" />
          <button className="ml-4 text-red-400" onClick={() => setImagePreview(null)}>Remove</button>
        </div>
      )}

      {/* Reply info bar */}
      {replyTo && (
        <div className="bg-gray-700 p-2 flex justify-between items-center">
          Replying to <strong>{replyTo.author}</strong>: {replyTo.text}
          <button className="ml-2" onClick={() => setReplyTo(null)}>Cancel</button>
        </div>
      )}

      {/* Input toolbar */}
      <footer className="p-4 flex items-center bg-gray-800 space-x-2">
        <button onClick={() => fileInputRef.current.click()} className="px-3 py-2 bg-gray-700 rounded-full">📎</button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />

        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMsg()}
          placeholder="Type a message…"
          className="flex-grow p-2 rounded-full bg-gray-700"
        />

        <button onClick={sendMsg} className="px-4 py-2 bg-blue-500 rounded-full">Send</button>
      </footer>
    </div>
  );
}
