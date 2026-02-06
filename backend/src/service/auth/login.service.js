const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const { sequelize } = require("../../models/sql");

const {
  findUserByEmail,
  increaseLoginFail,
  markLoginSuccess,
} = require("../../repositories/auth/user.repositories");

const { createLoginLog } = require("../../repositories/auth/userLoginLog.repositories");

const { newJti, hashToken, signAccessToken, signRefreshToken } = require("../../utils/jwt");

const { createRefreshSession } = require("../../repositories/auth/userRefreshToken.repositories");

const AuthError = require("../error/AuthError");
const { maskEmail, safeHashInfo } = require("./_shared");

const DEBUG_AUTH = process.env.DEBUG_AUTH === "1";

/**
 * 로그인 처리
 *
 * 컨트롤러에서 필요한 값만 뽑아서 넘기는 형태 (req 의존 제거)
 *
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.password
 * @param {string} params.loginIp
 * @param {string} params.userAgent
 * @param {string} params.loginType
 * @param {string} params.deviceType
 * @returns {Promise<{accessToken: string, refreshToken: string}>}
 */
module.exports = async function loginService({
  email,
  password,
  loginIp,
  userAgent = "",
  loginType = "UNKNOWN",
  deviceType = "UNKNOWN",
}) {
  const now = new Date();

  if (DEBUG_AUTH) {
    console.log("[AUTH][LOGIN] email:", maskEmail(email));
    console.log("[AUTH][LOGIN] passwordLen:", String(password || "").length);
    console.log("[AUTH][LOGIN] ip:", loginIp, "deviceType:", deviceType, "loginType:", loginType);
    console.log("[AUTH][LOGIN] DB_NAME:", process.env.DB_NAME);
  }

  const user = await findUserByEmail(email);

  if (DEBUG_AUTH) {
    console.log("[AUTH][LOGIN] user exists?:", !!user);
    if (user) {
      console.log("[AUTH][LOGIN] userId:", user.id);
      console.log("[AUTH][LOGIN] dbPasswordInfo:", safeHashInfo(user.password));
      console.log("[AUTH][LOGIN] status:", user.status, "role:", user.role);
      console.log("[AUTH][LOGIN] tokenVersion:", user.tokenVersion ?? 0);
    }
  }

  if (!user) {
    throw new AuthError("아이디 또는 비밀번호를 확인해주세요.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (DEBUG_AUTH) {
    console.log("[AUTH][LOGIN] bcrypt match?:", isMatch);
  }

  // 비번 틀림
  if (!isMatch) {
    await sequelize.transaction(async (t) => {
      await increaseLoginFail(user, { now }, { transaction: t });

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
  if (user.status === "BANNED" || user.status === "INACTIVE") {
    const meta =
      user.status === "BANNED"
        ? { failReason: "BANNED_USER", message: "이용이 제한된 계정입니다." }
        : { failReason: "INACTIVE_USER", message: "비활성화된 계정입니다." };

    await createLoginLog({
      userId: user.id,
      loginAt: now,
      ip: loginIp,
      loginType,
      deviceType,
      status: "FAILED",
      failReason: meta.failReason,
    });

    throw new AuthError(meta.message);
  }

  // 전역 무효화 스냅샷
  const tokenVersion = user.tokenVersion ?? 0;

  // Access 발급
  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
    tokenVersion,
  });

  // Refresh 발급
  const jti = newJti();
  const refreshToken = signRefreshToken({
    userId: user.id,
    tokenVersion,
    jti,
  });

  const refreshTokenHash = hashToken(refreshToken);

  const days = Number(process.env.REFRESH_EXPIRES_DAYS || 30);
  const refreshTokenExpiresAt = dayjs().add(days, "day").toDate();

  if (DEBUG_AUTH) {
    console.log("[AUTH][LOGIN] issue tokens ok. jti:", jti);
    console.log("[AUTH][LOGIN] refreshHashInfo:", safeHashInfo(refreshTokenHash));
    console.log("[AUTH][LOGIN] refreshExpiresAt:", refreshTokenExpiresAt.toISOString());
  }

  // 성공 처리 (유저 업데이트 + refresh 세션 저장 + 성공 로그)
  await sequelize.transaction(async (t) => {
    await markLoginSuccess(user, { now, loginIp }, { transaction: t });

    await createRefreshSession(
      {
        userId: user.id,
        jti,
        tokenHash: refreshTokenHash,
        tokenVersionSnapshot: tokenVersion,
        expiresAt: refreshTokenExpiresAt,
        revokedAt: null,
        replacedByJti: null,
        ip: loginIp,
        userAgent,
        deviceType,
      },
      { transaction: t }
    );

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

  return { accessToken, refreshToken };
};
