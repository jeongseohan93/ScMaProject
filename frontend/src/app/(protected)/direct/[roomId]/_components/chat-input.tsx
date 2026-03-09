"use client";

import { useState } from "react";
import { AiOutlineHeart, AiOutlinePicture } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";

export default function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message); // 부모 컴포넌트(ChatContainer)로 메시지 전달
      setMessage("");  // 입력창 초기화
    }
  };

  // 엔터 키로 전송하기
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="p-4 shrink-0">
      <div className="flex items-center gap-4 px-4 py-2 border border-neutral-700 rounded-full bg-black">
        <button className="text-white hover:opacity-50">
          <BsEmojiSmile size={24} />
        </button>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지 입력..."
          className="flex-1 bg-transparent text-white text-sm outline-none"
        />

        {message.length > 0 ? (
          <button 
            onClick={handleSend}
            className="text-[#0095f6] font-bold text-sm hover:text-white"
          >
            보내기
          </button>
        ) : (
          <div className="flex items-center gap-3 text-white">
            <button className="hover:opacity-50"><AiOutlinePicture size={24} /></button>
            <button className="hover:opacity-50"><AiOutlineHeart size={24} /></button>
          </div>
        )}
      </div>
    </div>
  );
}