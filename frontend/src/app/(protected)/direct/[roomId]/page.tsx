import ChatContainer, { Message } from "./_components/chat-container";

// 1. Next.js 페이지 프롭스 타입 정의
interface ChatRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default async function ChatRoomPage({ params }: ChatRoomPageProps) {
  // Promise로 감싸진 params를 await로 풀어줍니다.
  const { roomId } = await params;

  // 2. 가짜 데이터에 정확한 'Message[]' 타입 부여 (any 제거!)
  const mockInitialMessages: Message[] = [
    { id: "1", sender: "other", text: "서버(SSR)가 미리 그려준 메시지예요!", time: "오후 2:00" },
    { id: "2", sender: "me", text: "오, 로딩이 엄청 빠르겠네요!", time: "오후 2:01" },
  ];

  return (
    <div className="flex flex-col h-full bg-black">
      {/* 3. 이제 as any 없이도 완벽하게 타입이 맞아떨어집니다. */}
      <ChatContainer roomId={roomId} initialMessages={mockInitialMessages} />
    </div>
  );
}