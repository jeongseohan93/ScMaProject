const { UserRefreshToken } = require('../../models/sql');

async function createRefreshToken(payload, options = {}) {
  return UserRefreshToken.create(payload, options);
}

async function revokeRefreshToken(token, now) {
    return UserRefreshToken.update(
        { revokedAt: now },
        {
        where: {
            token,
            revokedAt: null,
        },
        }
    );
}

module.exports = {
  createRefreshToken,
  revokeRefreshToken,
};