const AuthError = require('../services/errors/AuthError');

function errorHandler(err, req, res, next) {
    
    if( err instanceof AuthError) {
        return res.status(err.statusCode || 401).json({
            success: false,
            message: err.message,
        });
    }

    console.error("UNHANDLED ERROR:", err);

    return res.status(500).json({
        success: false,
        message: "서버 내부 오류 발생",
    });
}

module.exports = errorHandler;