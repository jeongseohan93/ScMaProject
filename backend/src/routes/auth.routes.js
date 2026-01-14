const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const { login, logout } = require('../controller/login.controller');
const { requireAccess } = require("../middleware/auth.middleware");
const { authMeSliding } = require("../middleware/auth.sliding");

// 회원가입
router.post('/register', authController.register);

router.post('/login', login);

router.post('/logout', logout);

/**
 * /auth/me
 * - 세션 확인 전용
 * - Access가 만료되면 Refresh로 자동복구(슬라이딩)
 */
router.get("/me", authMeSliding, async (req, res) => {
  return res.json({ ok: true, user: { id: req.user.id, role: req.user.role } });
});

/**
 * /api/profile
 * - 일반 보호 API
 * - Access-only (Refresh 절대 사용 안 함)
 * - Access 만료면 401 (프론트가 /auth/me로 복구 후 재시도)
 */
router.get("/profile", requireAccess, async (req, res) => {
  return res.json({ ok: true, userId: req.user.id });
});

module.exports = router;
   