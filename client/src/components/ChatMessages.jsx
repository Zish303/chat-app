import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const ChatMessages = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [cookies] = useCookies(["accessToken"]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/chat/messages/${selectedChat._id}`,
          { headers: { Authorization: `Bearer ${cookies.accessToken}` } }
        );
        setMessages(data);
      } catch (err) {
        console.error(
          "Error fetching messages:",
          err.response?.data || err.message
        );
      }
    };

    fetchMessages();
  }, [selectedChat, cookies]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({});
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    // socket.emit("send_message", {
    //   chatId: selectedChat._id,
    //   content: newMessage,
    // });

    // setNewMessage("");

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/chat/message`,
        { chatId: selectedChat._id, content: newMessage },
        { headers: { Authorization: `Bearer ${cookies.accessToken}` } }
      );
      setMessages(data);
      setNewMessage("");
    } catch (err) {
      console.error(
        "Error sending message:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div className="d-flex flex-column justify-content-between h-100">
      <div
        className="flex-grow-1 overflow-auto p-3"
        style={{ overflowY: "scroll", flex: 1 }}
      >
        {messages.length > 0 &&
          messages.map((message) => (
            <div
              key={message._id}
              className={`d-flex ${
                message.sender._id !== selectedChat.participants[0]._id
                  ? "justify-content-end"
                  : "justify-content-start"
              } mb-1`}
            >
              <div
                className={`p-2 ${
                  message.sender._id !== selectedChat.participants[0]._id
                    ? "bubble-right"
                    : "bubble-left"
                }`}
              >
                {/* <small className="d-block">
                  {message.sender._id !== selectedChat.participants[0]._id
                    ? "You"
                    : message.sender.username}
                </small> */}
                {message.content}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      {selectedChat && (
        <div className="message-input d-flex p-3 border-top">
          <input
            type="text"
            className="form-control me-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button className="btn btn-primary" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
