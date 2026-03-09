"use client";

import { RiMessengerLine } from "react-icons/ri";

export default function ChatEmptyState() {
  return (
    /* h-full과 flex-col, justify-center가 핵심입니다 */
    <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="flex flex-col items-center text-center max-w-sm">
        {/* 아이콘 */}
        <div className="w-24 h-24 border-2 border-white rounded-full flex items-center justify-center mb-5">
          <RiMessengerLine size={50} />
        </div>

        {/* 텍스트 */}
        <h3 className="text-xl font-normal mb-1">내 메시지</h3>
        <p className="text-neutral-400 text-sm leading-relaxed">
          친구에게 비공개 사진과 메시지를 보내보세요.
        </p>

        {/* 버튼 */}
        <button className="mt-6 bg-[#0095f6] hover:bg-[#1877f2] text-white px-5 py-2 rounded-lg text-sm font-bold transition-all active:scale-95">
          메시지 보내기
        </button>
      </div>
    </div>
  );
}