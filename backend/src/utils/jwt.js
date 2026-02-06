// src/utils/jwt.js
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const ACCESS_SECRET = process.env.ACCESS_JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_JWT_SECRET;

const ISSUER = process.env.JWT_ISSUER || undefined;
const AUDIENCE = process.env.JWT_AUDIENCE || undefined;

// ===== 정책 상수 =====
const ACCESS_EXPIRES_IN = "5m";
const REFRESH_EXPIRES_IN = "30d";

const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const REFRESH_ROTATE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

// ===== helpers =====
function newJti() {
  return crypto.randomUUID();
}

function hashToken(token) {
  const pepper = process.env.REFRESH_TOKEN_PEPPER || "";
  return crypto.createHash("sha256").update(token + pepper).digest("hex");
}

// ===== sign =====
function signAccessToken({ userId, role, tokenVersion }) {
  if (!ACCESS_SECRET) throw new Error("MISSING_ACCESS_SECRET");

  return jwt.sign(
    { sub: userId, role, token_version: tokenVersion },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN, issuer: ISSUER, audience: AUDIENCE }
  );
}

function signRefreshToken({ userId, tokenVersion, jti }) {
  if (!REFRESH_SECRET) throw new Error("MISSING_REFRESH_SECRET");
  if (!jti) throw new Error("MISSING_JTI");

  return jwt.sign(
    { sub: userId, token_version: tokenVersion, jti },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN, issuer: ISSUER, audience: AUDIENCE }
  );
}

// ===== verify =====
function verifyAccessToken(token) {
  if (!ACCESS_SECRET) throw new Error("MISSING_ACCESS_SECRET");
  return jwt.verify(token, ACCESS_SECRET, { issuer: ISSUER, audience: AUDIENCE });
}

function verifyRefreshToken(token) {
  if (!REFRESH_SECRET) throw new Error("MISSING_REFRESH_SECRET");
  return jwt.verify(token, REFRESH_SECRET, { issuer: ISSUER, audience: AUDIENCE });
}

// ===== exports (호환 + 신규 둘 다) =====
module.exports = {
  newJti,
  hashToken,

  // 🔴 기존 코드 호환용 (login.service.js 등)
  signAccessToken,
  signRefreshToken,

  // 🟢 신규 권장 alias
  issueAccessToken: signAccessToken,
  issueRefreshToken: signRefreshToken,

  verifyAccessToken,
  verifyRefreshToken,

  REFRESH_TTL_MS,
  REFRESH_ROTATE_WINDOW_MS,
};
