import React, { useEffect, useRef } from 'react'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { ChatState } from '../Context/ChatProvider'
import "../styles/ScrollableChat.css"

function ScrollableChat({messages}) {
    const {user, highlightedMessage, setHighlightedMessage} = ChatState();
    const bottomRef = useRef(null);
    const messageRefs = useRef({});

    useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  useEffect(() => {
    if (
        highlightedMessage &&
        messageRefs.current[highlightedMessage]
    ) {
        messageRefs.current[highlightedMessage].scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

        const timer = setTimeout(() => {
            setHighlightedMessage(null);
        }, 3000);

        return () => clearTimeout(timer);
    }
}, [highlightedMessage, setHighlightedMessage]);

const isNewDay = (messages, i) => {
  if (i === 0) return true;

  return (
    new Date(messages[i].createdAt).toDateString() !==
    new Date(messages[i - 1].createdAt).toDateString()
  );
};

const getDateLabel = (date) => {
  const messageDate = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (messageDate.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (messageDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return messageDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

  return (
    <div className="scrollable-feed">
      {messages &&
        messages.map((m, i) => (
            <React.Fragment key={m._id}>
                  {isNewDay(messages, i) && (
        <div className="date-divider">
            {getDateLabel(m.createdAt)}
        </div>
    )}
          <div
            className={`message-row ${
              m.sender._id === user._id ? "my-message" : "other-message"
            }`}
            key={m._id}
            ref={(el) => (messageRefs.current[m._id] = el)}
          >
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <div className="message-avatar">
                {m.sender.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span
  className={`message-bubble ${
    m.sender._id === user._id
      ? "sent-message"
      : "received-message"
  } ${
    highlightedMessage === m._id
      ? "highlighted-message"
      : ""
  }`}
  style={{
    marginLeft: isSameSenderMargin(messages, m, i, user._id),
    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
  }}
>
<span className="message-text">
    {m.content}
</span>

<span
    className={`message-time ${
        m.sender._id === user._id
            ? "sent-time"
            : "received-time"
    }`}
>
    {new Date(m.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    })}
</span>
</span>
          </div>
          </React.Fragment>
        ))}

      <div ref={bottomRef}></div>
    </div>
  );
}

export default ScrollableChat