require("dotenv").config(); // 환경 변수(.env) 로드
const http = require("http");
const { Server } = require("socket.io");

const app = require("./src/app"); // Express 설정 가져오기

const { connectMySQL } = require('./src/config/mysql');
const sqldb = require('./src/models/sql');

const PORT = process.env.PORT || 3005; // 서버 포트 설정 (기본 3005)

// HTTP 서버 생성 (Expess를 소켓과 공유가히 위해 필요)
const server = http.createServer(app);

// Socket.io　설정 및 CORS 허용
const io = new Server(server, {
   cors: {
    origin: "http://localhost:3000", // 프론트엔드 주소 허용
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Express 앱 내 어디서든 소켓을 쓸 수 있게 등록
app.set('io', io);

// 소켓 연결 이벤트 핸들러
io.on("connection", (socket) => {
  console.log(`✅ 새로운 유저 접속: ${socket.id}`);

  // 특정 채팅방/알림방 입장 로직
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`🚪 유저 [${socket.id}] 가 [${roomId}] 방에 들어옴`);
  });

  // 유저가 브라우저를 끄거나 나갔을 때 실행
  socket.on("disconnect", () => {
    console.log(`❌ 유저 접속 종료: ${socket.id}`);
  });
});

// 서버 실행 및 DB연결
server.listen(PORT, async () => {
  console.log(`${PORT}번 포트 대기중`);
  try {
    // MySQL 연결 시도
    await connectMySQL();
    
    // Sequelize 모델을 DB 테이블과 동기화 (없으면 생성함)
    await sqldb.sequelize.sync();
  } catch (error) {
    console.error("❌ 서버 시작 중 오류 발생:", error);
  }
});