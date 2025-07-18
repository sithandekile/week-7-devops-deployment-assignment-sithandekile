const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  online: { type: Boolean, default: false },
  avatar: { type: String },
  lastSeen: { type: Date,default: Date.now  },
});

module.exports = mongoose.model('User', UserSchema);