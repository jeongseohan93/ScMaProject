// config/mongo.js
const mongoose = require('mongoose');

/**
 * MongoDB 연결 함수
 *
 * @async
 * @function connectMongo
 * @returns {Promise<void>}
 * @description
 * mongoose를 사용하여 MongoDB와 연결한다.
 * 환경변수 MONGO_URI를 통해 연결 문자열을 가져오며,
 * 서버 실행 시 단 한 번 호출되어 연결 상태를 확인한다.
 */
async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB 연결 성공");
  } catch (err) {
    console.error("MongoDB 연결 실패:", err);
  }
}

module.exports = connectMongo;
