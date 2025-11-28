const bcrypt = require('bcrypt');
const { signAccessToken, signRefreshToken } = require('../utils/jwt');
const { findUserByEmail, increaseLoginFail } = require('../repositories/auth/user.repositories'); 
const { createLoginLog } = require('../repositories/auth/userLoginLog.repositories');
const { createRefreshToken, revokeRefreshToken } = require('../repositories/auth/user.RefreshToken');
const getClientIp = require('../utils/getClientIp');
const getDeviceInfo = require('../utils/getDeviceInfo');
const AuthError = require('./errors/AuthError');
const { sequelize } = require('../models/sql');
const dayjs = require('dayjs');


exports.loginService = async (req) => {
    const { email, password } = req.body;
    const loginIp = getClientIp(req);
    const { loginType, deviceType } = getDeviceInfo(req.headers["user-agent"]);
    const now = new Date();

    const user = await findUserByEmail(email);

    // 아이디 불일치
    if(!user) {
        throw new AuthError("아이디 또는 비밀번호를 확인해주세요.");
    }
    
    const isMatch = await bcrypt.compare(password, user.password);

    // 비밀번호 불일치
    if(!isMatch) {
        await sequelize.transaction(async (t) => {
            await increaseLoginFail(
                user,
                { now },
                { transaction: t }
            );

            // 2) 실패 로그인 로그 기록
            await createLoginLog(
            {
                userId: user.id,
                loginAt: now,
                ip: loginIp,
                loginType,
                deviceType,
                status: "FAILED",
                failReason: "INVALID_PASSWORD",
            },
            { transaction: t }
            );
        });

        throw new AuthError("아이디 또는 비밀번호를 확인해주세요.");
    }

    // 상태 체크
    if ( user.status === "BANNED" || user.status === "INACTIVE" ) {
        const statusMeta = {
            BANNED: {
                failReason: "BANNED_USER",
                message: "이용이 제한된 계정입니다.",
            },
            INACTIVE: {
                failReason: "INACTIVE_USER",
                message: "비활성화된 계정입니다.",
            },
        };
        const meta = statusMeta[user.status];

    await createLoginLog(
        {
            userId: user.id,
            loginAt: now,
            ip: loginIp,
            loginType,
            deviceType,
            status: "FAILED",
            failReason: meta.failReason,
        }
    )
    throw new AuthError(meta.message);
    }

    // 정상 로그인 처리
    const tokenVersion = user.tokenVersion || 0;

    const accessToken = signAccessToken({
        userId: user.id,
        role: user.role,
    });

    const refreshToken = signRefreshToken({
        userId: user.id,
        tokenVersion,
    })

    const refreshTokenExpiresAt = dayjs().add(30, 'day').toDate();

        await sequelize.transaction(async (t) => {
        // 1) 유저 로그인 성공 정보 업데이트
            await markLoginSuccess(
            user,
            { now, loginIp },
            { transaction: t }
        );

        // 2) 리프레시 토큰 저장
        await createRefreshToken(
            {
            userId: user.id,
            token: refreshToken,
            tokenVersionSnapshot: tokenVersion,
            expiresAt: refreshTokenExpiresAt,
            revokedAt: null,
            ip: loginIp,
            userAgent,
            deviceType,
            },
            { transaction: t }
        );

        // 3) 로그인 성공 로그
        await createLoginLog(
            {
            userId: user.id,
            loginAt: now,
            ip: loginIp,
            loginType,
            deviceType,
            status: "SUCCESS",
            failReason: null,
            },
            { transaction: t }
        );
    });

    return {
        accessToken,
        refreshToken,
    };
};

exports.logoutService = async (req) => {
    const refreshToken = req.cookies?.refresh_token || null;
    const now = new Date();

    if(!refreshToken) {
        return;
    }

    await revokeRefreshToken(refreshToken, now);
};

