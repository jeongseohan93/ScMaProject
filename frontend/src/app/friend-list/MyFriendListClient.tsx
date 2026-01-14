"use client";

import { useRouter } from "next/navigation";
import MyFriendListUI, { FriendItem } from "./MyFriendListUI";

export default function MyFriendListClient({
  friends,
}: {
  friends: FriendItem[];
}) {
  const router = useRouter();

  return (
    <MyFriendListUI
      friends={friends}
      onBack={() => router.back()}
      onChat={(id) => router.push(`/chat/${id}`)}
      onDelete={(id) => {
        alert(`(하드코딩) ${id} 삭제 클릭`);
      }}
    />
  );
}
