const { User, Friend } = require("../models/sql"); // ✅ 네 mysql models index로 통일 (경로는 너 프로젝트에 맞춰)

const userController = {};

/**
 * GET /user/search?nickname=...
 * - 내 id는 req.user.id (토큰에서 나온 값)
 * - 닉네임으로 유저 찾고, 이미 친구인지 확인
 */
userController.searchUser = async (req, res) => {
  try {
    const myId = req.user.id;
    const { nickname } = req.query;

    if (!nickname) {
      return res.status(400).json({ success: false, message: "nickname required" });
    }

    // ✅ User PK가 id인 전제
    const user = await User.findOne({
      where: { nickname },
      attributes: ["id", "nickname"], // ✅ userId -> id
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }

    const isFriend = await Friend.findOne({
      where: { userId: myId, friendId: user.id },
    });

    return res.status(200).json({
      success: true,
      user: { id: user.id, nickname: user.nickname },
      isFriend: !!isFriend,
    });
  } catch (err) {
    console.error("검색 에러", err);
    return res.status(500).json({ success: false, message: "서버 통신 오류" });
  }
};

/**
 * POST /user/add-friend
 * body: { friendId }
 */
userController.addFriend = async (req, res) => {
  try {
    const myId = req.user.id;
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({ success: false, message: "friendId required" });
    }

    if (myId === friendId) {
      return res.status(400).json({ success: false, message: "본인은 추가할 수 없습니다." });
    }

    const exFriend = await Friend.findOne({ where: { userId: myId, friendId } });
    if (exFriend) {
      return res.status(400).json({ success: false, message: "이미 친구로 추가 되어 있습니다." });
    }

    await Friend.create({ userId: myId, friendId });
    return res.status(200).json({ success: true, message: "친구 추가 성공!" });
  } catch (err) {
    console.error("친구 추가 에러", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};

/**
 * GET /user/friends
 * - 내 id는 req.user.id
 * - 친구 목록 + friendInfo join
 */
userController.getFriends = async (req, res) => {
  try {
    const myId = req.user.id;

    const friends = await Friend.findAll({
      where: { userId: myId },
      include: [
        {
          model: User,
          as: "friendInfo",
          attributes: ["id", "nickname"], // ✅ userId -> id
        },
      ],
    });

    return res.status(200).json({ success: true, friends });
  } catch (err) {
    console.error("친구 목록 불러오기 에러", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};

/**
 * DELETE /user/delete-friend
 * body: { friendId }
 */
userController.deleteFriend = async (req, res) => {
  try {
    const myId = req.user.id;
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({ success: false, message: "friendId required" });
    }

    await Friend.destroy({ where: { userId: myId, friendId } });
    return res.status(200).json({ success: true, message: "친구 삭제 완료" });
  } catch (err) {
    console.error("친구 삭제 에러", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};

module.exports = userController;
