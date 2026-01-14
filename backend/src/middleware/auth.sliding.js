const dayjs = require("dayjs");
const { User } = require("../models/sql");
const {
  newJti,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const {
  findSessionByUserAndJti,
  createRefreshSession,
  rotateSession,
  revokeAllUserSessions,
} = require("../repositories/auth/user.RefreshToken");

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";

function cookieOptsBase() {
  const isProd = process.env.NODE_ENV === "production";
  return { httpOnly: true, secure: isProd, sameSite: "lax" };
}

function setAccessCookie(res, token) {
  res.cookie(ACCESS_COOKIE, token, { ...cookieOptsBase(), path: "/", maxAge: 5 * 60 * 1000 });
}

// refresh는 /auth로 제한하는 게 정석(보호 API에 같이 딸려가지 않게)
function setRefreshCookie(res, token) {
  const days = Number(process.env.REFRESH_EXPIRES_DAYS || 30);
  res.cookie(REFRESH_COOKIE, token, {
    ...cookieOptsBase(),
    path: "/auth",
    maxAge: days * 24 * 60 * 60 * 1000,
  });
}

function extractAccess(req) {
  const h = req.headers.authorization;
  if (h && h.startsWith("Bearer ")) return h.slice(7);
  return req.cookies?.[ACCESS_COOKIE] || null;
}

function extractRefresh(req) {
  return req.cookies?.[REFRESH_COOKIE] || null;
}

/**
 * /auth/me 전용(정석)
 * - Access OK면 통과
 * - Access 만료면 Refresh 검증 + DB 세션 검증 + 로테이션 후 통과
 * - Refresh 재사용 탐지(tokenHash mismatch) 시 강한 대응 가능
 */
async function authMeSliding(req, res, next) {
  // 1) Access 우선
  const access = extractAccess(req);
  if (access) {
    try {
      const a = verifyAccessToken(access);
      req.user = { id: a.sub, role: a.role, tokenVersion: a.token_version };
      return next();
    } catch (err) {
      // 만료면 refresh로 넘어감, 그 외는 종료
      if (!(err && err.name === "TokenExpiredError")) {
        return res.status(401).json({ ok: false, code: "INVALID_ACCESS" });
      }
    }
  }

  // 2) Refresh로 복구
  const refresh = extractRefresh(req);
  if (!refresh) return res.status(401).json({ ok: false, code: "NO_REFRESH" });

  let r;
  try {
    r = verifyRefreshToken(refresh);
  } catch (err) {
    return res.status(401).json({ ok: false, code: "INVALID_REFRESH" });
  }

  const userId = r.sub;
  const jti = r.jti;
  const tokenVersionInToken = r.token_version;
  if (!userId || !jti) return res.status(401).json({ ok: false, code: "MALFORMED_REFRESH" });

  // 3) 유저 tokenVersion 체크(전역 무효화)
  const user = await User.findByPk(userId);
  if (!user) return res.status(401).json({ ok: false, code: "NO_USER" });

  const userTokenVersion = user.tokenVersion ?? 0;
  if (typeof tokenVersionInToken === "number" && userTokenVersion !== tokenVersionInToken) {
    return res.status(401).json({ ok: false, code: "TOKEN_VERSION_MISMATCH" });
  }

  // 4) DB 세션 검증 (userId + jti)
  const session = await findSessionByUserAndJti({ userId, jti });
  if (!session) return res.status(401).json({ ok: false, code: "NO_REFRESH_SESSION" });
  if (session.revokedAt) return res.status(401).json({ ok: false, code: "REVOKED_REFRESH" });
  if (session.expiresAt && new Date(session.expiresAt).getTime() <= Date.now()) {
    return res.status(401).json({ ok: false, code: "REFRESH_EXPIRED" });
  }

  // 5) 재사용 탐지: tokenHash mismatch
  const incomingHash = hashToken(refresh);
  if (session.tokenHash !== incomingHash) {
    // 정석 대응(강): 유저 세션 전부 revoke + (선택) tokenVersion 올리기
    await revokeAllUserSessions({ userId, now: new Date() });
    return res.status(401).json({ ok: false, code: "REFRESH_REUSE_DETECTED" });
  }

  // 6) 새 Access 발급
  const newAccess = signAccessToken({
    userId,
    role: user.role,
    tokenVersion: userTokenVersion,
  });
  setAccessCookie(res, newAccess);

  // 7) Refresh 로테이션(정석): old revoke + new insert + 쿠키 교체
  const now = new Date();
  const newJtiValue = newJti();
  const newRefresh = signRefreshToken({
    userId,
    tokenVersion: userTokenVersion,
    jti: newJtiValue,
  });

  // 기존 세션 revoke + replacedByJti 기록
  await rotateSession({ userId, oldJti: jti, newJti: newJtiValue, now });

  // 새 세션 insert (해시 저장)
  const days = Number(process.env.REFRESH_EXPIRES_DAYS || 30);
  await createRefreshSession(
    {
      userId,
      jti: newJtiValue,
      tokenHash: hashToken(newRefresh),
      tokenVersionSnapshot: userTokenVersion,
      expiresAt: dayjs().add(days, "day").toDate(),
      revokedAt: null,
      replacedByJti: null,
      ip: null,
      userAgent: req.headers["user-agent"] || null,
      deviceType: null,
    },
    {}
  );

  setRefreshCookie(res, newRefresh);

  req.user = { id: userId, role: user.role, tokenVersion: userTokenVersion };
  return next();
}

module.exports = { authMeSliding };
