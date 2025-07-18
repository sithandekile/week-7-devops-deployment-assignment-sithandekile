const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Create a new message
router.post('/', async (req, res) => {
  try {
    const message = await messageController.createMessage(req.body);
    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error.message);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// Get messages by room
router.get('/room/:roomId', async (req, res) => {
  try {
    const messages = await messageController.getMessagesByRoom(req.params.roomId);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Mark message as read
router.put('/:messageId/read', async (req, res) => {
  try {
    const message = await messageController.markAsRead(req.params.messageId, req.body.userId);
    res.status(200).json(message);
  } catch (error) {
    console.error("Error marking message as read:", error.message);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

// Add reaction to message
router.put('/:messageId/reaction', async (req, res) => {
  try {
    const message = await messageController.addReaction(req.params.messageId, req.body.reaction);
    res.status(200).json(message);
  } catch (error) {
    console.error("Error adding reaction:", error.message);
    res.status(500).json({ error: 'Failed to add reaction' });
  }
});

module.exports = router;