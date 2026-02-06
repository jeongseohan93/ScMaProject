const loginService = require('../../service/auth');
const getClientIp = require('../../utils/getClientIp');
const getDeviceInfo = require('../../utils/getDeviceInfo');
const { cookieOptsBase } = require('../../utils/cookieOptsBase');

exports.login = async ( req, res ) => {
  
  try{

    const email = req.body?.email;
    const password = req.body?.password;

    // ✅ 방어(500 막기)
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "email/password required" });
    }

    const loginIp = getClientIp(req);
    const userAgent = req.headers["user-agent"] || "";
    const { loginType, deviceType } = getDeviceInfo(userAgent);


    const { accessToken, refreshToken } = await loginService.login({
      email,
      password,
      loginIp,
      userAgent,
      loginType,
      deviceType,
    });

    const days = Number(process.env.REFRESH_EXPIRES_DAYS || 30);

    return res
      .cookie("access_token", accessToken, {
        ...cookieOptsBase(),
        path: "/",
        maxAge: 5 * 60 * 1000,
      })
      .cookie("refresh_token", refreshToken, {
        ...cookieOptsBase(),
        path: "/",
        maxAge: days * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ success: true });
  } catch (err) {
    console.error(err);

    if(err.name === "AuthError") {
      return res.status(401).json({ success: false, message: err.message || "로그인 실패"});
    }

    return res.status(500).json({success: false, message: "서버 내부 오류입니다."})
  }
}  