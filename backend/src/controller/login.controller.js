// backend/controllers/auth.controller.js
const { loginService, logoutService } = require("../services/auth.service");

exports.login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await loginService(req);

    // 쿠키로 내려주기 (프론트에서 withCredentials: true로 받는 상태)
    const isProd = process.env.NODE_ENV === "production";

    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15분
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30일
      })
      .status(200)
      .json({ success: true });
  } catch (err) {
    // 공통 에러 미들웨어가 있으면 next(err)
    console.error(err);

    // 인증 실패 에러라면 401으로 내려주기
    if (err.name === "AuthError") {
      return res
        .status(401)
        .json({ success: false, message: err.message || "로그인 실패" });
    }

    return res.status(500).json({
      success: false,
      message: "서버 내부 오류입니다.",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    await logoutService(req);

    res
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .json({ success: true });
  } catch (err) {
    console.error("[BE] logout error:", err);
    res
      .status(500)
      .json({ success: false, message: "로그아웃 중 오류가 발생했습니다." });
  }
};