const express = require('express');
const router = express.Router();

const scheduleController = require('../controller/schedule.controller');
const { requireAccess } = require("../middleware/auth.middleware");

router.get("/schedule", requireAccess, scheduleController.getSchedule);
router.post("/schedule/add", requireAccess, scheduleController.addSchedule);
router.post("/schedule/update", requireAccess, scheduleController.updateSchedule);
router.delete("/schedule/delete", requireAccess, scheduleController.deleteSchedule);

module.exports = router;