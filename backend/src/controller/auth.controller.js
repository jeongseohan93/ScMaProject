const authService = require('../service/auth/auth.service');
const getClientIp = require('../utils/getClientIp');
const getDeviceInfo = require('../utils/getDeviceInfo');

exports.register = async (req, res, next) => {
    try{
        const user = await authService.registerUser({
            ...req.body,
            signIp: getClientIp(req),
        })

        return res.status(201).json({
            success: true,
            message: '회원가입이 완료되었습니다.',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                nickname: user.nickname,
            },
        });
    } catch (err) {
        next(err);
    }
}

exports.login = async (req, res, next) => {
    try {
        const email = req.body?.email;
        const password = req.body?.password;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "email/password required" });
        }

        const loginIp = getClientIp(req);
        const userAgent = req.headers["user-agent"] || "";
        const { loginType, deviceType } = getDeviceInfo(userAgent);

        const { accessToken, refreshToken, user } = await authService.loginService({
            email,
            password,
            loginIp,
            userAgent,
            loginType,
            deviceType,
        });

        return res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });

    } catch (err) {
        console.error("로그인 컨트롤러 에러:", err.message);

        if(err.name === "AuthError" || err.status === 401){
            return res.status(401).json({success: false, message: err.message});
        }

        return res.status(500).json({success: false, message: "서버 내부 오류"});
    }
}

exports.logout = async (req, res, next) => {
    try {
        //쿠키에서 리프레시 토큰을 꺼내기
        const refreshToken = req.cookies.refresh_token || req.body.refreshToken;

        if(refreshToken) {
            await authService.logout(refreshToken);
        }
        
        // 성공하든 말든 로그아웃 성공 처리(이미 없는 토큰 가능성)
        return res.status(200).json({success: true, message: "Logged out"});
    } catch (err) {
        console.error("로그아웃 에러:", err);
        
        // 로그아웃 에러는 사용자에게 알릴 필요 없이 그냥 넘어가도 상관 x
        return res.status(200).json({success: true});
    }
}