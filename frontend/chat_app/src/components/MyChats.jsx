import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import toast from 'react-hot-toast';
import axios from "axios";
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import "../styles/MyChats.css";
import GroupChatModel from './files/GroupChatModel';

function MyChats({fetchAgain}) {
    const [loggedUser, setLogedUser] = useState();
    const { user,selectedChat, setSelectedChat, chats, setChats } = ChatState();

    const fetchChats = async () => {
        try {
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };

            const {data} = await axios.get("/api/chat", config);
            setChats(data);
        } catch (error) {
            toast.error("Error Occured");
        }

    };
    useEffect(() => {
        setLogedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain])
  return (
    <div className='MyChats'>
        <div>
            My Chats
            <GroupChatModel>
            <button>New Group</button>
            </GroupChatModel>
        </div>
        <div className='Chats'>
            {chats? (
                <div className='chat-profiles'>
                    {chats.map((chat) => (
                    <div
                        key={chat._id}
                        onClick={() => setSelectedChat(chat)}
                        className={`indivi-chats ${
                        selectedChat?._id === chat._id ? "selected-chat" : ""
                        }`}>
                        <div className="chat-avatar">
                            {(!chat.isGroupChat
                            ? getSender(user, chat.users)
                            : chat.chatName
                            ).charAt(0).toUpperCase()}
                        </div>

                        <div className="chat-info">
                            <h3>
                                {!chat.isGroupChat
                                ? getSender(loggedUser, chat.users)
                                : chat.chatName}
                            </h3>

                            <p>
                                {chat.isGroupChat ? "Group Chat" : "Direct Message"}
                            </p>
                        </div>
                    </div>
                    ))}
                </div>
            ) : ( 
                <ChatLoading/>
            )}
        </div>
    </div>
  );
};

export default MyChats