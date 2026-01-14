"use client";

import { useState } from "react";
import SearchFriendUI, { SearchResult } from "./SearchFriendUI";

export default function SearchFriendClient() {
  // ✅ 하드코딩: 내 닉네임
  const myNickname = "정제리";

  // ✅ 하드코딩: 결과(처음부터 보이게 하려면 초기값을 넣고, 아니면 null)
  const [result, setResult] = useState<SearchResult | null>({
    userId: "user-123",
    nickname: "영희",
    isFriend: false,
  });

  const [keyword, setKeyword] = useState("");

  return (
    <SearchFriendUI
      keyword={keyword}
      onChangeKeyword={setKeyword}
      onSearch={() => {
        // ✅ 하드코딩 검색 동작
        if (!keyword.trim()) {
          setResult(null);
          return;
        }

        // 예시: 특정 키워드면 “이미 친구”
        if (keyword.trim() === "철수") {
          setResult({ userId: "user-001", nickname: "철수", isFriend: true });
          return;
        }

        // 일반 검색 결과
        setResult({ userId: "user-999", nickname: keyword.trim(), isFriend: false });
      }}
      myNickname={myNickname}
      result={result}
      onAddFriend={(friendId) => {
        alert(`(하드코딩) 친구추가 클릭: ${friendId}`);
        setResult((prev) => (prev ? { ...prev, isFriend: true } : prev));
      }}
    />
  );
}
 