const sqldb = require("../../models/sql");

exports.createMessage = async (data) => {
    return await sqldb.Chat.create({
      roomId: data.roomId,
      message: data.message,
      senderEmail: data.senderEmail,
      receiverEmail: data.receiverEmail,
      isRead: false
    })
}

exports.updateRoomActivity = async (roomId, lastMsg) => {
  return await sqldb.Room.update(
    { lastMessage: lastMsg },
    { where: { id: roomId } }
  );
};