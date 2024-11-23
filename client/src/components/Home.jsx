import React, { useState } from "react";
import ChatList from "../components/ChatList";
import ChatMessages from "../components/ChatMessages";

const Home = () => {
  const [selectedChat, setselectedChat] = useState(null);
  const [messages] = useState([
    { text: "Hi Alice!", isMine: true },
    { text: "Hello!", isMine: false },
  ]);

  return (
    <div className="d-flex vh-100">
      <ChatList onChatSelect={(chat) => setselectedChat(chat)} />
      <div className="flex-grow-1 bg-light">
        <ChatMessages selectedChat={selectedChat} />
      </div>
    </div>
  );
};

export default Home;
