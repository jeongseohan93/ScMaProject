const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: "http://localhost:3000",  // 프로트엔드 주소
  credentials: true,                // 쿠키 포함 요청 허용
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(errorHandler);

// 정적 파일
app.use("/upload", express.static("upload"));

// 라우터 등록
app.use('/auth', authRoutes);

// 에러 처리 미들웨어

module.exports = app;