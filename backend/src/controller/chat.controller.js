const { Op } = require("sequelize");
const { Chat, Friend, User, sequelize } = require("../models/sql"); // ✅ MySQL models index로 통일

const chatController = {};

/**
 * ✅ 읽음 처리
 * PUT /chat/read
 * body: { friendId }
 * myId는 토큰(req.user.id)에서 가져옴
 */
chatController.markAsRead = async (req, res) => {
  try {
    const myId = req.user.id;
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({ success: false, message: "friendId required" });
    }

    await Chat.update(
      { isRead: true },
      {
        where: {
          senderId: friendId,
          receiverId: myId,
          isRead: false,
        },
      }
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("읽음 처리 에러", err);
    return res.status(500).json({ success: false });
  }
};

/**
 * ✅ 채팅 리스트
 * GET /chat/list
 * myId는 토큰(req.user.id)에서 가져옴
 */
chatController.getChatList = async (req, res) => {
  try {
    const myId = req.user.id;

    // NOTE: 테이블명/컬럼명은 네 실제 schema에 맞춰야 함
    const [results] = await sequelize.query(
      `
      SELECT 
        m1.senderId,
        m1.receiverId,
        m1.message as text,
        m1.createdAt,
        CASE WHEN m1.senderId = :myId THEN m1.receiverId ELSE m1.senderId END as friendId,
        u.nickname as friendNickname,
        (
          SELECT COUNT(*)
          FROM Chats
          WHERE senderId = (CASE WHEN m1.senderId = :myId THEN m1.receiverId ELSE m1.senderId END)
            AND receiverId = :myId
            AND isRead = false
        ) as unreadCount
      FROM Chats m1
      INNER JOIN (
        SELECT 
          LEAST(senderId, receiverId) as p1,
          GREATEST(senderId, receiverId) as p2,
          MAX(createdAt) as max_date
        FROM Chats
        WHERE senderId = :myId OR receiverId = :myId
        GROUP BY p1, p2
      ) m2 
        ON LEAST(m1.senderId, m1.receiverId) = m2.p1
       AND GREATEST(m1.senderId, m1.receiverId) = m2.p2
       AND m1.createdAt = m2.max_date
      LEFT JOIN Users u 
        ON u.id = (CASE WHEN m1.senderId = :myId THEN m1.receiverId ELSE m1.senderId END) -- ✅ userId -> id
      ORDER BY m1.createdAt DESC
      `,
      { replacements: { myId } }
    );

    return res.status(200).json({ success: true, chatList: results });
  } catch (err) {
    console.error("채팅목록 에러", err);
    return res.status(500).json({ success: false });
  }
};

/**
 * ✅ 채팅 히스토리
 * GET /chat/history?friendId=...
 * myId는 토큰(req.user.id)에서 가져옴
 */
chatController.getChatHistory = async (req, res) => {
  try {
    const myId = req.user.id;
    const { friendId } = req.query;

    if (!friendId) {
      return res.status(400).json({ success: false, message: "friendId required" });
    }

    const history = await Chat.findAll({
      where: {
        [Op.or]: [
          { senderId: myId, receiverId: friendId },
          { senderId: friendId, receiverId: myId },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    const friendUser = await User.findByPk(friendId, {
      attributes: ["nickname"],
    });

    const friendCheck = await Friend.findOne({
      where: { userId: myId, friendId },
    });

    return res.status(200).json({
      success: true,
      history,
      isFriend: !!friendCheck,
      friendNickname: friendUser ? friendUser.nickname : friendId,
    });
  } catch (err) {
    console.error("History API 에러 상세:", err);
    return res.status(500).json({ success: false, message: "채팅 로딩 실패" });
  }
};

/**
 * ✅ 채팅 텍스트에서 일정 추출 (로컬 룰 기반)
 * POST /chat/analyze
 * body: { text }
 */
chatController.analyzeChat = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: "텍스트가 없습니다." });
    }

    const today = new Date();
    let targetDate = new Date();
    let title = text;

    if (text.includes("내일")) {
      targetDate.setDate(today.getDate() + 1);
      title = text.replace("내일", "").trim();
    } else if (text.includes("오늘")) {
      targetDate = today;
      title = text.replace("오늘", "").trim();
    } else if (text.includes("모레") || text.includes("이틀뒤")) {
      targetDate.setDate(today.getDate() + 2);
      title = text.replace(/모레|이틀뒤/, "").trim();
    } else if (text.includes("사흘뒤") || text.includes("3일뒤")) {
      targetDate.setDate(today.getDate() + 3);
      title = text.replace(/사흘뒤|3일뒤/, "").trim();
    } else if (text.includes("나흘뒤") || text.includes("4일뒤")) {
      targetDate.setDate(today.getDate() + 4);
      title = text.replace(/나흘뒤|4일뒤/, "").trim();
    } else if (text.includes("다음주")) {
      targetDate.setDate(today.getDate() + 7);
      title = text.replace("다음주", "").trim();
    } else {
      const match = text.match(/(\d+)일뒤/);
      if (match) {
        targetDate.setDate(today.getDate() + parseInt(match[1], 10));
        title = text.replace(match[0], "").trim();
      }
    }

    const formattedDate = targetDate.toISOString().split("T")[0];

    return res.status(200).json({
      success: true,
      extractedData: { title: title || "일정이 있습니다.", date: formattedDate },
    });
  } catch (err) {
    console.error("채팅 분석 에러", err);
    return res.status(500).json({ success: false, message: "서버 분석 오류" });
  }
};

module.exports = chatController;
