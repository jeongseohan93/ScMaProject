// backend/controllers/auth.controller.js
const bcrypt = require('bcrypt');  // ← 네가 원하는 bcrypt 유지!
const { User } = require('../models/sql');

exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      nickname,
      phoneNumber,
      birth,
      gender,
      preferredLanguage,
      timeZone,
    } = req.body;

    const signupIp =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip;

    // 1) 필수값 체크
    if (!email || !password || !name) {
      return res.status(400).json({ message: '필수 값(email, password, name)이 누락되었습니다.' });
    }

    // 2) 중복 이메일 체크
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
    }

    // 3) 비밀번호 해시
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4) DB Insert
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      nickname: nickname || null,
      phoneNumber: phoneNumber || null,
      birth: birth || null,
      gender: gender || null,
      preferredLanguage: preferredLanguage || 'ko',
      timeZone: timeZone || 'Asia/Seoul',
      signupIp,               // ← ★ 여기가 핵심!! (camelCase로 넣어야 DB 컬럼 signup_ip로 들어감)
    });

    // 5) 응답
    return res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
      },
    });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({
      message: '서버 오류가 발생했습니다.',
    });
  }
};

