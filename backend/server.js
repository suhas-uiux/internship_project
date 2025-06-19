const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const chatSocket = require('./Sockets/ChatSocket'); // ⬅️ Import socket logic

dotenv.config();

const app = express();
const server = http.createServer(app); // ⬅️ Create raw HTTP server

// ✅ Create Socket.IO server and attach to HTTP server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// ✅ Socket.IO setup
chatSocket(io); // ⬅️ Call your chat socket handler

// ✅ CORS & JSON middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/quiz', quizRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('🚀 Multi-Tenant Quiz API is live');
});

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// ✅ Start the server using the HTTP server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
