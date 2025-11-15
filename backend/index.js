const dotenv = require('dotenv');
const express = require('express');
const { sequelize } = require('sequelize');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();
app.set( 'port' , process.env.PORT || 3005 );

// 시퀄라이즈 셋팅 들어갈 자리

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// JWT 토큰만 사용하는 경우 credentials: false
// 쿠키(세션) 기반 인증을 쓰면 credentials: true, 그리고 origin은 반드시 정확히 매칭해야 함
app.use(cors({
  origin: 'http://localhost:3000',  // 허용할 프론트엔드 주소 (React 개발 서버 도메인)
  methods: ['GET','POST','PUT','DELETE','OPTIONS' , 'PATCH' ], // 허용할 HTTP 메서드 목록
  allowedHeaders: ['Content-Type','Authorization'], // 클라이언트에서 사용할 수 있는 요청 헤더
  credentials: true // 인증 정보(쿠키, 헤더 등) 포함 여부 - false일 경우 쿠키 전송 안 됨
}));


app.listen(app.get('port'),() => {
    console.log(app.get('port'), '빈 포트에서 대기 중');
})