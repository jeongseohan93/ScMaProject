const path = require('path');
const fs = require('fs');
const { sequelize, Sequelize } = require('../../config/mysql');
const sqldb = {};

sqldb.sequelize = sequelize;
sqldb.Sequelize = Sequelize;

fs.readdirSync(__dirname).filter((file) => file !== 'index.js' && file.endsWith('.js')).forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    sqldb[model.name] = model;
})

// associate() 자동 실행 (관계 설정용)
Object.keys(sqldb).forEach((modelName) => {
  if (sqldb[modelName].associate) {
    sqldb[modelName].associate(sqldb);
  }
});

module.exports = sqldb;