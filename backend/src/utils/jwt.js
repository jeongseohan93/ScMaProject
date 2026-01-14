const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const ACCESS_SECRET = process.env.ACCESS_JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_JWT_SECRET;

// 운영 권장(있으면 넣고, 없으면 제거 가능)
const ISSUER = process.env.JWT_ISSUER || undefined;
const AUDIENCE = process.env.JWT_AUDIENCE || undefined;

/**
 * Refresh 세션 식별자(jti) 생성
 */
function newJti() {
  // Node 22 OK
  return crypto.randomUUID();
}

/**
 * Refresh 원문 저장 금지: 해시로 저장/비교
 */
function hashToken(token) {
  const pepper = process.env.REFRESH_TOKEN_PEPPER || "";
  return crypto.createHash("sha256").update(token + pepper).digest("hex");
}

function signAccessToken({ userId, role, tokenVersion }) {
  if (!ACCESS_SECRET) throw new Error("MISSING_ACCESS_SECRET");

  return jwt.sign(
    { sub: userId, role, token_version: tokenVersion },
    ACCESS_SECRET,
    { expiresIn: "5m", issuer: ISSUER, audience: AUDIENCE }
  );
}

function signRefreshToken({ userId, tokenVersion, jti }) {
  if (!REFRESH_SECRET) throw new Error("MISSING_REFRESH_SECRET");
  if (!jti) throw new Error("MISSING_JTI");

  return jwt.sign(
    { sub: userId, token_version: tokenVersion, jti },
    REFRESH_SECRET,
    { expiresIn: "30d", issuer: ISSUER, audience: AUDIENCE }
  );
}

function verifyAccessToken(token) {
  if (!ACCESS_SECRET) throw new Error("MISSING_ACCESS_SECRET");
  return jwt.verify(token, ACCESS_SECRET, { issuer: ISSUER, audience: AUDIENCE });
}

function verifyRefreshToken(token) {
  if (!REFRESH_SECRET) throw new Error("MISSING_REFRESH_SECRET");
  return jwt.verify(token, REFRESH_SECRET, { issuer: ISSUER, audience: AUDIENCE });
}

/**
 * (기존 이름 호환)
 * 프로젝트 다른 파일들이 verifyAccess/verifyRefresh를 쓰면 깨질 수 있으니 alias도 같이 둠
 */
const verifyAccess = verifyAccessToken;
const verifyRefresh = verifyRefreshToken;

module.exports = {
  newJti,
  hashToken,

  signAccessToken,
  signRefreshToken,

  verifyAccessToken,
  verifyRefreshToken,

  // alias (기존 코드 호환)
  verifyAccess,
  verifyRefresh,
};
