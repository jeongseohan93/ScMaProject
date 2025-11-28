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

// 현재 로그인한 유저 조회
router.get("/me", requireAuth, (req, res) => {
  const user = req.user;

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      role: user.role,
    },
  });
});

module.exports = router;
   