const { User } = require("../../models/sql");

async function findUserByEmail(email) {
  return User.findOne({
    where: { email },
  });
}

/**
 * 로그인 실패 횟수 증가
 * - 반드시 instance update 사용
 */
async function increaseLoginFail(user, { now }, options = {}) {
  return user.update(
    {
      loginFailCount: (user.loginFailCount || 0) + 1,
      lastFailedLoginAt: now,
    },
    options
  );
}

/**
 * 로그인 성공 처리
 * - 여기서 User.update 쓰면 무조건 에러 남
 * - 반드시 user.update 써야 함
 */
async function markLoginSuccess(user, { now, loginIp }, options = {}) {
  return user.update(
    {
      loginFailCount: 0,
      lastFailedLoginAt: null,
      lastLoginAt: now,
      lastLoginIp: loginIp,
    },
    options
  );
}

module.exports = {
  findUserByEmail,
  increaseLoginFail,
  markLoginSuccess,
};
