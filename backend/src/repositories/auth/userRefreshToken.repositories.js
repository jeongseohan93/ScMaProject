const { hashToken } = require('../../utils/jwt');
const { UserRefreshToken, sequelize } = require("../../models/sql");

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

exports.revokeSession = async ({ userId, jti, now }) => {
  return UserRefreshToken.update(
    { revokedAt: now },
    { where: { userId, jti, revokedAt: null } }
  );
};

exports.findRefreshSessionByJti = async (jti) => {
  
  if(!jti) return null;

  return UserRefreshToken.findOne({
    where: {
      jti,
    },
  })
}

exports.isRefreshSessionActive = (session) => {
  if (!session) return false;
  if (session.revokedAt) return false;
  if (session.expiresAt && new Date(session.expiresAt) <= new Date()) return false;
  return true;
}

exports.isRefreshTokenHashMatch = async ( refreshToken, tokenHashInDb) => {
  if (!refreshToken || !tokenHashInDb) return false;
  return hashToken(refreshToken) === tokenHashInDb;
}

exports.rotateRefreshSession = async ({
  oldJti,
  userId,
  newJti,
  newRefreshToken,
  newExpiresAt,
}) => {
  return sequelize.transaction(async (t) => {
    await UserRefreshToken.update(
      { revokedAt: new Date() },
      { where: { jti: oldJti, userId }, transaction: t }
    );

    await UserRefreshToken.create(
      {
        userId,
        jti: newJti,
        tokenHash: hashToken(newRefreshToken),
        expiresAt: newExpiresAt,
        revokedAt: null,
      },
      { transaction: t }
    );
  });
};
