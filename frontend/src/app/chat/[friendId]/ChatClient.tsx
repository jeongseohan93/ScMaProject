"use client";

import { useMemo, useState } from "react";
import ChatUI, { ChatMsg } from "./ChatUI";

export default function ChatClient({ friendId }: { friendId: string }) {
  const myId = "user-me";
  const friendNickname = "영희";

  const [isFriend, setIsFriend] = useState(false);

  const initialLog: ChatMsg[] = useMemo(
    () => [
      { user: friendId, text: "안녕! 오늘 일정 있어?", time: "오전 10:12", isMe: false },
      { user: myId, text: "내일 세차하려고.", time: "오전 10:13", isMe: true },
    ],
    [friendId]
  );

  const [chatLog, setChatLog] = useState<ChatMsg[]>(initialLog);
  const [message, setMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({ title: "추출된 일정", date: "2026-01-15" });

  return (
    <ChatUI
      friendNickname={friendNickname}
      myId={myId}
      friendId={friendId}
      isFriend={isFriend}
      chatLog={chatLog}
      message={message}
      onChangeMessage={setMessage}
      onSend={() => {
        if (!message.trim()) return;
        setChatLog((prev) => [
          ...prev,
          {
            user: myId,
            text: message.trim(),
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isMe: true,
          },
        ]);
        setMessage("");
      }}
      onAddFriend={() => setIsFriend(true)}
      onExtract={() => setIsModalOpen(true)}
      isModalOpen={isModalOpen}
      editData={editData}
      onChangeEditData={setEditData}
      onCloseModal={() => setIsModalOpen(false)}
      onSaveModal={() => setIsModalOpen(false)}
    />
  );
}
