const express = require('express');
const router = express.Router();

const userController = require('../controller/user.controller');
const { requireAccess } = require('../middleware/auth.middleware');

router.get("/user/search", requireAccess, userController.searchUser);
router.post("/user/add-friend", requireAccess, userController.addFriend);
router.get("/user/friends", requireAccess, userController.getFriends);
router.delete("/user/delete-friend", requireAccess, userController.deleteFriend);

module.exports = router;