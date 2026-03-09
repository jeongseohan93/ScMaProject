const { User, sequelize } = require('../../models/sql');

exports.findByEmail = async (email) => {
    return await User.findOne({
        where: {email},
    })
}
exports.createUser = async (userData) => {
    console.log('[BE] 레포지토리에 전달된 데이터:', userData)
    return await User.create({
    email: userData.email,
    password: userData.password,
    name: userData.name,
    nickname: userData.nickname || null,
    phoneNumber: userData.phoneNumber || null,
    birth: userData.birth || null,
    gender: userData.gender === '' ? null : userData.gender, 
    signupIp: userData.signIp || userData.signupIp, 
    role: userData.role || 'USER',
    status: userData.status || 'ACTIVE',
    preferredLanguage: userData.preferredLanguage || 'ko',
    timeZone: userData.timeZone || 'Asia/Seoul',
    lastLoginAt: userData.lastLoginAt || new Date(),
  });
} 

exports.increaseLoginFail = async (userId, {transaction} = {}) => {
    return await User.update(
        { 
            loginFailCount: sequelize.literal('login_fail_count + 1'),
            lastFailedLoginAt: new Date(), 
        },
        { 
            where: { id: userId },
            transaction,
        }
    );
};

exports.markLoginSuccess = (user, {now, loginIp}, options = {}) => {
    return user.update(
        {
            loginFailCount: 0,
            lastFailedLoginAt: null,
            lastLoginAt: now,
            lastLoginIp: loginIp,
        },
        options
    )
}

exports.findUserById = (id) => {
    return User.findByPk(id);
}