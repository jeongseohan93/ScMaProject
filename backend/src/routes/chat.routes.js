const express = require('express');
const router = express.Router();
const chatController = require('../controller/chat.controller');

router.post('/:roomId/message', chatController.sendMessage)

module.exports = router;