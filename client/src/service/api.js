import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// User endpoints
export const getAllUsers = () => axios.get(`${API_URL}/users`);
export const getUserByUsername = (username) => axios.get(`${API_URL}/users/${username}`);
export const updateAvatar = (username, avatar) =>
  axios.put(`${API_URL}/users/${username}/avatar`, { avatar });
export const updateLastSeen = (username) =>
  axios.put(`${API_URL}/users/${username}/lastseen`);

// Room endpoints
export const getAllRooms = () => axios.get(`${API_URL}/rooms`);
export const createRoom = (name, isPrivate = false) =>
  axios.post(`${API_URL}/rooms`, { name, isPrivate });
export const addUserToRoom = (roomId, userId) =>
  axios.put(`${API_URL}/rooms/${roomId}/add`, { userId });
export const removeUserFromRoom = (roomId, userId) =>
  axios.put(`${API_URL}/rooms/${roomId}/remove`, { userId });

// Message endpoints
export const getMessagesByRoom = (roomId) =>
  axios.get(`${API_URL}/messages/room/${roomId}`);
export const createMessage = (data) =>
  axios.post(`${API_URL}/messages`, data);
export const markMessageAsRead = (messageId, userId) =>
  axios.put(`${API_URL}/messages/${messageId}/read`, { userId });
export const addReaction = (messageId, reaction) =>
  axios.put(`${API_URL}/messages/${messageId}/reaction`, { reaction });

export default {
  getAllUsers,
  getUserByUsername,
  updateAvatar,
  updateLastSeen,
  getAllRooms,
  createRoom,
  addUserToRoom,
  removeUserFromRoom,
  getMessagesByRoom,
  createMessage,
  markMessageAsRead,
  addReaction,
};