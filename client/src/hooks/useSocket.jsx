import { useEffect, useState } from 'react';
import socket from '../socket/socket';

export const useSocket = (username) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (username) {
      socket.emit('user_join', username);
    }
    socket.on('user_list', setUsers);
    socket.on('receive_message', msg => setMessages(prev => [...prev, msg]));
    socket.on('typing_users', setTypingUsers);

    return () => {
      socket.off('user_list');
      socket.off('receive_message');
      socket.off('typing_users');
    };
  }, [username]);

  return { users, messages, typingUsers, socket };
};