import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const ChatList = ({ onChatSelect }) => {
  const [chats, setChats] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    document.cookie = "accesToken=; Max-Age=0; path=/;";
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/chat/", {
          headers: { Authorization: `Bearer ${cookies.accessToken}` },
        });
        setChats(data);
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

  const lastMessage = (chat) => {
    if (chat.messages.length === 0) return undefined;
    let message = chat.messages[chat.messages.length - 1].content;
    if (!message) return "";
    return message.length > 30 ? `${message.substring(0, 30)}...` : message;
  };

  const handleUserClick = async (user) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat/",
        { userId: user._id },
        { headers: { Authorization: `Bearer ${cookies.accessToken}` } }
      );
      if (response.status === 201) setChats((prev) => [...prev, response.data]);
      setSearchResults([]);
      setSearchQuery("");
      onChatSelect(response.data);
    } catch (err) {
      console.error("Error creating chat:", err.response?.data || err.message);
    }
  };

  return (
    <div className="sidebar p-3">
      <div className="d-flex justify-content-between align-items-center">
        <h4>Chat App</h4>
        <div className="position-relative">
          <img
            src={`https://robohash.org/${cookies.username}.png`}
            alt="Profile"
            className="rounded-circle"
            style={{
              background: "white",
              cursor: "pointer",
              width: "40px",
              height: "40px",
            }}
            onClick={toggleDropdown}
          />
          {dropdownOpen && (
            <div
              className="dropdown-menu show position-absolute"
              style={{ right: 0 }}
            >
              {/* <button
                className="dropdown-item"
                onClick={() => navigate("/profile")}
              >
                View Profile
              </button> */}
              <button
                className="dropdown-item text-danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="">
        <input
          type="text"
          className="form-control rounded-pill mt-3"
          placeholder="Search for users..."
          value={searchQuery}
          onChange={handleSearch}
        />
        {searchResults.length > 0 && (
          <ul className="list-group">
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
            className="chat-item p-3 border-bottom d-flex align-items-center"
            onClick={() => onChatSelect(chat)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={`https://robohash.org/${
                chat.participants[0]?.username || "default"
              }.png`}
              alt="Profile"
              className="rounded-circle me-3"
              style={{
                background: "white",
                width: "40px",
                height: "40px",
                objectFit: "cover",
              }}
            />

            <div>
              <h6>
                {chat.name ||
                  chat.participants.map((p) => p.username).join(", ")}
              </h6>
              <small>{lastMessage(chat) || "No messages yet"}</small>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ChatList;
