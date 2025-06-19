const Message = require('./models/Message');

function chatSocket(io) {
  io.on('connection', (socket) => {
    console.log('🟢 Connected:', socket.id);

    socket.on('join', async (username) => {
      socket.username = username;

      const allMessages = await Message.find()
        .sort({ createdAt: 1 })
        .populate('replyTo', 'author text')
        .lean();

      const formatted = allMessages.map(m => ({
        id: m._id.toString(),
        author: m.author,
        text: m.text,
        image: m.image,
        createdAt: m.createdAt,
        reactions: Object.fromEntries(m.reactions || []),
        repliedToMessage: m.replyTo
          ? { id: m.replyTo._id.toString(), author: m.replyTo.author, text: m.replyTo.text }
          : null
      }));

      socket.emit('chatHistory', formatted);
    });

    socket.on('sendMessage', async (data) => {
      const newMsg = new Message({
        author: data.author,
        text: data.text,
        image: data.image || null,
        replyTo: data.replyTo || null,
      });

      await newMsg.save();
      await newMsg.populate('replyTo', 'author text');

      const saved = newMsg.toObject();
      saved.id = saved._id.toString();
      saved.reactions = Object.fromEntries(newMsg.reactions || []);
      saved.repliedToMessage = newMsg.replyTo
        ? { id: newMsg.replyTo._id.toString(), author: newMsg.replyTo.author, text: newMsg.replyTo.text }
        : null;

      io.emit('chatMessage', saved);
    });

    socket.on('deleteMessage', async (msgId) => {
      await Message.findByIdAndDelete(msgId);
      io.emit('messageDeleted', msgId);
    });

    socket.on('reactToMessage', async ({ msgId, emoji, user }) => {
      const msg = await Message.findById(msgId);
      if (!msg) return;

      const users = msg.reactions.get(emoji) || [];
      const idx = users.indexOf(user);
      if (idx !== -1) {
        users.splice(idx, 1);
        users.length ? msg.reactions.set(emoji, users) : msg.reactions.delete(emoji);
      } else {
        msg.reactions.set(emoji, [...users, user]);
      }

      await msg.save();

      io.emit('updateReactions', {
        id: msg._id.toString(),
        reactions: Object.fromEntries(msg.reactions)
      });
    });
  });
}

module.exports = chatSocket;
