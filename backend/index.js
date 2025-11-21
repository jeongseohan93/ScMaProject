require('dotenv').config();
const app = require('./src/app');

// DB 연결 함수
const { connectMySQL } = require('./src/config/mysql');
const connectMongo = require('./src/config/mongo');

const PORT = process.env.PORT || 3005;

app.listen(PORT, async () => {
  console.log(`${PORT}번 포트 대기중`);

  await connectMySQL();
  await connectMongo();
})