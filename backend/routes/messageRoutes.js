const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {sendMessage, allMessages, searchMessages} = require("../controllers/messageController");

const router = express.Router();

router.route("/").post(protect,sendMessage);
router.route("/search/:chatId").get(protect, searchMessages);
router.route("/:chatId").get(protect,allMessages);

module.exports = router;