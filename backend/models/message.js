const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: { type: String },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  timestamp: { type: Date, default: Date.now },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // For read receipts
  reactions: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String } // e.g., 'like', 'love', etc.
  }],
  fileUrl: { type: String }, // For file/image sharing
});

module.exports = mongoose.model('Message', MessageSchema);
