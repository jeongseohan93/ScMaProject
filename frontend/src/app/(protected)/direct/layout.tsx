import ChatList from "./_components/chat-list";
import { ChatRoom } from "@/src/types/chat";

export default function DirectLayout({ children }: { children: React.ReactNode }) {
  const mockRooms: ChatRoom[] = [
    { id: "1", user: { name: "이종철님", image: "" }, lastMessage: "2분 전에 활동", isOnline: true },
    { id: "2", user: { name: "하연님", image: "" }, lastMessage: "냉 · 16주", isOnline: false },
    { id: "3", user: { name: "이희진님", image: "" }, lastMessage: "5시간 전에 활동", isOnline: false },
  ];

  return (
    
    <div className="flex h-screen w-full bg-black overflow-hidden">
      
      <ChatList rooms={mockRooms} currentUserName="seo_han93" />
    
      <main className="flex-1 h-full min-w-0">
        {children}
      </main>
    </div>
  );
}