// config/redis.js
const Redis = require("ioredis");

/**
 * Redis 클라이언트 인스턴스
 *
 * @type {Redis}
 * @description
 * ioredis를 사용하여 Redis 서버와 연결한다.
 * 환경변수(REDIS_HOST, REDIS_PORT)를 기반으로 설정되며,
 * 서버에서 캐싱・세션・Rate Limiting 등에 활용 가능하다.
 */
const redis = new Redis({
  host: process.env.REDIS_HOST, // Redis 서버 호스트
  port: process.env.REDIS_PORT, // Redis 포트
});

/**
 * Redis 연결 성공 이벤트
 * @event connect
 */
redis.on("connect", () => console.log("Redis 연결 성공"));

/**
 * Redis 연결 실패 이벤트
 * @event error
 * @param {Error} err - 발생한 에러 객체
 */
redis.on("error", (err) => console.error("Redis 연결 실패:", err));

module.exports = redis;
