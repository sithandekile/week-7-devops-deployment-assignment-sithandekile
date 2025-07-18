import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const Login = () => {
  const [input, setInput] = useState('');
  const { setUsername } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (input.trim()) {
      setUsername(input.trim());
      navigate('/rooms');
    }
  };

  return (
    <div className="text-center mt-30">
      <h2>Enter your username</h2>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Username"
      />
      <button onClick={handleLogin}>Join</button>
    </div>
  );
};

export default Login;