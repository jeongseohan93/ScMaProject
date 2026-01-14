const { Schedule } = require("../models/sql"); // 🔴 네 실제 mysql models 경로로 맞춰라

const scheduleListController = {};

/**
 * GET /schedule-list
 * - 로그인한 유저의 전체 일정 조회
 * - 날짜 오름차순 정렬
 */
scheduleListController.getScheduleList = async (req, res) => {
  try {
    // ✅ 인증된 유저 ID (Access Token → middleware)
    const userId = req.user.id;

    const schedules = await Schedule.findAll({
      where: { userId },
      order: [["date", "ASC"], ["id", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      schedules,
    });
  } catch (err) {
    console.error("일정 리스트 조회 에러", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류",
    });
  }
};

module.exports = scheduleListController;
