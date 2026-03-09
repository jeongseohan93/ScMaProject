"use client";

import { ChatRoom } from "@/src/types/chat";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ChatItem({ room }: { room: ChatRoom }) {
  const params = useParams();
  const isActive = params.roomId === room.id;

  return (
    <Link href={`/direct/${room.id}`}>
      <li className={`flex items-center px-5 py-3 cursor-pointer transition-colors ${
        isActive ? "bg-neutral-900" : "hover:bg-neutral-950"
      }`}>
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden relative border border-neutral-800">
            {/* 실제 이미지 경로가 없으므로 배경색 처리 (실제 개발 시 src={room.user.image} 사용) */}
            <div className="w-full h-full bg-neutral-700 flex items-center justify-center text-[10px]">IMG</div>
          </div>
          {room.isOnline && (
            <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 border-2 border-black rounded-full" />
          )}
        </div>
        
        <div className="ml-3 overflow-hidden flex-1">
          <p className="text-sm font-medium text-white truncate">{room.user.name}</p>
          <p className="text-xs text-neutral-500 truncate mt-0.5">
            {room.lastMessage || room.user.lastActive}
          </p>
        </div>
      </li>
    </Link>
  );
}