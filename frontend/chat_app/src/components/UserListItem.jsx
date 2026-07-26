import React from 'react'
import { ChatState } from '../Context/ChatProvider'

import "../styles/UserListItem.css";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div className="user-list-item" onClick={handleFunction}>
      <div className="user-avatar">
        {user.name.charAt(0).toUpperCase()}
      </div>

      <div className="user-details">
        <h4>{user.name}</h4>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

export default UserListItem