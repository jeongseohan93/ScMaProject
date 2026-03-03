"use client";

import { ChatRoom } from "@/src/types/chat";
import { AiOutlineEdit } from "react-icons/ai";
import ChatItem from "./chat-item";

interface ChatListProps {
  rooms: ChatRoom[];
  currentUserName: string;
}

export default function ChatList({ rooms, currentUserName }: ChatListProps) {
  return (
    <aside className="w-[397px] h-screen border-r border-neutral-800 flex flex-col bg-black shrink-0">
      {/* 1. 상단 유저 네임 */}
      <div className="px-6 py-6 flex justify-between items-center shrink-0">
        <h2 className="text-xl font-bold text-white flex items-center gap-1 cursor-pointer">
          {currentUserName} <span className="text-[10px] align-middle">▼</span>
        </h2>
        <AiOutlineEdit size={24} className="text-white cursor-pointer" />
      </div>

      {/* 2. 검색창 (스크린샷에 있는 디자인 반영) */}
      <div className="px-4 mb-4">
        <div className="bg-neutral-900 flex items-center px-4 py-2 rounded-xl text-neutral-500">
          <span className="text-sm">검색</span>
        </div>
      </div>

      {/* 3. 유저 메모/스토리 라인 (선택 사항) */}
      <div className="px-6 mb-4 flex flex-col items-center w-fit">
        <div className="w-16 h-16 bg-neutral-800 rounded-full border border-neutral-700 flex items-center justify-center relative">
          <div className="absolute -top-1 -right-1 bg-white text-black text-[10px] px-2 py-0.5 rounded-full shadow-md">
            내 메모
          </div>
          <div className="w-14 h-14 bg-neutral-600 rounded-full" />
        </div>
      </div>

      {/* 4. 메시지 텍스트 */}
      <div className="px-6 py-2 flex justify-between items-center shrink-0">
        <span className="font-bold text-white">메시지</span>
        <span className="text-xs font-semibold text-neutral-500 cursor-pointer">요청</span>
      </div>

      {/* 5. 리스트 영역 */}
      <div className="flex-1 overflow-y-auto">
        <ul>
          {rooms.map((room) => (
            <ChatItem key={room.id} room={room} />
          ))}
        </ul>
      </div>
    </aside>
  );
}