import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import UserList from '../components/userList'
import { getMessagesByRoom, createMessage, addReaction } from '../service/api';
import { useSocket } from '../hooks/useSocket';
import { UserContext } from '../context/userContext';
import { FaSmile, FaPaperPlane, FaThumbsUp, FaLaughSquint, FaHeart } from 'react-icons/fa';

const Chat = () => {
  const { roomId } = useParams();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { username } = useContext(UserContext);
  const { socket, typingUsers } = useSocket(username);

  useEffect(() => {
    getMessagesByRoom(roomId).then(res => setMessages(res.data));
    socket.emit('join_room', roomId);

    const handleReceive = (msg) => {
      if (msg.room === roomId && !msg.isPrivate) {
        setMessages(prev => [...prev, msg]);
      }
    };

    const handlePrivate = (msg) => {
      setMessages(prev => [...prev, msg]);
    };

    const handleUserList = (users) => {
      const filtered = users.filter(u => u.username !== username);
      setOnlineUsers(filtered);
    };

    socket.on('receive_message', handleReceive);
    socket.on('private_message', handlePrivate);
    socket.on('user_list', handleUserList);

    return () => {
      socket.off('receive_message', handleReceive);
      socket.off('private_message', handlePrivate);
      socket.off('user_list', handleUserList);
      socket.emit('leave_room', roomId);
    };
  }, [roomId, socket, username]);

  const handleSend = async () => {
    if (input.trim()) {
      const savedMsg = await createMessage({
        content: input,
        room: roomId,
        sender: username,
        timestamp: new Date().toISOString(),
      });

      if (recipient) {
        socket.emit('private_message', {
          toUsername: recipient,
          message: savedMsg.content,
        });
      } else {
        socket.emit('send_message', savedMsg);
      }

      setInput('');
      setShowEmoji(false);
      socket.emit('typing', false);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setInput(prev => prev + emojiData.emoji);
  };

  const handleReaction = async (messageId, emoji) => {
    const updated = await addReaction(messageId, { emoji });
    setMessages(prev =>
      prev.map(msg => (msg._id === updated._id ? updated : msg))
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Chat Room: {roomId}</h2>

      <UserList users={onlineUsers} /> 

      {/* Select private user */}
      <div className="mb-4">
        <label className="font-medium mr-2">Private message to:</label>
        <select
          value={recipient || ''}
          onChange={e => setRecipient(e.target.value || null)}
          className="border rounded px-2 py-1"
        >
          <option value="">Public Message</option>
          {onlineUsers.map((u) => (
            <option key={u.id} value={u.username}>
              {u.username}
            </option>
          ))}
        </select>
      </div>

      {/* Chat Box */}
      <div className="h-96 overflow-y-auto bg-blue-950 rounded-lg p-4 border mb-4 space-y-3">
        {messages.map((msg, idx) => {
          const isMine = msg.sender?.username === username || msg.sender === username;
          return (
            <div
              key={idx}
              className={`p-3 rounded shadow text-sm ${
                msg.isPrivate
                  ? 'bg-yellow-100 border border-yellow-300'
                  : isMine
                  ? 'bg-green-100 border border-green-400'
                  : 'bg-white border'
              }`}
            >
              <p className="font-semibold text-gray-800">
                {msg.sender?.username || msg.sender || 'Anonymous'}
              </p>
              <p className="text-gray-700">{msg.content || msg.message}</p>
              <div className="text-xs text-gray-500 flex bg-#f1f1f1 justify-between mt-1">
                <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                {msg.isPrivate && <span className="italic text-yellow-700">Private</span>}
              </div>
              {/* Reactions */}
              <div className="mt-1 flex gap-2 items-center text-lg">
                {msg.reactions?.map((reactn, i) => (
                  <span key={i}>{reactn.emoji}</span>
                ))}
                <button onClick={() => handleReaction(msg._id, '👍')}>
                  <FaThumbsUp />
                </button>
                <button onClick={() => handleReaction(msg._id, '😂')}>
                  <FaLaughSquint />
                </button>
                <button onClick={() => handleReaction(msg._id, '❤️')}>
                  <FaHeart />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-40 z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={e => {
            setInput(e.target.value);
            socket.emit('typing', true);
          }}
          onBlur={() => socket.emit('typing', false)}
          placeholder="Type a message..."
          className="flex-grow px-3 py-2 border rounded-md"
        />
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className="bg-orange-200 px-3 py-2 rounded-md"
        >
          <FaSmile />
        </button>
        <button
          onClick={handleSend}
          className="bg-orange-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaPaperPlane />
          Send
        </button>
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="mt-2 text-sm italic text-gray-500">
          {typingUsers.join(', ')} typing...
        </div>
      )}
    </div>
  );
};

export default Chat;
