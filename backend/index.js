require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");

// DB 연결 함수
const { connectMySQL } = require("./src/config/mysql");
const connectMongo = require("./src/config/mongo");
const sqldb = require("./src/models/sql");

const PORT = process.env.PORT || 3005;

// 1) app이 아니라 http server를 만든다
const server = http.createServer(app);

// 2) socket.io 를 server에 붙인다

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 3) 소켓 이벤트 등록
io.on("connection", (socket) => {
  console.log("✅ 새로운 유저 접속 ID:", socket.id);

  socket.on("send_message", (data) => {
    console.log("📩 메세지 받음:", data);
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ 유저 나감:", socket.id);
  });
});

// 4) server.listen 으로 실행
server.listen(PORT, async () => {
  console.log(`${PORT}번 포트 대기중`);

  await connectMySQL();
  await sqldb.sequelize.sync();
  await connectMongo();
});
