const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');

 // ✅ Import quiz route

dotenv.config();

const app = express();

// ✅ Allow requests from frontend origin
app.use(cors({
  origin: "http://localhost:5173",  // Your frontend URL
  credentials: true,                // Allow cookies if needed
}));

// ✅ Middleware
app.use(express.json());

// ✅ Mount Routes
app.use('/api/auth', authRoutes);
app.use('/quiz', quizRoutes);// ✅ Add this line to mount quiz route

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.log('❌ MongoDB Error:', err));

// ✅ Test Route
app.get('/', (req, res) => {
  res.send('🚀 Multi-Tenant Quiz API is live');
});

// ✅ Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
