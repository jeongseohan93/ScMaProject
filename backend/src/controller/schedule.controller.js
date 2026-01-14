const { Schedule } = require("../models/sql");

const scheduleController = {};

// 일정 저장
scheduleController.addSchedule = async (req, res) => {
  try {
    const { title, date } = req.body;
    const userId = req.user.id; // ✅ UUID

    if (!title || !date) {
      return res.status(400).json({ success: false, message: "title, date가 필요합니다." });
    }

    const newSchedule = await Schedule.create({
      title,
      date,
      userId,
    });

    return res.status(200).json({ success: true, schedule: newSchedule });
  } catch (err) {
    console.error("일정 저장 에러", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};

// 일정 조회
scheduleController.getSchedule = async (req, res) => {
  try {
    const userId = req.user.id;

    const schedules = await Schedule.findAll({
      where: { userId },
      order: [["date", "ASC"]],
    });

    return res.status(200).json({ success: true, schedules });
  } catch (err) {
    console.error("일정 조회 에러", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};

// 일정 삭제
scheduleController.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user.id;

    if (!id) return res.status(400).json({ success: false, message: "id가 필요합니다." });

    // ✅ 본인 소유 일정만 삭제
    const result = await Schedule.destroy({
      where: { id: Number(id), userId },
    });

    if (result) return res.status(200).json({ success: true });
    return res.status(404).json({ success: false, message: "삭제할 일정을 찾지 못했습니다." });
  } catch (err) {
    console.error("일정 삭제 에러", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};

// 일정 수정
scheduleController.updateSchedule = async (req, res) => {
  try {
    const { id, title, date } = req.body;
    const userId = req.user.id;

    if (!id) return res.status(400).json({ success: false, message: "id가 필요합니다." });

    const updatePatch = {};
    if (title !== undefined) updatePatch.title = title;
    if (date !== undefined) updatePatch.date = date;

    const [updatedCount] = await Schedule.update(updatePatch, {
      where: { id: Number(id), userId }, // ✅ 본인 것만
    });

    if (updatedCount > 0) return res.status(200).json({ success: true });
    return res.status(404).json({ success: false, message: "수정할 대상을 찾지 못했습니다." });
  } catch (err) {
    console.error("수정 에러", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};

module.exports = scheduleController;
