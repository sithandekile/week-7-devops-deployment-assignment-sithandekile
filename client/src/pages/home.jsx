import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className='mt-30 text-center bg-orange-200'>
    <h1>Welcome to Socket.io Chat App</h1>
    <p>Real-time messaging, rooms, private chat, and more!</p>
    <Link to="/rooms">
      <button>Join a Room</button>
    </Link>
  </div>
);

export default Home;