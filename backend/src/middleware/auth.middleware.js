// JWT 서명/검증 라이브러리
const jwt = require('jsonwebtoken');
// 토큰  해쉬(Refresh 원문 저장 금지)용
const crypto = require('crypto');

// 환경변수에서 시크릿 로드
// Access/Refresh는 보통 서로 다른 시크릿 사용
const ACCESS_SECRET = process.env.ACCESS_JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_JWT_SECRET;

// 쿠키 이름
const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";

// 운영 단계에서 권장(있으면 토큰 오용 방지에 도움)
// iss: 이 토큰 발급의 주체자
// aud: 이 토큰 사용의 주체자
const ISSUER = process.env.JWT_ISSUER || undefined;
const AUDIENCE = process.env.JWT_AUDIENCE || undefined;

/**
 * Authorization 헤더에서 Bearer 토큰만 추출
 * Authorization: Bearer <token>
 */
function extractBearer(req) {
  const h = req.headers.authorization;
  if (!h) return null;
  if (!h.startsWith("Bearer ")) return null;
  return h.slice(7); // "Bearer " 길이만큼 잘라서 토큰만 반환
}

/**
 * Access 토큰 추출 우선순위:
 * 1) Authorization: Bearer
 * 2) HttpOnly 쿠키 access_token
 */
function extractAccess(req) {
  return extractBearer(req) || (req.cookies && req.cookies[ACCESS_COOKIE]) || null;
}

/**
 * Refresh 토큰은 보통 HttpOnly 쿠키에서만 읽음
 * (보안상 JS에서 다루지 않는 것이 정석)
 */
function extractRefresh(req) {
  return (req.cookies && req.cookies[REFRESH_COOKIE]) || null;
}

/**
 * Refresh 토큰을 DB에 "원문 저장"하면 위험하므로,
 * 해시만 저장/비교한다.
 *
 * pepper(서버 전용 문자열)를 추가로 섞으면
 * DB가 유출되더라도 토큰 재현이 더 어려워짐.
 */
function hashToken(token) {
  const pepper = process.env.REFRESH_TOKEN_PEPPER || "";
  return crypto.createHash("sha256").update(token + pepper).digest("hex");
}

/**
 * Access 토큰 발급
 * - payload는 최소(sub, token_version, role(optional))로 유지
 * - 만료 시간 : 5분
 */
function signAccess({ userId, tokenVersion, role }) {
  if (!ACCESS_SECRET) throw new Error("MISSING_ACCESS_SECRET");

  const payload = { sub: userId, token_version: tokenVersion };
  if (role) payload.role = role;

  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: "5m",
    issuer: ISSUER,    // 있으면 검증 때도 동일하게 체크
    audience: AUDIENCE // 있으면 검증 때도 동일하게 체크
  });
}

/**
 * Refresh 토큰 발급
 * - jti: refresh 세션 ID (DB에 세션으로 저장해서 revoke/rotation에 사용)
 * - 만료 시간 30일
 */
function signRefresh({ userId, tokenVersion, jti }) {
  if (!REFRESH_SECRET) throw new Error("MISSING_REFRESH_SECRET");

  return jwt.sign(
    { sub: userId, token_version: tokenVersion, jti },
    REFRESH_SECRET,
    {
      expiresIn: "30d",
      issuer: ISSUER,
      audience: AUDIENCE,
    }
  );
}

/**
 * 보호 API용 미들웨어 (Access-only)
 * - Refresh는 절대 사용하지 않음
 * - Access가 유효하면 req.user에 유저정보를 붙이고 next()
 * - Access가 만료/위조면 401
 */
function requireAccess(req, res, next) {
    if(!ACCESS_SECRET) {
        return res.status(500).json({ ok: false, code: "MISSING_ACCESS_SECRET" })
    }

    const token = extractAccess(req);
    if ( !token ) return res.status(401).json({ ok: false, code: "NO_ACCESS_TOKEN" })
    
    try {
        const payload = jwt.verify(token, ACCESS_SECRET, {
            issuer: ISSUER,
            audience: AUDIENCE,
        });

        req.user = {
            id: payload.sub,
            tokenVersion: payload.token_version,
            role: payload.role,
        };

        return next();
    } catch (err) {
        // 만료/위조 분기
        if (err && err.name === "TokenExpiredError") {
            return res.status(401).json({ ok: false, code: "ACCESS_EXPIRED" });
        }
        return res.status(401).json({ ok: false, code: "INVALID_ACCESS" });
    }
}

module.exports = {
    requireAccess,
    extractAccess,
    extractRefresh,
    hashToken,
    signAccess,
    signRefresh
}


