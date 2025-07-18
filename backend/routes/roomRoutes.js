const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Create room
router.post('/', async (req, res) => {
  try {
    const room = await roomController.createRoom(req.body.name, req.body.isPrivate);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});

router.get('/', async (req, res) => {
  try {
    const rooms = await roomController.getAllRooms();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get rooms' });
  }
});

router.put('/:roomId/add', async (req, res) => {
  try {
    const room = await roomController.addUserToRoom(req.params.roomId, req.body.userId);
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user to room' });
  }
});

router.put('/:roomId/remove', async (req, res) => {
  try {
    const room = await roomController.removeUserFromRoom(req.params.roomId, req.body.userId);
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove user from room' });
  }
});

module.exports = router;