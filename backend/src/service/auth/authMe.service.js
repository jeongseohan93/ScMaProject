// src/service/auth/authMe.service.js
const AuthError = require('../error/AuthError');

const {
  verifyAccessToken,
  verifyRefreshToken,
  issueAccessToken,
  issueRefreshToken,
  newJti,
  REFRESH_TTL_MS,
  REFRESH_ROTATE_WINDOW_MS,
} = require('../../utils/jwt');

const { findUserById } = require('../../repositories/auth/user.repositories');

const {
  findRefreshSessionByJti,
  isRefreshSessionActive,
  isRefreshTokenHashMatch,
  rotateRefreshSession,
} = require('../../repositories/auth/userRefreshToken.repositories');

function isTokenExpiredError(err) {
  return err && err.name === 'TokenExpiredError';
}

// ✅ refresh로 복구/슬라이딩 하는 로직을 함수로 분리 (중복 제거)
async function handleRefreshFlow({ refreshToken }) {
  if (!refreshToken) throw new AuthError("UNAUTHORIZED");

  let refreshPayload;
  try {
    refreshPayload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AuthError("UNAUTHORIZED");
  }

  const userId = refreshPayload.sub;
  const jti = refreshPayload.jti;
  if (!userId || !jti) throw new AuthError("UNAUTHORIZED");

  const user = await findUserById(userId);
  if (!user) throw new AuthError("UNAUTHORIZED");

  const tokenVersionInToken = refreshPayload.token_version ?? 0;
  const tokenVersionInDb = user.tokenVersion ?? 0;
  if (tokenVersionInToken !== tokenVersionInDb) throw new AuthError("UNAUTHORIZED");

  const session = await findRefreshSessionByJti(jti);
  if (!isRefreshSessionActive(session)) throw new AuthError("UNAUTHORIZED");
  if (String(session.userId) !== String(userId)) throw new AuthError("UNAUTHORIZED");

  const ok = isRefreshTokenHashMatch(refreshToken, session.tokenHash);
  if (!ok) throw new AuthError("UNAUTHORIZED");

  // ✅ 새 access 발급
  const newAccessToken = issueAccessToken({
    userId: user.id,
    role: user.role,
    tokenVersion: user.tokenVersion ?? 0,
  });

  // ✅ refresh 만료 임박 시에만 회전 (자동 로그인)
  let newRefreshToken = null;

  if (session.expiresAt) {
    const remaining = new Date(session.expiresAt).getTime() - Date.now();

    if (remaining < REFRESH_ROTATE_WINDOW_MS) {
      const jti2 = newJti();
      const refresh2 = issueRefreshToken({
        userId: user.id,
        tokenVersion: user.tokenVersion ?? 0,
        jti: jti2,
      });

      const newExpiresAt = new Date(Date.now() + REFRESH_TTL_MS);

      await rotateRefreshSession({
        oldJti: jti,
        userId: user.id,
        newJti: jti2,
        newRefreshToken: refresh2,
        newExpiresAt,
      });

      newRefreshToken = refresh2;
    }
  }

  return {
    user: { id: user.id, email: user.email, role: user.role },
    newAccessToken,
    newRefreshToken,
    slid: true,
  };
}

module.exports = async function authMeService({ accessToken, refreshToken }) {
  // ✅ 핵심 수정: access 없어도 refresh 있으면 자동 로그인 복구
  if (!accessToken) {
    return handleRefreshFlow({ refreshToken });
  }

  let payload;
  try {
    payload = verifyAccessToken(accessToken);
  } catch (err) {
    // ✅ access 만료면 refresh로 복구
    if (isTokenExpiredError(err)) {
      return handleRefreshFlow({ refreshToken });
    }
    // ✅ access 위조/이상은 복구 불가
    throw new AuthError("UNAUTHORIZED");
  }

  // ===== access 유효이면 기존 로직 =====
  const userId = payload.sub;
  if (!userId) throw new AuthError("UNAUTHORIZED");

  const user = await findUserById(userId);
  if (!user) throw new AuthError("UNAUTHORIZED");

  const tokenVersionInToken = payload.token_version ?? 0;
  const tokenVersionInDb = user.tokenVersion ?? 0;
  if (tokenVersionInToken !== tokenVersionInDb) throw new AuthError("UNAUTHORIZED");

  return {
    user: { id: user.id, email: user.email, role: user.role },
    slid: false,
  };
};
