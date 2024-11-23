import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const ChatMessages = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [cookies] = useCookies(["accessToken"]);

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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

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
      <div className="p-3" style={{ overflowY: "scroll", flex: 1 }}>
        {messages.length > 0 && 
        messages.map((message) => (
          <div
            key={message._id}
            className={`message-item ${message.sender._id === selectedChat.participants[0]._id ? "text-end" : "text-start"
              } mb-3`}
          >
            <div
              className={`p-2 rounded ${message.sender._id === selectedChat.participants[0]._id
                  ? "bg-primary text-white"
                  : "bg-light text-dark"
                }`}
            >
              {message.content}
            </div>
          </div>
        ))}
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