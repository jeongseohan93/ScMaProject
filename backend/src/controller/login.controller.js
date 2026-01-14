const { loginService, logoutService } = require("../services/auth.service");

function cookieOptsBase() {
  const isProd = process.env.NODE_ENV === "production";
  return { httpOnly: true, secure: isProd, sameSite: "lax" };
}

exports.login = async (req, res) => {
  try {
    const { accessToken, refreshToken } = await loginService(req);

    const days = Number(process.env.REFRESH_EXPIRES_DAYS || 30);

    return res
      .cookie("access_token", accessToken, {
        ...cookieOptsBase(),
        path: "/",
        maxAge: 5 * 60 * 1000,
      })
      .cookie("refresh_token", refreshToken, {
        ...cookieOptsBase(),
        path: "/auth", // ✅ 정석: refresh는 /auth로 제한
        maxAge: days * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ success: true });
  } catch (err) {
    console.error(err);

    if (err.name === "AuthError") {
      return res.status(401).json({ success: false, message: err.message || "로그인 실패" });
    }

    return res.status(500).json({ success: false, message: "서버 내부 오류입니다." });
  }
};

exports.logout = async (req, res) => {
  try {
    await logoutService(req);

    // ✅ 쿠키 삭제는 세팅과 옵션 동일하게
    return res
      .clearCookie("access_token", { ...cookieOptsBase(), path: "/" })
      .clearCookie("refresh_token", { ...cookieOptsBase(), path: "/auth" })
      .json({ success: true });
  } catch (err) {
    console.error("[BE] logout error:", err);
    return res.status(500).json({ success: false, message: "로그아웃 중 오류가 발생했습니다." });
  }
};
