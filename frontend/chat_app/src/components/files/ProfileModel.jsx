import React, { useState } from "react";
import "../../styles/ProfileModal.css";

function ProfileModel({ user, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {children ? (
        <span onClick={() => setIsOpen(true)}>
          {children}
        </span>
      ) : (
        <button onClick={() => setIsOpen(true)}>
          Profile
        </button>
      )}

      {isOpen && (
        <div
          className="profile-modal-overlay"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="profile-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>

            <div className="profile-content">

              <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <h2>{user?.name}</h2>

              <p>{user?.email}</p>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileModel;