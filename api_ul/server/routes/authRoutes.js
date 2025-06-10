//DONE DON'T TOUCH THIS FILE!!!!! je touch krbe tar duto baba. Later make logout route

const express = require("express");
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

module.exports = router;
