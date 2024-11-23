import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const ChatList = ({ onChatSelect }) => {
  const [chats, setChats] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cookies] = useCookies(["accessToken"]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/chat/", {
          headers: { Authorization: `Bearer ${cookies.accessToken}` },
        });
        setChats(data);
        console.log(chats);
      } catch (err) {
        console.error(
          "Error fetching chats:",
          err.response?.data || err.message
        );
      }
    };

    fetchChats();
  }, [cookies.accessToken]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/user/search?query=${query}`,
        {
          headers: { Authorization: `Bearer ${cookies.accessToken}` },
        }
      );
      setSearchResults(data);
    } catch (err) {
      console.error(
        "Error searching users:",
        err.response?.data || err.message
      );
    }
  };

  const handleUserClick = async (user) => {
    try {
      const { data: newChat } = await axios.post(
        "http://localhost:5000/api/chat/",
        { userId: user._id },
        { headers: { Authorization: `Bearer ${cookies.accessToken}` } }
      );
      setChats((prev) => [...prev, newChat]);
      setSearchResults([]);
      setSearchQuery("");
      onChatSelect(newChat);
    } catch (err) {
      console.error("Error creating chat:", err.response?.data || err.message);
    }
  };

  return (
    <div className="sidebar p-3">
      <h4 className="mb-4">Chat App</h4>
      <div className="p-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search for users..."
          value={searchQuery}
          onChange={handleSearch}
        />
        {searchResults.length > 0 && (
          <ul className="list-group mt-2">
            {searchResults.map((user) => (
              <li
                key={user._id}
                className="list-group-item list-group-item-action"
                onClick={() => handleUserClick(user)}
                style={{ cursor: "pointer" }}
              >
                {user.username} ({user.email})
              </li>
            ))}
          </ul>
        )}
      </div>
      {chats.length > 0 &&
        chats.map((chat) => (
          <div
            key={chat._id}
            className="chat-item p-3 border-bottom"
            onClick={() => onChatSelect(chat)}
            style={{ cursor: "pointer" }}
          >
            <h6>
              {chat.name || chat.participants.map((p) => p.username).join(", ")}
            </h6>
            <small>{chat.messages[chat.messages.length-1].content || "No messages yet"}</small>
          </div>
        ))}
    </div>
  );
};

export default ChatList;
