const path = require('path');
const fs = require('fs');
const { sequelize, Sequelize } = require('../../config/mysql');
const sqldb = {};

// Sequelize 인스턴스 공유
sqldb.sequelize = sequelize;
sqldb.Sequelize = Sequelize;

// 📌 models 폴더 안에 있는 .js 파일 자동 로딩 (index.js 제외)
fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js' && file.endsWith('.js'))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    sqldb[model.name] = model;
  });

// 📌 associate() 자동 실행 (관계 설정용)
Object.keys(sqldb).forEach((modelName) => {
  if (sqldb[modelName].associate) {
    sqldb[modelName].associate(sqldb);
  }
});

module.exports = sqldb;
