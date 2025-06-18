// --- server.js ---
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

const messages = []; // In-memory message store

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username) => {
    socket.username = username;
    console.log(username, 'joined chat');

    // ✅ Send full chat history on join
    socket.emit('chatHistory', messages);
  });

  socket.on('sendMessage', (data) => {
    const newMessage = {
      id: uuidv4(),
      author: data.author,
      text: data.text,
      image: data.image || null,
      reactions: {},
    };
    messages.push(newMessage);
    io.emit('chatMessage', newMessage);
  });

  socket.on('reactToMessage', ({ msgId, emoji, user }) => {
    const msg = messages.find((m) => m.id === msgId);
    if (!msg) return;

    if (!msg.reactions[emoji]) {
      msg.reactions[emoji] = [user];
    } else {
      const index = msg.reactions[emoji].indexOf(user);
      if (index > -1) {
        msg.reactions[emoji].splice(index, 1);
        if (msg.reactions[emoji].length === 0) {
          delete msg.reactions[emoji];
        }
      } else {
        msg.reactions[emoji].push(user);
      }
    }

    io.emit('updateReactions', { id: msg.id, reactions: msg.reactions });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.username);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`✅ Chat server running on port ${PORT}`));
