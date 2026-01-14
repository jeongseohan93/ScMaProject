"use client";

export type FriendItem = {
  friendInfo: {
    userId: string;
    nickname: string;
  };
};

type Props = {
  friends: FriendItem[];
  onBack?: () => void;
  onChat?: (friendUserId: string) => void;
  onDelete?: (friendUserId: string) => void;
};

export default function MyFriendListUI({ friends, onBack, onChat, onDelete }: Props) {
  return (
    <div className="min-h-screen bg-[#1a1d23] px-5 py-10 font-sans flex flex-col items-center">
      <div className="w-full max-w-[450px]">
        <button
          onClick={onBack}
          className="mb-5 text-[#61dafb] text-base hover:underline"
          type="button"
        >
          ← 뒤로
        </button>

        <h2 className="mb-4 text-white text-xl font-bold">내 친구 목록</h2>

        <div className="flex flex-col gap-3">
          {friends.length > 0 ? (
            friends.map((f, idx) => (
              <div
                key={idx}
                className="bg-[#2c313c] px-5 py-3 rounded-[12px] flex items-center justify-between shadow-[0_4px_6px_rgba(0,0,0,0.1)]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👤</span>
                  <span className="text-white font-bold text-[15px]">
                    {f.friendInfo.nickname}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onChat?.(f.friendInfo.userId)}
                    className="bg-[#61dafb] text-[#1a1d23] rounded-[6px] px-3 py-1.5 text-[13px] font-bold"
                    type="button"
                  >
                    채팅
                  </button>

                  <button
                    onClick={() => onDelete?.(f.friendInfo.userId)}
                    className="border border-[#ff4d4d] text-[#ff4d4d] rounded-[6px] px-2.5 py-[5px] text-[13px]"
                    type="button"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white">아직 추가된 친구가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
