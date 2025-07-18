import React, { useEffect, useState, useContext } from 'react';
import { getAllRooms, createRoom } from '../service/api';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const { username } = useContext(UserContext);

  useEffect(() => {
    getAllRooms().then(res => setRooms(res.data));
  }, []);

  const handleCreateRoom = async () => {
    if (roomName) {
      await createRoom(roomName);
      const res = await getAllRooms();
      setRooms(res.data);
      setRoomName('');
    }
  };

  return (
    <div className="p-32">
      <h2>Chat Rooms</h2>
      <ul>
        {rooms.map(room => (
          <li key={room._id}>
            <Link to={`/chat/${room._id}`}>{room.name}</Link>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={roomName}
        onChange={e => setRoomName(e.target.value)}
        placeholder="New room name"
      />
      <button onClick={handleCreateRoom}>Create Room</button>
      <div>
        <p>Logged in as: <strong>{username}</strong></p>
      </div>
    </div>
  );
};

export default Rooms;