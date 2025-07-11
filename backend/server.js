const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const chatSocket = require('./Sockets/ChatSocket');

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Allowed origins for both frontend (Vite) and domain
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://crackit.qwerty-sdmcet.com',
];

// ✅ Express CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ✅ Socket.IO server with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ✅ Attach chat handlers
chatSocket(io);

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/quiz', quizRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('🚀 Multi-Tenant Quiz API is live');
});

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
