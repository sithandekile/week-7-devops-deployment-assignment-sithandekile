const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { username, online, avatar, lastSeen } = req.body;
    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'Username is required' });
    }
    const user = await userController.createUser({ username, online, avatar, lastSeen });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await userController.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get user by username
router.get('/:username', async (req, res) => {
  try {
    const user = await userController.getUserByUsername(req.params.username);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update avatar
router.put('/:username/avatar', async (req, res) => {
  try {
    const user = await userController.updateAvatar(req.params.username, req.body.avatar);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update avatar' });
  }
});

// Update last seen
router.put('/:username/lastseen', async (req, res) => {
  try {
    const user = await userController.updateLastSeen(req.params.username);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update last seen' });
  }
});

module.exports = router;