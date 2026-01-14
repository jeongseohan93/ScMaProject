"use client";

export type SearchResult = {
  userId: string;
  nickname: string;
  isFriend: boolean;
};

type Props = {
  keyword: string;
  onChangeKeyword: (v: string) => void;
  onSearch: () => void;

  myNickname: string;
  result: SearchResult | null;

  onAddFriend?: (friendId: string) => void;
};

export default function SearchFriendUI({
  keyword,
  onChangeKeyword,
  onSearch,
  myNickname,
  result,
  onAddFriend,
}: Props) {
  return (
    <div className="min-h-screen bg-[#282c34] px-5 py-10 flex flex-col items-center">
      <h2 className="text-white text-center text-xl font-bold mb-6">
        🔍<br />
        친구 검색
      </h2>

      {/* 검색 박스 */}
      <div className="flex gap-2.5 w-full max-w-[400px] mb-[30px]">
        <input
          type="text"
          placeholder="닉네임 입력"
          value={keyword}
          onChange={(e) => onChangeKeyword(e.target.value)}
          className="flex-1 rounded-[8px] border border-[#444] bg-[#333] px-3 py-3 text-white outline-none"
        />
        <button
          onClick={onSearch}
          className="rounded-[8px] bg-[#61dafb] px-5 py-3 font-bold text-[#282c34]"
          type="button"
        >
          검색
        </button>
      </div>

      {/* 결과 카드 */}
      {result && (
        <div className="w-full max-w-[400px] bg-[#333] p-5 rounded-[15px] flex justify-between items-center">
          <div className="flex items-center gap-[15px]">
            <span className="text-[2rem] bg-[#444] p-[10px] rounded-full">👤</span>

            <div className="text-white font-bold">
              {result.nickname}
              {result.nickname === myNickname && (
                <span className="ml-2 text-[11px] bg-[#555] px-[6px] py-[2px] rounded-[4px] text-[#aaa]">
                  (나)
                </span>
              )}
            </div>
          </div>

          {/* 오른쪽 액션 */}
          {result.nickname !== myNickname && (
            result.isFriend ? (
              <span className="text-white text-sm">이미 친구입니다.</span>
            ) : (
              <button
                onClick={() => onAddFriend?.(result.userId)}
                className="bg-[#4CAF50] text-white border-none px-[15px] py-2 rounded-[8px] cursor-pointer"
                type="button"
              >
                친구 추가
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
