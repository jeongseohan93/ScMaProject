require("dotenv").config();
const http = require("http");
const app = require("./src/app");

const PORT = process.env.PORT || 3005;

const server = http.createServer(app);

// 4) server.listen 으로 실행
server.listen(PORT, async () => {
  console.log(`${PORT}번 포트 대기중`);
});