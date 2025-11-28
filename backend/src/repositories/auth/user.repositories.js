const { User } = require('../../models/sql');

async function findUserByEmail(email) {
    return User.findOne({
        where: {email},
    });
}

async function increaseLoginFail(user, {now}, option = {}) {
    return User.update(
        {
            loginFailCount: (user.loginFailCount || 0) + 1,
            lastFailedLoginAt: now,
        },
        option
    );
}

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