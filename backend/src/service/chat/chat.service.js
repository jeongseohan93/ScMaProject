const chatRepository = require('../../repositories/chat/chat.repositories');

exports.saveChatMessage = async (chatData) => {
  // 비즈니스 로직 예시: 메시지 내용이 비어있는지 확인 등
  if (!chatData.message || chatData.message.trim() === "") {
    throw new Error("메시지 내용이 없습니다.");
  }

  // 레포지토리에 DB 작업 위임
  const newChat = await chatRepository.createMessage(chatData);

  // 필요하다면 여기서 추가 작업 (예: 방의 lastMessage 업데이트 등) 수행
  await chatRepository.updateRoomActivity(chatData.roomId, chatData.message);

  return newChat;
};