// config/mysql.js
const { Sequelize } = require('sequelize');

/**
 * Sequelize MySQL 인스턴스
 *
 * @type {Sequelize}
 * @description
 * 환경 변수 기반으로 MySQL DB 연결 설정을 생성한다.
 * `logging: false` 옵션은 SQL 쿼리 로그를 출력하지 않도록 한다.
 */
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Database name
  process.env.DB_USER,     // Username
  process.env.DB_PASS,     // Password
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

/**
 * MySQL 연결을 시도하고 성공 여부를 출력한다.
 *
 * @async
 * @function connectMySQL
 * @returns {Promise<void>}
 * @description
 * `sequelize.authenticate()`를 호출하여 DB 연결이 실제로 가능한지 테스트한다.
 * 서버 시작 시 단 한 번 실행되도록 설계된 함수.
 */
async function connectMySQL() {
  try {
    await sequelize.authenticate();
    console.log('MySQL 연결 성공');
  } catch (err) {
    console.error('MySQL 연결 실패:', err);
  }
}

module.exports = {
  /**
   * Sequelize 인스턴스 (DB 모델 정의 시 사용)
   */
  sequelize,

  /**
   * Sequelize 클래스 (DataTypes 등 사용 시 필요)
   */
  Sequelize,

  /**
   * MySQL 연결 테스트 함수
   */
  connectMySQL,
};
