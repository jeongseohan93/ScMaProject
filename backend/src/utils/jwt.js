// backend/utils/jwt.js
const jwt = require("jsonwebtoken");

const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "30d";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  console.warn(
    "[WARN] JWT_ACCESS_SECRET / JWT_REFRESH_SECRET 환경변수가 설정되지 않았습니다."
  );
}

exports.signAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
};

exports.signRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
};

// Access Token 검증
exports.verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (err) {
    // 여기서 바로 AuthError로 바꿀지, 그냥 throw 할지는 선택사항
    // 일단은 원본 에러 던지고, 미들웨어에서 AuthError로 감싸는 패턴이 더 깔끔함
    throw err;
  }
};

// Refresh Token 검증 (나중에 /auth/refresh 같은 곳에서 사용)
exports.verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (err) {
    throw err;
  }
};