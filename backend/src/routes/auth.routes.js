// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const { login, logout } = require('../controller/login.controller');
const requireAuth = require('../middleware/authMiddleWare')


// 회원가입
router.post('/register', authController.register);

router.post('/login', login);

router.post('/logout', logout)

module.exports = router;
   