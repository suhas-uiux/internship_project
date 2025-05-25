const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth'); // ✅ Import your route file
const taskRoutes = require('./routes/task');
const cors = require("cors");


dotenv.config();

const app = express();
// ✅ Allow requests from frontend origin
app.use(cors({
  origin: "http://localhost:5173",  // Your frontend URL
  credentials: true,                // Allow cookies if needed
}));

// Middleware
app.use(express.json()); // ✅ Required for parsing JSON request bodies
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', taskRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// ✅ Mount Routes
app.use('/api/auth', authRoutes); // ✅ Mount auth routes under /api/auth

// Test Route
app.get('/', (req, res) => {
  res.send('🚀 Multi-Tenant Task Manager API is live');
});

// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

