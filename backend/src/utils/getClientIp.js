
const getClientIp = (req) => {
    let ip = req.headers["x-forwarded-for"]?.split(",")[0] ||
             req.connection?.remoteAddress ||
             req.socket?.remoteAddress ||
             req.ip;

    // IPv6 형태(::ffff:)를 제거하고 순수 IPv4만 추출
    if (ip && ip.includes('::ffff:')) {
        ip = ip.split(':').pop();
    }
    
    return ip === '::1' ? '127.0.0.1' : ip;
}

module.exports = getClientIp;