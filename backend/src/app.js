const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
//const routes = require('./routes');

const app = express();

app.use(cors({
  origin: "http://localhost:3000",  // 프로트엔드 주소
  credentials: true,                // 쿠키 포함 요청 허용
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan("dev"));

// 정적 파일
app.use("/upload", express.static("upload"));

// 라우터 등록
// 테스트용 /auth/me (나중에 JWT 검증 넣으면 됨)
app.get("/auth/me", (req, res) => {
  // TODO: 나중에 쿠키 꺼내서 JWT 검증할 자리
  // 지금은 무조건 로그인 된 걸로 가정
  return res.json({
    id: "test-id",
    email: "test@example.com",
    nickname: "테스트유저",
  });
});

// 에러 처리 미들웨어

module.exports = app;