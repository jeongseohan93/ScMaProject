const express = require('express');
const router = express.Router();

const scheduleListController = require('../controller/scheduleList.controller');
const { requireAccess } = require("../middleware/auth.middleware");

router.get("/schedule-list", requireAccess, scheduleListController.getScheduleList);



module.exports = router;