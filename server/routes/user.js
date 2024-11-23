const express = require("express");
const { signup, login, searchUsers } = require("../controllers/userController");
const { verify } = require("../middleware/userMiddleware");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/search", verify, searchUsers);

module.exports = router;
