require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");

// DB 연결 함수
const { connectMySQL } = require("./src/config/mysql");
const connectMongo = require("./src/config/mongo");
const sqldb = require('./src/models/sql');

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

app.set('io', io);

io.on("connection", (socket) => {
  console.log(`✅ 새로운 유저 접속: ${socket.id}`);

  // 1. 방 입장 로직 (roomId는 이 안에서만 쓸 수 있습니다)
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`🚪 유저 [${socket.id}] 가 [${roomId}] 방에 들어옴`);
  });

  // 2. 접속 종료 로직 (반드시 io.on의 { } 안으로 이동!)
  socket.on("disconnect", () => {
    console.log(`❌ 유저 접속 종료: ${socket.id}`);
  });
});

// 💡 여기에 있던 socket.on("disconnect")는 삭제하세요!

// 4) server.listen 으로 실행
server.listen(PORT, async () => {
  console.log(`🚀 ${PORT}번 포트 대기중`);

  await connectMySQL();
  // 주의: force: true는 테이블을 매번 삭제하고 새로 만듭니다. 테스트 끝나면 빼주세요!
  await sqldb.sequelize.sync({ force: true }); 

  await sqldb.Room.create({
    id: 1,
    type: 'DIRECT',
    lastMessage: '테스트 방 생성'
  });
  console.log("✅ 테스트용 1번 채팅방이 생성되었습니다.");
  await connectMongo();
});