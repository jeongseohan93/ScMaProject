import Link from "next/link";

export type ChatListItem = {
  friendId: string;
  friendNickname?: string;
  createdAt: string;
  text: string;
  unreadCount: number;
};

function formatTime(dateString: string) {
  const now = new Date();
  const msgDate = new Date(dateString);
  const diff = (now.getTime() - msgDate.getTime()) / 1000;

  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return msgDate.toLocaleDateString();
}

export default function ChatListUI({ list }: { list: ChatListItem[] }) {
  return (
    <div className="mx-auto my-5 w-full max-w-[500px] overflow-hidden rounded-[20px] bg-white shadow-[0_10px_25px_rgba(0,0,0,0.1)]">
      <header className="bg-[#333] p-[15px] text-center text-white">
        <h2 className="text-lg font-semibold">채팅 목록</h2>
      </header>

      <div className="h-[550px] overflow-y-auto">
        {list.map((chat, i) => {
          const displayName = chat.friendNickname || chat.friendId;
          const avatarChar = (displayName?.[0] || "?").toUpperCase();

          return (
            <Link
              key={i}
              href={`/chat/${chat.friendId}`}
              className="flex items-center gap-[15px] border-b border-[#eee] p-[15px] transition-colors hover:bg-gray-50"
            >
              <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#333] font-bold text-white">
                {avatarChar}
              </div>

              <div className="flex-1">
                <div className="mb-[5px] flex items-center justify-between">
                  <span className="font-bold text-[#333]">
                    {displayName}
                  </span>
                  <span className="text-[11px] text-[#999]">
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-[#666]">
                    {chat.text}
                  </div>

                  <div className="flex items-center gap-2">
                    {chat.unreadCount > 0 && (
                      <span className="min-w-[15px] rounded-[12px] bg-[#ff4d4f] px-[7px] py-[2px] text-center text-[11px] font-bold text-white">
                        {chat.unreadCount}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatTime(chat.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {list.length === 0 && (
          <div className="p-[50px] text-center text-[#999]">
            대화 내역이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
