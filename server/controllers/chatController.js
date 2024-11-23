const Chat = require("../models/chat.model");
const User = require("../models/user.model");

// Create or Get Chat between Two Users
exports.createChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, userId] },
    }).populate("participants", "-password");

    const removeCurrentUser = (chat) => {
      chat.participants = chat.participants.filter(
        (participant) => participant._id.toString() !== req.user._id.toString()
      );
    };

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user._id, userId],
      });
      chat = await chat.populate("participants", "-password");
      removeCurrentUser(chat);
      res.status(201).json(chat);
    }

    removeCurrentUser(chat);

    res.status(200).json(chat);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating chat", error: error.message });
  }
};

// Get All Chats for the Logged-in User
exports.getChats = async (req, res) => {
  try {
    let chats = await Chat.find({
      participants: { $in: [req.user._id] },
    })
      .populate("participants", "-password")
      .populate("messages.sender", "username");

    chats = chats.map((chat) => {
      return {
        ...chat._doc,
        participants: chat.participants.filter(
          (participant) =>
            participant._id.toString() !== req.user._id.toString()
        ),
      };
    });

    res.status(200).json(chats);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching chats", error: error.message });
  }
};

// Send Message
exports.sendMessage = async (req, res) => {
  const { chatId, content } = req.body;

  if (!chatId || !content) {
    return res
      .status(400)
      .json({ message: "Chat ID and content are required" });
  }

  try {
    let chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const message = {
      sender: req.user._id,
      content,
    };

    chat.messages.push(message);
    await chat.save();

    chat = await Chat.findById(chatId).populate("messages.sender", "username");

    res.status(200).json(chat.messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
};

// Fetch Messages for a Specific Chat
exports.getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId).populate(
      "messages.sender",
      "username"
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chat.messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
};
