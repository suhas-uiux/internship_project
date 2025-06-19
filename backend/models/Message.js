const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  author: String,
  text: String,
  image: String,
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  reactions: {
    type: Map,
    of: [String],
    default: {}
  },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
