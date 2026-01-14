import MyFriendListClient from "./MyFriendListClient";

export default async function MyFriendPage() {
  // ✅ 하드코딩 데이터
  const friends = [
    {
      friendInfo: {
        userId: "user-1",
        nickname: "철수",
      },
    },
    {
      friendInfo: {
        userId: "user-2",
        nickname: "영희",
      },
    },
    {
      friendInfo: {
        userId: "user-3",
        nickname: "민수",
      },
    },
  ];

  return <MyFriendListClient friends={friends} />;
}
