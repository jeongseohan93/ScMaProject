const router = require("express").Router();
const chatController = require("../controller/chat.controller");
const { requireAccess } = require("../middleware/auth.middleware");

router.get("/chat/list", requireAccess, chatController.getChatList);
router.get("/chat/history", requireAccess, chatController.getChatHistory);
router.put("/chat/read", requireAccess, chatController.markAsRead);
router.post("/chat/analyze", requireAccess, chatController.analyzeChat);

module.exports = router;
