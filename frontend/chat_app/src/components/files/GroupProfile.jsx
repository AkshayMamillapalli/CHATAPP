import React, { useState } from "react";
import "../../styles/GroupProfile.css";

function GroupProfile({ group, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {children ? (
        <span onClick={() => setIsOpen(true)}>
          {children}
        </span>
      ) : (
        <button onClick={() => setIsOpen(true)}>
          Group Info
        </button>
      )}

      {isOpen && (
        <div
          className="group-overlay"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="group-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>

            <div className="group-content">

              <div className="group-avatar">
                {group.chatName.charAt(0).toUpperCase()}
              </div>

              <h2>{group.chatName}</h2>

              <p className="member-count">
                {group.users.length} Members
              </p>

              <div className="members-list">
                <h4>Members</h4>

                {group.users.map((member) => (
                  <div
                    key={member._id}
                    className="member-item"
                  >
                    <div className="member-avatar">
                      {member.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="member-details">
                      <span>{member.name}</span>
                      <small>{member.email}</small>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GroupProfile;