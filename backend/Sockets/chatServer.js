const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });
const chatSocket = require('./ChatSocket');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected for Chat"))
.catch((err) => console.log("❌ MongoDB Error:", err));

// Initialize Chat Sockets
chatSocket(io);

// Start Server
const PORT = process.env.CHAT_PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Chat server running on port ${PORT}`);
});
