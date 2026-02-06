const { User } = require("../../models/sql");

/**
 * ー 이메일 사용자 조회
 * 
 * @description
 *  - User 테이블에서 email　기준으로 단일 사용자 조회
 *  - 조회하지 않으면 null 반환
 *
 * @param {string} email 
 * @returns {Promise<User|null>} 조회된 사용자 엔티티 또는 null
 */
async function findUserByEmail (email) {
    return User.findOne({
        where: { email },
    });
}

async function increaseLoginFail(user, { now }, options = {}) {
  return user.update(
    {
      loginFailCount: (user.loginFailCount ?? 0) + 1,
      lastLoginFailAt: now,
    },
    {
      transaction: options.transaction,
    }
  );
}

async function markLoginSuccess(user, {now, loginIp}, options = {}) {
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

async function findUserById(id){
  return User.findByPk(id);
} 

module.exports = {
    findUserByEmail,
    increaseLoginFail,
    findUserById,
    markLoginSuccess,
}