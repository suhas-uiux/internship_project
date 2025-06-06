const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {           // changed from email to username
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {           // renamed from name to fullName for clarity
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  semesterCompleted: {
    type: Number,
    required: true,
    min: 1,
    max: 8,            // assuming max 8 semesters in engineering
  },
  resume: {
    type: String,      // store resume file URL or path, optional
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
