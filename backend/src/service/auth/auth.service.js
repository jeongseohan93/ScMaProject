const bcrypt = require('bcrypt');
const dayjs = require('dayjs');
const { sequelize } = require('../../models/sql');
const userRepository = require('../../repositories/auth/user.repositories');
const refreshRepository = require('../../repositories/auth/UserRefreshToken.repositories');
const loginLogRepository = require('../../repositories/auth/userLoginLog.repositories');
const AuthError = require('../error/AuthError');
const { maskEmail, safeHashInfo } = require('./_shared')
const { newJti, hashToken, signAccessToken, signRefreshToken } = require('../../utils/jwt');

const DEBUG_AUTH = process.env.DEBUG_AUTH === "1";

exports.registerUser = async (userData) => {
    const {email, password} = userData;

    const exists = await userRepository.findByEmail(email);
    console.log(exists);
    if(exists) {
        const error = new Error('이미 사용 중인 이메일입니다.');
        error.status = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await userRepository.createUser({
        ...userData,
        password: hashedPassword,
        role: 'USER',
        status: 'ACTIVE',
        preferredLanguage: userData.preferredLanguage || 'ko',
        timeZone: userData.timeZone || 'Asia/Seoul',
        lastLoginAt: new Date(),
    } 
)
    return newUser;
    
}

exports.loginService = async ({
    email,
    password,
    loginIp,
    userAgent = "",
    loginType ="UNKNOWN",
    deviceType = "UNKNOWN",
}) => {
    
    const now = new Date();
    
    const user = await userRepository.findByEmail(email);

    if(!user) {
        throw new AuthError("아이디 또는 비밀번호를 확인해주세요.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        await sequelize.transaction(async (t) => {
            await userRepository.increaseLoginFail(user.id, { transaction: t });

            await loginLogRepository.createLoginLog(
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

    if (user.status === "BANNED" || user.status === "INACTIVE") {
        const meta = user.status === "BANNED"
            ? { failReason: "BANNED_USER", message: "이용이 제한된 계정입니다." }
            : { failReason: "INACTIVE_USER", message: "비활성화된 계정입니다." };

        
        await loginLogRepository.createLoginLog({
            userId: user.id,
            loginAt: new Date(),
            ip: loginIp,
            loginType,
            deviceType,
            status: "FAILED",
            failReason: meta.failReason,
        });

        throw new AuthError(meta.message);
  }
  const tokenVersion = user.tokenVersion ?? 0;

  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
    tokenVersion,
  });

  const jti = newJti();
  const refreshToken = signRefreshToken({
    userId: user.id,
    tokenVersion,
    jti,
  });

  const refreshTokenHash = hashToken(refreshToken);

  const days = Number(process.env.REFRESH_EXPIRES_DAYS || 30);
  const refreshTokenExpiresAt = dayjs().add(days, "day").toDate();

  await sequelize.transaction(async (t) => {
    await userRepository.markLoginSuccess(user, { now, loginIp }, {transaction: t});

    await refreshRepository.createRefreshSession(
        {
            userId: user.id,
            jti,
            tokenHash: refreshTokenHash,
            tokenVersionSnapshot: tokenVersion,
            expiresAt: refreshTokenExpiresAt,
            ip: loginIp,
            userAgent,
            deviceType,
        },
        {transaction: t}
    );

    await loginLogRepository.createLoginLog(
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

  return {  accessToken, 
            refreshToken,
            user: {
                id: user.id,
                email: user.eamil,
                name: user.name
            }  };
};

exports.logout = async (refreshToken) => {
    if(!refreshToken) return;

    const tokenHash = hashToken(refreshToken);

    await refreshRepository.deleteRefreshSession(tokenHash);
}