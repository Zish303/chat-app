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

  socket.on("disconnect", () => {
    onlineUsers.delete(userId);
    io.emit("online_users", Array.from(onlineUsers.keys()));
    console.log(`User disconnected: ${userId}`);
  });
});

module.exports = { app, server, io, onlineUsers };
