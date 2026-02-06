/**
 * 클라이언트의 실제 IP 주소를 추출하는 유틸리티 함수
 * 
 * - 필요 이유
 *    Express의 req.ip 값은 프로시/로드벨런서 뒤에서는 서버 IP　또는 프로스 IP가 될 수 있음
 *    인증, 보안 로그, 세션 관리, 이상 징후 탐시 시 "실제 클라이언트 IP"가 필요
 * 
 * - 동장 원리
 *    프록시 환경일수록 상위 헤더를 우선 신뢰
 *    직접 연결 환경(local/dev）에서는 소켓 정보 사용
 * 
 * - 주의 사항
 *    x-forwarded-for 헤더는 위조 가능
 *    반드시 신뢰 가능한 프록시(Nginsx, ELB등) 환경에서만 이 헤더를 의미 있는 값으로 사용해야 함
 * 
 * @param {import("express").Request} req
 *  - Express 요청 객체
 *
 * @returns {string | undefined}
 *  - 추출된 클라이언트 IP 주소
 *  - 어떤 정보도 없을 경우 undefined
 */

function getClientIp(req) {
    return (
        /**
         * 1순위 : x-forwarded-for
         * - 프록시 / 로드벨러서를 거친 경우
         * - 여러 IP가 있을 수 있으며, 가장 앞이 원 클라이언트
         */
        
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        /**
         * 2순위: connection.remoteAddress
         * - Node.js 저수준 TCP 연결 정보
         * - 프록시 없는 환경에서 주로 사용
         */

        req.connection?.remoteAddress ||
        /**
         * 3순위: socket.remoteAddress
         * - connection의 alias (Node.js 버전에 따라 사용)
         */

        req.socket?.remoteAddress ||
        /**
         * 4순위: req.ip
         * - Express가 계산한 IP
         * - trust proxy 설정에 따라 값이 달라질 수 있음
         */
        req.ip
    );
}

module.exports = getClientIp;