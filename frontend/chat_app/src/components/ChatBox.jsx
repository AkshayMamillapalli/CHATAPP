import React from 'react'
import {ChatState} from "../Context/ChatProvider"
import SingleChat from './SingleChat';

function ChatBox({fetchAgain, setFetchAgain}) {

  const {selectedChat} = ChatState();
  return (
    <div className='ChatBox'>
      <div className='cont' style={{ backgroundColor:"white" }}>
          <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>
    </div>
  )
}

export default ChatBox