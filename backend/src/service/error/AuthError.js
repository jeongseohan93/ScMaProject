class AuthError extends Error {
    /**
     * AuthError 생성자
     * 
     * @param {string} message
     * - 에러의 "의미 코드"
     * - 프론트/로그에서 부기 기준으로 사용
     * - 예 : "NO_REFRESH", "INVALID_ACCESS", "FORBIDDEN"
     * 
     * @param {number} [statusCode=401]
     * - HTTP 상태 코드
     * - 기본값 401 (Unauthorized)
     * - 403 등으로 명시적으로 변경 가능
     */
    constructor(message, statusCode = 401) {
        super(message);

        /**
         * 에러 타입 식별용 이름
         * - instanceof AuhError
         * - err.name === "AuthError"
         */
        this.name = "AuthError";

        /**
         * HTTP 응답 상태 코드
         * - Express 글로벌 에러 핸들러에서 사용
         */
        this.statusCode = statusCode;
  }
}

module.exports = AuthError;

/**
 * AuthError
 * 
 * 1. 인증/인가 실패는 "버그"가 아니라 "의도된 흐름"
 *  - 토큰 만료, 권한 없음, 세션 만료는 정상적인 상태
 *  - 일반 Error(500)로 처리하면 의미가 왜곡
 * 
 * 2. 인증 에러마다 HTTP 상태 코드가 다르다
 *  - 401 : 인증 필요/ 토큰 만료
 *  - 403 : 인증은 됐지만 권한 없음
 *  -> 에러 객체에 상태 코드를 포함 시켜야 한다
 * 
 * 3. 문자열 비교 기반 에러 처리를 피하기 위함
 *  - err.message === "NO_REFRESH" 같은 패턴은 유지보수 지옥
 *  - 타입(instanceof)으로 분기하는 것이 안전
 * 
 * 4. 인증 로직과 응답 로직을 분리하기 위함
 *  - 미들웨어/서비스 레이어에서는 throw만 한다
 *  - Express 에러 핸들러가 응답을 책임진다
 * 
 * 5. 로그/모니터링에서 "인증 실패"를 명확히 구분하기 위함
 *  - stack trace, Sentry, APM에서 name=AuthError로 필터 가능
 * 
 * 6. 언제 사용
 *  - Access Token　검증 실패
 *  - Refresh Token 없음 / 만료 / 재사용 탐지
 *  - 
 */