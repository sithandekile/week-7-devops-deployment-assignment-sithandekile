const User = require('../models/user');
const Message = require('../models/message');

const users = {};
const typingUsers = {};

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`); // 👈 React: <FaPlug />

    // User joins the chat
    socket.on('user_join', async (username) => {
      try {
        users[socket.id] = { username, id: socket.id };

        let user = await User.findOne({ username });
        if (!user) {
          user = await User.create({ username });
          console.log(`Created user: ${username}`); 
        }

        io.emit('user_list', Object.values(users));
        io.emit('user_joined', { username, id: socket.id }); 
        console.log(` ${username} joined`); 
      } catch (err) {
        console.error('Error on user_join:', err.message); //
      }
    });

    // Handling  public messages
    socket.on('send_message', async (messageData) => {
      try {
        const senderUsername = users[socket.id]?.username || 'Anonymous';
        const user = await User.findOne({ username: senderUsername });

        if (!user) {
          console.warn(`Sender ${senderUsername} not found in DB`); 
          return;
        }

        const message = await Message.create({
          sender: user._id,
          room: messageData.room,
          content: messageData.content,
          timestamp: new Date(),
        });

        const populatedMessage = await Message.findById(message._id).populate('sender');

        io.to(messageData.room).emit('receive_message', populatedMessage); 
      } catch (err) {
        console.error('Error sending message:', err.message);
      }
    });

    // Join room 
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`${socket.id} joined room: ${roomId}`); // 👈 React: <FaLock />
    });

    // Typing indicator
    socket.on('typing', (isTyping) => {
      const username = users[socket.id]?.username;
      if (!username) return;

      if (isTyping) typingUsers[socket.id] = username;
      else delete typingUsers[socket.id];

      io.emit('typing_users', Object.values(typingUsers)); 
    });

    //  Private message
    socket.on('private_message', ({ to, message }) => {
      const messageData = {
        id: Date.now(),
        sender: users[socket.id]?.username || 'Anonymous',
        senderId: socket.id,
        message,
        timestamp: new Date().toISOString(),
        isPrivate: true,
      };

      socket.to(to).emit('private_message', messageData); 
      socket.emit('private_message', messageData); 
    });

    // Read receipts (advanced feature)
    socket.on('message_read', ({ messageId, readerId }) => {
      io.emit('message_read', { messageId, readerId });
    });

    // Reactions (advanced feature)
    socket.on('add_reaction', async ({ messageId, emoji }) => {
      try {
        io.emit('message_reaction', {
          messageId,
          emoji,
          user: users[socket.id]?.username,
        }); 
      } catch (err) {
        console.error('Error adding reaction:', err.message);
      }
    });

    // File sharing (advanced feature)
    socket.on('file_upload', ({ room, fileData }) => {
      io.to(room).emit('receive_file', {
        sender: users[socket.id]?.username || 'Anonymous',
        file: fileData,
        timestamp: new Date().toISOString(),
      }); 
    });

    // Disconnection
    socket.on('disconnect', () => {
      const username = users[socket.id]?.username;
      if (username) {
        io.emit('user_left', { username, id: socket.id }); 
        console.log(`${username} left`);
      }

      delete users[socket.id];
      delete typingUsers[socket.id];

      io.emit('user_list', Object.values(users));
      io.emit('typing_users', Object.values(typingUsers));
    });
  });
};

module.exports = socketHandler;
