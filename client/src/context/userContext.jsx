import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({
  username: '',
  setUsername: () => {},
});

export const UserProvider = ({ children }) => {
  const [username, setUsernameState] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('username');
    if (stored) setUsernameState(stored);
  }, []);

  const setUsername = (name) => {
    localStorage.setItem('username', name);
    setUsernameState(name);
  };

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};
