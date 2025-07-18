const Room = require('../models/rooms');

exports.createRoom = async (name, isPrivate = false) => {
  const room = new Room({ name, isPrivate });
  return await room.save();
};

exports.getAllRooms = async () => {
  return await Room.find().populate('members');
};

exports.addUserToRoom = async (roomId, userId) => {
  return await Room.findByIdAndUpdate(
    roomId,
    { $addToSet: { members: userId } },
    { new: true }
  );
};

exports.removeUserFromRoom = async (roomId, userId) => {
  return await Room.findByIdAndUpdate(
    roomId,
    { $pull: { members: userId } },
    { new: true }
  );
};