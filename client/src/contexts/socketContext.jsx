import React, { createContext, useState, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { useCookies } from "react-cookie";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [cookies] = useCookies(["accessToken"]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const userId = cookies.accessToken;
  
  useEffect(() => {
    if (!userId) return;

    const newSocket = io("http://localhost:5000", {
      auth: {userId},
    });

    newSocket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
