const User = require('../models/user');


exports.createUser = async (data) => {
  return await User.create(data);
};
exports.getUserByUsername = async (username) => {
  return await User.findOne({ username });
};

exports.updateAvatar = async (username, avatarUrl) => {
  return await User.findOneAndUpdate(
    { username },
    { avatar: avatarUrl },
    { new: true }
  );
};

exports.updateLastSeen = async (username) => {
  return await User.findOneAndUpdate(
    { username },
    { lastSeen: new Date() },
    { new: true }
  );
};

exports.getAllUsers = async () => {
  return await User.find().select('username online avatar lastSeen');
};