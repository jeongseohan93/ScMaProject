const { UserLoginLog } = require('../../models/sql');

exports.createLoginLog = (payload, option ={}) => {
    return UserLoginLog.create(payload, option);
}