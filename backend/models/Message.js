const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  text: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: null
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  reactions: {
    type: Map,
    of: [String], // Example: { '👍': ['user1', 'user2'] }
    default: () => new Map()  // ✅ ensures a fresh Map instance for each document
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
