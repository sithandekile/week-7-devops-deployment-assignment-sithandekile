const Message = require('../models/message');
const User = require('../models/user');

exports.createMessage = async (data) => {
  try {
    let senderId = data.sender;

    // Converting the username to ObjectId if needed
    if (typeof senderId === 'string' && senderId.length < 24) {
      let user = await User.findOne({ username: senderId });

      // if the user not found lets create it automatically
      if (!user) {
        console.warn(`User "${senderId}" not found — creating new user.`);
        user = await User.create({ username: senderId });
      }

      senderId = user._id;
    }

    // Create and save message
    const message = new Message({
      ...data,
      sender: senderId,
    });

    return await message.save();
  } catch (error) {
    console.error("createMessage error:", error);
    throw error;
  }
};

exports.getMessagesByRoom = async (roomId) => {
  try {
    return await Message.find({ room: roomId })
      .populate('sender','username')
      .sort({ timestamp: 1 });
  } catch (error) {
    console.error("getMessagesByRoom error:", error);
    throw error;
  }
};

exports.markAsRead = async (messageId, userId) => {
  try {
    return await Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { readBy: userId } },
      { new: true }
    );
  } catch (error) {
    console.error("markAsRead error:", error);
    throw error;
  }
};

exports.addReaction = async (messageId, reaction) => {
  try {
    return await Message.findByIdAndUpdate(
      messageId,
      { $push: { reactions: reaction } },
      { new: true }
    );
  } catch (error) {
    console.error("addReaction error:", error);
    throw error;
  }
};
