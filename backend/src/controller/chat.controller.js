const chatService = require('../service/chat/chat.service');

exports.sendMessage = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { text, senderEmail, receiverEmail } = req.body;

        // 변수명을 savedChat으로 수정
        const savedChat = await chatService.saveChatMessage({
            roomId,
            senderEmail,
            receiverEmail,
            message: text
        });

        const io = req.app.get('io');
        if (io) {
            // 이제 savedChat이 정의되어 있으므로 정상 작동합니다.
            io.to(roomId).emit("receive-message", savedChat);
        }

        res.status(200).json({ success: true, data: savedChat });
    } catch ( error ) {
        console.error("Controller Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};