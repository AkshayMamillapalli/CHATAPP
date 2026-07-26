import React, { useState } from 'react'
import "../../styles/GroupChatModel.css"
import toast from 'react-hot-toast';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from "../UserListItem"
import UserBadgeItem from '../UserBadgeItem';

function GroupChatModel({children}) {

const [isOpen, setIsOpen] = useState(false);

const [groupChatName,setGroupChatName] = useState();
const [selectedUsers, setSelectedUsers] = useState([]);
const [search, setSearch] = useState("");
const [searchResult, setSearchResult] = useState([]);
const [loading, setLoading] = useState(false);

const onOpen = () => setIsOpen(true);
const onClose = () => setIsOpen(false);
const onToggle = () => setIsOpen((prev) => !prev);

const {user,chats,setChats} = ChatState();

const handleSearch = async (query) => {
    setSearch(query);
    if(!query){
        return;
    }

    try {
        setLoading(true)

        const config = {
            headers:{
                Authorization:`Bearer ${user.token}`,
            },
        };

        const {data} = await axios.get(`/api/user?search=${search}`,config);
        console.log(data);
        setLoading(false);
        setSearchResult(data);
    
    } catch (error) {
console.log(error);
  console.log(error.response);
  console.log(error.response?.data);

  toast.error(error.response?.data?.message || "Error Occurred");         }

};
const handleSubmit = async () => {
    if(!groupChatName || !selectedUsers){
        toast.error("Please Fill all the fields")
    }

    try {
        const config = {
            headers:{
                Authorization:`Bearer ${user.token}`,
            },
        };

        const {data} = await axios.post("/api/chat/group",{
            name:groupChatName,
            users:JSON.stringify(selectedUsers.map(u=> u._id)),     
        },
    config
    );

    setChats([data, ...chats]);
    setIsOpen(false);
    toast.success("New Group Chat Created");
    } catch (error) {
        console.log(error);
  console.log(error.response);
  console.log(error.response?.data);
        toast.error("Error occurred");
    }
};
const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
};

const handleGroup = (userToAdd) => {
    if(selectedUsers.includes(userToAdd)){
        toast.error("User Exists");
        return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
};


  return (
    <div>
        <span onClick={()=> setIsOpen(true)}>{children}</span>
     {isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create Group Chat</h2>
            <div>
                <form>
                    <input type="text" placeholder='Chat Name' onChange={(e) => setGroupChatName(e.target.value)} />

                    <input type="text" placeholder='Add users' onChange={(e) => handleSearch(e.target.value)}/>
                </form>

            {selectedUsers.map(u => (
                <UserBadgeItem key={u._id } user={u} handleFunction={() => handleDelete(u)} />
            ))}

            {loading? <div>loading</div> : (
                searchResult?.slice(0,4).map(user => (
                    <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)}/>
                ))
            )}
            <button onClick={() => setIsOpen(false)}>Close</button>
            </div>
            <button onClick={handleSubmit}>Create Chat</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupChatModel