// src/controller/auth/auth.myself.controller.js
const authMeService = require('../../service/auth'); // 네 구조 유지 (me export)

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 5 * 60 * 1000,
};

// ✅ A안(Next /api/auth/me) 때문에 refresh path는 '/'가 안전
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',                 // ⭐ 중요
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

module.exports = async function authMyselfController(req, res, next) {
  try {
    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;

    console.log("cookie header:", req.headers.cookie);
    console.log("refresh?", !!req.cookies?.refresh_token);

    const result = await authMeService.me({ accessToken, refreshToken });

    if (result.newAccessToken) {
      res.cookie('access_token', result.newAccessToken, ACCESS_COOKIE_OPTIONS);
    }

    // ✅ refresh 회전된 경우에만 교체
    if (result.newRefreshToken) {
      res.cookie('refresh_token', result.newRefreshToken, REFRESH_COOKIE_OPTIONS);
    }

    res.status(200).json({ user: result.user });
  } catch (err) {
    next(err);
  }
};
