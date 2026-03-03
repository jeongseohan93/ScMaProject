"use client";

import { Message } from "./chat-container";

export default function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
              msg.sender === "me"
                ? "bg-[#3797f0] text-white rounded-br-none"
                : "bg-neutral-800 text-white rounded-bl-none"
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}