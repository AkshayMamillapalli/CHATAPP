import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModel from './files/ProfileModel';
import UpdateGroupChatModal from './files/UpdateGroupChatModal';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import "../styles/SingleChat.css"
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";
import Lottie from "lottie-react";
import animationData from "../animations/typing.json";
import GroupProfile from './files/GroupProfile';

const ENDPOINT = "http://localhost:3000";
var socket, selectedChatCompare;

function SingleChat({fetchAgain, setFetchAgain}) {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    const {user,selectedChat,setSelectedChat, notification, setNotification, highlightedMessage, setHighlightedMessage} = ChatState();

    const [socketConnected, setSocketConnected] = useState(false);
    
    const [typing,setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    
    const fetchMessages = async () => {
        if(!selectedChat) return;

        try {
            const config = {
            headers:{
                Authorization:`Bearer ${user.token}`,
            },
        };

        setLoading(true);
        const {data} = await axios.get(`/api/message/${selectedChat._id}`,config);

        setMessages(data);
        setLoading(false);

        socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast.error("Error Occured");
        }
    }

    const handleSearch = async (value) => {
    setSearchText(value);

    if (!value.trim()) {
        setSearchResults([]);
        return;
    }

    try {
        setSearchLoading(true);

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        const { data } = await axios.get(
            `/api/message/search/${selectedChat._id}?query=${value}`,
            config
        );

        setSearchResults(data);
        setSearchLoading(false);

    } catch (error) {
        toast.error("Search failed");
        setSearchLoading(false);
    }
};
const handleSearchResultClick = (message) => {
    setHighlightedMessage(message._id);

    setSearchOpen(false);
    setSearchText("");
    setSearchResults([]);
};

    useEffect(() => {
        socket = io(ENDPOINT); 
        socket.emit("setup",user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing",() => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;

    }, [selectedChat]);


useEffect(() => {
    const handleMessage = (newMessageReceived) => {
        if (
            !selectedChatCompare ||
            selectedChatCompare._id !== newMessageReceived.chat._id
        ) {
            if (!notification.includes(newMessageReceived)) {
                setNotification((prev) => [newMessageReceived, ...prev]);
                setFetchAgain((prev) => !prev);
            }
        } else {
            setMessages((prev) => [...prev, newMessageReceived]);
        }
    };

    socket.on("message recieved", handleMessage);

    return () => socket.off("message recieved", handleMessage);
}, [notification]);
    const sendMessage = async (e) => {

        if(e.key==="Enter" && newMessage){
            e.preventDefault();
            socket.emit("stop typing", selectedChat._id);
            try {
            const config = {
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${user.token}`,
            },
        };
    setNewMessage("");

        const {data} = await axios.post(`/api/message`,{
            content: newMessage,
            chatId: selectedChat._id,
        },
        config
    );


    socket.emit("new message", data);
    setMessages((prev) => [...prev, data]);
            } catch (error) {
                toast.error("Error Occured");
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;

        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if(timeDiff >= timerLength && typing){
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };
  return (
    <div className='single-chat'>
        {
            selectedChat ? (
                <div className='chat-window'>
                    

                    {!selectedChat.isGroupChat ? (
                        <div className="chat-header">
                            <button className="back-btn" onClick={() => setSelectedChat("")}>
                                ←
                            </button>
                            <div className="chat-user-info">

                                <div className="chat-avatar">
                                    {getSender(user, selectedChat.users).charAt(0).toUpperCase()}
                                </div>

                                <div className="chat-name">
                                    <h2>{getSender(user, selectedChat.users)}</h2>
                                        <p>Direct Message</p>
                                </div>

                            </div>

                            <div className="chat-actions">

                        <button className="search-chat-btn" onClick={() => setSearchOpen(!searchOpen)}>
                            🔍
                        </button>

                <ProfileModel user={getSenderFull(user, selectedChat.users)}>
                    <div className="chat-user-info" style={{cursor:"pointer"}}>
                        <div className="chat-avatar">
                            {getSender(user, selectedChat.users)
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                    </div>
                </ProfileModel>

                        </div>

                    </div>
                    ) : (
                        <div className="chat-header">
                            <button className="back-btn" onClick={() => setSelectedChat("")}>←</button>
                            <div className="chat-user-info">

                        <div className="chat-avatar">
                            {selectedChat.chatName.charAt(0).toUpperCase()}
                        </div>
                        <div className="chat-name">
                            <h2>{selectedChat.chatName}</h2>
                            <p>Group Chat</p>
                        </div>
                    </div>
                    <div className="chat-actions">
                    <button className="search-chat-btn" onClick={() => setSearchOpen(!searchOpen)}>🔍</button>

                    <GroupProfile group={selectedChat}>
                        <button className="info-btn">ⓘ</button>
                    </GroupProfile>
                    <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                    />
                </div>

                </div>
                    )}
                {
                searchOpen && (
                <div className="chat-search-container">

                <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchText}
                    onChange={(e)=>handleSearch(e.target.value)}
                    className="chat-search-input"
                />

                <div className="chat-search-results">

                {
                searchLoading ?

                <div className="chat-search-item">
                    Searching...
                </div>

                :

                searchResults.length === 0 ?

                <div className="chat-search-item">
                    No messages found
                </div>

                :

                searchResults.map((msg)=>(
                    <div
                key={msg._id}
                className="chat-search-item"
                onClick={()=>handleSearchResultClick(msg)}
                >
                <div className="search-msg">
                    {msg.content}
                </div>

                <div className="search-time">
                 {new Date(msg.createdAt).toLocaleString([],{
                 dateStyle:"medium",
                 timeStyle:"short"
                })}
                </div>
                </div>
                ))
                }

                </div>

                </div>
                )
                }
                    <div className='msgs'>
                        {loading ? (
                            <div>loading</div>
                        ) : (
                            <div className='messages'>
                                <ScrollableChat messages={messages}/>
                            </div>
                        )}
                        <form onKeyDown={sendMessage} className="chat-input-area">
                            {isTyping ? (
                            <Lottie
                            animationData={animationData}
                            loop={true}
                            style={{ width: 70, marginBottom: 15 }}
                        />
                            ) : <></>}
                            <input className="chat-input" type="text" placeholder='Send Here' onChange={typingHandler} required value={newMessage}/>
                        </form>
                    </div>
                </div>   
            ) : (
                <div className="empty-chat">

    <div className="empty-chat-icon">
        💬
    </div>

    <h2>Select a Chat</h2>

    <p>
        Choose a conversation from the left
        to start messaging.
    </p>

</div>
            )
        }
    </div>
  )
}

export default SingleChat