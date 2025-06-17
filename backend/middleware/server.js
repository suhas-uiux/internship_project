// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username) => {
    socket.username = username;
    console.log(username, 'joined chat');
  });

  socket.on('sendMessage', (data) => {
    io.emit('chatMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.username);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`✅ Chat server running on port ${PORT}`));
