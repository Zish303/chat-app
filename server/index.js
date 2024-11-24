const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const cors = require("cors");

const { app, server } = require("./socket/socket");

dotenv.config();
connectDB();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "http://localhost:3000" } });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
