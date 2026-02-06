const express = require('express');
const router = express.Router();
const { register } = require('../controller/auth/auth.register.controller');
const { login } = require('../controller/auth/auth.login.controller');
const authme  = require('../controller/auth/auth.myself.controller');

router.post('/register', register);

router.post('/login', login);

router.get('/me', authme);


module.exports = router;