const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const { sequelize } = require("../models/sql");

const { findUserByEmail, increaseLoginFail, markLoginSuccess } = require("../repositories/auth/user.repositories");
const { createLoginLog } = require("../repositories/auth/userLoginLog.repositories");

const { newJti, hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/jwt");

const { createRefreshSession, revokeSession } = require("../repositories/auth/user.RefreshToken");

const getClientIp = require("../utils/getClientIp");
const getDeviceInfo = require("../utils/getDeviceInfo");
const AuthError = require("./errors/AuthError");

const DEBUG_AUTH = process.env.DEBUG_AUTH === "1";

function maskEmail(email) {
  if (!email) return "";
  const [id, domain] = String(email).split("@");
  if (!domain) return "***";
  return `${id.slice(0, 2)}***@${domain}`;
}

function safeHashInfo(hash) {
  const s = String(hash || "");
  return {
    prefix: s.slice(0, 4),  // $2b$ 등
    len: s.length,
  };
}

exports.loginService = async (req) => {
  const { email, password } = req.body;

  const now = new Date();
  const loginIp = getClientIp(req);
  const userAgent = req.headers["user-agent"] || "";
  const { loginType, deviceType } = getDeviceInfo(userAgent);

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

  // ✅ bcrypt 비교
  const isMatch = await bcrypt.compare(password, user.password);

  if (DEBUG_AUTH) {
    console.log("[AUTH][LOGIN] bcrypt match?:", isMatch);
  }

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

  // ✅ tokenVersion (전역 무효화)
  const tokenVersion = user.tokenVersion ?? 0;

  // ✅ Access
  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
    tokenVersion,
  });

  // ✅ Refresh
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
    console.log("[AUTH][LOGIN] refreshHashInfo:", safeHashInfo(refreshTokenHash)); // 해시 길이만
    console.log("[AUTH][LOGIN] refreshExpiresAt:", refreshTokenExpiresAt.toISOString());
  }

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

exports.logoutService = async (req) => {
  const refreshToken = req.cookies?.refresh_token || null;
  const now = new Date();

  if (!refreshToken) return;

  try {
    const payload = verifyRefreshToken(refreshToken);
    await revokeSession({ userId: payload.sub, jti: payload.jti, now });
  } catch (e) {
    return;
  }
};
