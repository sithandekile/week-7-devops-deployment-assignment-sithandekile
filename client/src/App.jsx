import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/userContext';

import Login from './pages/login';
import Home from './pages/home';
import Rooms from './pages/rooms';
import Chat from './pages/chat';

const App = () => (
  <UserProvider>
    <Router>
      <div className="min-h-screen bg-sky-200 flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/chat/:roomId" element={<Chat />} />
          </Routes>
        </main>
      </div>
    </Router>
  </UserProvider>
);

export default App;
