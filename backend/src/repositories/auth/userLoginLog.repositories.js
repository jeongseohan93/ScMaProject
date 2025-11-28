const { UserLoginLog } = require('../../models/sql');

async function createLoginLog(payload, option = {}) {
    return UserLoginLog.create(payload, option);
}

module.exports = {
    createLoginLog,
}