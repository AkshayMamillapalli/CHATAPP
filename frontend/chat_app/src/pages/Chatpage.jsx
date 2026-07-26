import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/files/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import "../styles/ChatPage.css";

function Chatpage() {
    const {user} = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
        <div className="box">
            {user && <SideDrawer></SideDrawer>}
            <div className="ChatContainer">
                {user && <MyChats fetchAgain={fetchAgain}/>}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </div>
        </div>
    );
}

export default Chatpage;