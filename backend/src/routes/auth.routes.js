const express = require('express');
const router = express.Router();
const authCotroller = require('../controller/auth.controller');

router.post('/auth/register', authCotroller.register);

router.post('/auth/login', authCotroller.login);

router.post('/auth/logout', authCotroller.logout);

module.exports = router;