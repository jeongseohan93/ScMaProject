const { UserRefreshToken } = require("../../models/sql");

exports.createRefreshSession = async (data, options = {}) => {
  return UserRefreshToken.create(
    {
      userId: data.userId,
      jti: data.jti,
      tokenHash: data.tokenHash,
      expiresAt: data.expiresAt,
      revokedAt: data.revokedAt ?? null,
      replacedByJti: data.replacedByJti ?? null,
      tokenVersionSnapshot: data.tokenVersionSnapshot ?? 0,
      ip: data.ip ?? null,
      userAgent: data.userAgent ?? null,
      deviceType: data.deviceType ?? null,
    },
    options
  );
};

exports.findSessionByUserAndJti = async ({ userId, jti }) => {
  return UserRefreshToken.findOne({ where: { userId, jti } });
};

exports.revokeSession = async ({ userId, jti, now }) => {
  return UserRefreshToken.update(
    { revokedAt: now },
    { where: { userId, jti, revokedAt: null } }
  );
};

// 로테이션 시: 기존 세션 revoke + replacedByJti 기록
exports.rotateSession = async ({ userId, oldJti, newJti, now }) => {
  return UserRefreshToken.update(
    { revokedAt: now, replacedByJti: newJti },
    { where: { userId, jti: oldJti, revokedAt: null } }
  );
};

// 재사용 탐지 시 강한 대응(선택): 해당 유저 세션 전부 revoke
exports.revokeAllUserSessions = async ({ userId, now }) => {
  return UserRefreshToken.update(
    { revokedAt: now },
    { where: { userId, revokedAt: null } }
  );
};
