import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserListItem";
import axios from 'axios';
import "../../styles/SideDrawer.css"
import { getSender } from "../../config/ChatLogics";
import ProfileModel from "./ProfileModel";
import shushing from "../../assets/shushing.webp"

function SideDrawer() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if(!search){
        toast.error("Cannot search empty value");
    }
    try {
        setLoading(true)

        const config = {
            headers:{
                Authorization:`Bearer ${user.token}`,
            },
        };

        const {data} = await axios.get(`/api/user?search=${search}`,config)
    
        setLoading(false)
        setSearchResult(data);
    } catch (error) {
  setLoading(false);

  console.log(error);
  console.log(error.response);
  console.log(error.response?.data);

  toast.error(error.response?.data?.message || "Error Occurred");    }
  }

  const accessChat = async (userId) => {
    try {
        setLoading(true);

        const config = {
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${user.token}`,
            },
        };

        const {data} = await axios.post("/api/chat",{userId},config);

        if (!chats.find((c) => c._id === data._id)){
            setChats([data,...chats]);
        }
        setSelectedChat(data);
        setLoadingChat(false);
        setIsOpen(false);
    } catch (error) {
console.log(error);
  console.log(error.response);
  console.log(error.response?.data);

  toast.error(error.response?.data?.message || "Error Occurred");        }
  };

  return (
    <div>
      <div className="side-cont">
        <button
          className="search"
          onClick={() => setIsOpen(!isOpen)}
        >
          🔍 Search
        </button>
        <div className="app-logo">
        <img src={shushing} alt="Logo" className="logo-img" />
        <h2 className="drawer-title">Usshhh!</h2>
        
        </div>
<div className="header-right">
<div className="menu">
  <button
    onClick={() => setOpen(!open)}
    className="notification-btn"
  >
    🔔

    {notification.length > 0 && (
      <span className="badge">
        {notification.length}
      </span>
    )}
  </button>  {open && (
    <div className="dropdown">
      {notification.length === 0
        ? (
          <div className="no-notification">
              No New Messages
          </div>
          ) : notification.map(notify => (
            <div key={notify._id} className="notification-item" onClick={() => {
              setSelectedChat(notify.chat)
              setNotification(notification.filter((n) => n !== notify));
            }}>
              {notify.chat.isGroupChat ? `New Message in ${notify.chat.chatName}`
               : `New Message from ${getSender(user, notify.chat.users)}`}
            </div>
          ))}
    </div>
  )}
</div>

        <div className="profile">
          <ProfileModel user={user}>
            <div className="profile-btn">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </ProfileModel>
          <button onClick={logoutHandler}>Logout</button>
        </div>
        </div>
      </div>

      <div className={`search-user ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="search-header">
          <h3 className="search-title">Search Users</h3>
          <button
            className="overlay"
            onClick={() => setIsOpen(false)}>
            ✖
          </button>
        </div>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"

        />

      <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
        {loading? (
            <ChatLoading/>
        ): (
          
            <div className="results-title">
              Results
            </div>
        )}

        <div className="search-results">
          {searchResult?.map((user) => (
            <UserListItem key={user._id} user={user} handleFunction={()=>accessChat(user._id)}>{user.name}</UserListItem>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SideDrawer;