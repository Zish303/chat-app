const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Chat = require("../models/chat.model");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:3000" } });

const onlineUsers = new Map();

io.on("connection", (socket) => {
  const token = socket.handshake.auth.userId;

  const userId = jwt.verify(token, process.env.JWT_SECRET).id;

  if (!userId) return socket.disconnect();

  onlineUsers.set(userId, socket.id);

  io.emit("online_users", Array.from(onlineUsers.keys()));

  console.log(`User connected: ${userId}`);

  // socket.on("send_message", async (messageData) => {
  //   const { chatId, content } = messageData;

  //   try {
  //     let chat = await Chat.findById(chatId);

  //     const message = {
  //       sender: userId,
  //       content,
  //     };

  //     chat.messages.push(message);
  //     await chat.save();

  //     chat = await Chat.findById(chatId).populate(
  //       "messages.sender",
  //       "username"
  //     );

  //     const recieverId = chat.participants
  //       .filter((participant) => participant._id != userId)[0]
  //       ._id.toString();

  //     const receiverSocketId = onlineUsers.get(recieverId);
  //     if (receiverSocketId) {
  //       io.to(receiverSocketId).emit("receive_message", chat.messages);
  //     } else {
  //       console.log("Receiver is offline");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  socket.on("disconnect", () => {
    onlineUsers.delete(userId);
    io.emit("online_users", Array.from(onlineUsers.keys()));
    console.log(`User disconnected: ${userId}`);
  });
});

module.exports = { app, server, io, onlineUsers };
