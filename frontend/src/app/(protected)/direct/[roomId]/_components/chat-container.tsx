"use client"

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import ChatMessages from "./chat-messages";
import ChatInput from "./chat-input";

let socket: Socket;

export interface Message {
    id: string;
    sender: "me" | "other";
    text: string;
    time: string;
}

interface ChatContainerProps {
    roomId: string;
    initialMessages: Message[];
}

export default function ChatContainer({ roomId, initialMessages }: ChatContainerProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);

    useEffect(() => {
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3005";
        socket = io(backendUrl);

        socket.emit("join-room", roomId);

        // 🌟 메시지 수신 로직 개선
        socket.on("receive-message", (newMessage: any) => {
            setMessages((prev) => {
                // 1. 중복 체크: 이미 리스트에 있는 ID(DB ID 또는 임시 ID)라면 추가하지 않음
                // (Optimistic Update로 넣은 메시지가 소켓으로 또 올 때를 대비)
                const isDuplicate = prev.some(msg => 
                    msg.id === newMessage.id.toString() || msg.text === newMessage.message
                );
                
                // 실제 서비스에서는 senderEmail을 비교해서 '나'인 경우 필터링하는 게 가장 정확합니다.
                // 여기서는 간단하게 상대방이 보낸 것만 추가하는 로직으로 구성했습니다.
                if (isDuplicate) return prev;

                const formattedMessage: Message = {
                    id: newMessage.id.toString(),
                    sender: "other", 
                    text: newMessage.message,
                    time: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                return [...prev, formattedMessage];
            });
        });

        return () => {
            socket.off("receive-message");
            socket.disconnect();
        };
    }, [roomId]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        // 🌟 1. 내 화면에 즉시 반영 (임시 ID 부여)
        const tempId = `temp-${Date.now()}`;
        const myNewMessage: Message = {
            id: tempId,
            sender: "me",
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages((prev) => [...prev, myNewMessage]);

        try {
            // 2. 백엔드 API로 전송
            const response = await fetch(`http://localhost:3005/api/chat/${roomId}/message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: text,
                    senderEmail: "me@example.com", // TODO: 실제 로그인 유저 이메일
                    receiverEmail: "other@example.com"
                })
            });

            if (!response.ok) {
                throw new Error("전송 실패");
            }

            // (선택사항) 전송 성공 후 서버에서 받은 실제 ID로 임시 ID를 교체하고 싶다면 여기서 처리
            // const result = await response.json();
            // setMessages(prev => prev.map(m => m.id === tempId ? { ...m, id: result.data.id.toString() } : m));

        } catch (error) {
            console.error("메시지 전송 에러:", error);
            // 🌟 실패 시 유저에게 알림 (예: 메시지 리스트에서 해당 메시지 삭제 또는 에러 표시)
            alert("메시지 전송에 실패했습니다.");
            setMessages((prev) => prev.filter(m => m.id !== tempId));
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <ChatMessages messages={messages} />
            <ChatInput onSend={handleSend} />
        </div>
    );
}