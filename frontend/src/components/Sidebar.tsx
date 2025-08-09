import React from 'react';

const users = [
  { id: 1, username: 'Alice', avatar: '/default-avatar.png' },
  { id: 2, username: 'Bob', avatar: '/default-avatar.png' },
  { id: 3, username: 'Charlie', avatar: '/default-avatar.png' },
];

export default function Sidebar({ onSelectUser }) {
  return (
    <div
      style={{
        width: 250,
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: 20,
        boxSizing: 'border-box',
        borderRight: '1px solid #ddd',
        overflowY: 'auto',
      }}
    >
      <h2>Contacts</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map((user) => (
          <li
            key={user.id}
            style={{ display: 'flex', alignItems: 'center', marginBottom: 12, cursor: 'pointer' }}
            onClick={() => onSelectUser(user)}
          >
            <img
              src={user.avatar}
              alt={user.username}
              style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 10 }}
            />
            <span>{user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
