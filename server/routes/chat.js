const express = require("express");
const { createChat, getChats, sendMessage, getMessages } = require("../controllers/chatController");
const { verify } = require("../middleware/userMiddleware");

const router = express.Router();

router.post("/", verify, createChat);

router.get("/", verify, getChats);

router.post("/message", verify, sendMessage);

router.get("/messages/:chatId", verify, getMessages);

module.exports = router;
