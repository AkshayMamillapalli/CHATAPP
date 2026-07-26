import React from 'react'
import "../styles/UserBadgeItem.css";


function UserBadgeItem({user, handleFunction}) {
  return (
    <div className="user-badge" onClick={handleFunction}>
       <span>{user.name}</span>
        <button className='remove-btn'>❌</button>
    </div>
  );
}

export default UserBadgeItem