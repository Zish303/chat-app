const express = require("express");
const { createChat, getChats, sendMessage, getMessages } = require("../controllers/chatController");
const { verify } = require("../middleware/userMiddleware");

const router = express.Router();

// Create or Get Chat
router.post("/", verify, createChat);

// Get All Chats
router.get("/", verify, getChats);

// Send Message
router.post("/message", verify, sendMessage);

// Get Messages for a Chat
router.get("/messages/:chatId", verify, getMessages);

module.exports = router;
