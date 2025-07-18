import React from 'react';

const UserList = ({ users }) => (
  <div>
    <h3>Online Users</h3>
    <ul>
      {users.map(user => (
        <li key={user._id || user.username}>
          {user.username} {user.online ? '🟢' : '⚪'}
        </li>
      ))}
    </ul>
  </div>
);

export default UserList;