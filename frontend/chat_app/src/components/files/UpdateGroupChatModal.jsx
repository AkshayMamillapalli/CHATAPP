import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import toast from 'react-hot-toast';
import UserBadgeItem from '../UserBadgeItem';
import UserListItem from '../UserListItem';
import axios from 'axios';
import "../../styles/UpdateGroupChatModal.css"

function UpdateGroupChatModal({fetchAgain, setFetchAgain, fetchMessages}) {
    const [isOpen, setIsOpen] = useState(false);

const onOpen = () => setIsOpen(true);
const onClose = () => setIsOpen(false);
const onToggle = () => setIsOpen((prev) => !prev);

const [groupChatName, setGroupChatName] = useState();
const [search, setSearch] = useState();
const [searchResult, setSearchResult] = useState([]);
const [loading, setLoading] = useState(false);

const [renameLoading, setRenameLoading] = useState();

const {selectedChat, setSelectedChat, user} = ChatState();
 
const handleRemove = async (user1) => {
    if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
        toast.error("Only admins can remove");
        return;
    }

    try {
        setLoading(true);
        const config = {
            headers:{
                Authorization:`Bearer ${user.token}`,
            },
        };

        const {data} = await axios.put(`/api/chat/groupremove`,{
            chatId: selectedChat._id,
            userId: user1._id,
        },
        config
        );

        user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);
    } catch (error) {
        toast.error("Error Occured");
    }
};
const handleAddUser = async (user1) => {
    if(selectedChat.users.find((u) => u._id === user1._id)){
        toast.error("User already exists");
        return;
    }

    if(selectedChat.groupAdmin._id !== user._id){
        toast.error("Only admins can add");
        return;
    }

      try {
        setLoading(true);

                const config = {
            headers:{
                Authorization:`Bearer ${user.token}`,
            },
        };

        const {data} = await axios.put(`/api/chat/groupadd`,{
            chatId: selectedChat._id,
            userId: user1._id,
        },
        config
        );

        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
      } catch (error) {
        toast.error("error")
      }
};
const handleRename = async () => {
    if(!groupChatName) return;

    try {
        setRenameLoading(true)

            const config = {
            headers:{
                Authorization:`Bearer ${user.token}`,
            },
        };

        const {data} = await axios.put(`/api/chat/rename`,{
            chatId: selectedChat._id,
            chatName: groupChatName,
        },
    config
);

    setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    setRenameLoading(false);
    } catch (error) {
        toast.error("Error Occurred");
        setRenameLoading(false);

        setGroupChatName("");
    }
};
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


return (

    <div>
        <button onClick={() => setIsOpen(true)} className='update-btn'>⚙</button>
         {isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{selectedChat.chatName}</h2>
            <div className='usersInGrp'>
                {selectedChat.users.map(u => (
                    <UserBadgeItem key={u._id } user={u} handleFunction={() => handleRemove(u)} />

                ))}
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder='Enter Group Name' value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)}/>
                <button isLoading={renameLoading} onClick={handleRename}>Update</button>
            </form>
            <form onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder='Add users to chat' onChange={(e) => handleSearch(e.target.value)}/>
            </form>
            {loading ? (
                <div>loading</div>
            ) : (
                searchResult?.map((user) => (
                    <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)}/>
                ))
                )}
            <button onClick={() => setIsOpen(false)}>Close</button>
            <div>
            <button onClick={() => handleRemove(user)}>Leave Group</button>
          </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default UpdateGroupChatModal