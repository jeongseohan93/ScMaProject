const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const authRouter = require('./routes/auth.routes');
const chatRouter = require('./routes/chat.routes');


const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan("dev"));
app.set('trust proxy', 1);

// 에러 처리 미들웨어

app.use('/api', authRouter );
app.use('/api/chat', chatRouter);

module.exports = app;