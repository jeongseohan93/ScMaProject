"use client";

export type ChatMsg = {
  user: string;
  text: string;
  time: string;
  isMe: boolean;
};

export default function ChatUI(props: any) {
  return (
    <div style={{ maxWidth: 500, margin: "20px auto", padding: 20 }}>
      <div style={{ padding: 12, background: "#333", color: "white", borderRadius: 10 }}>
        {props.friendNickname}님과의 채팅
      </div>
      <div style={{ marginTop: 12 }}>
        UI 렌더 테스트 OK
      </div>
    </div>
  );
}
