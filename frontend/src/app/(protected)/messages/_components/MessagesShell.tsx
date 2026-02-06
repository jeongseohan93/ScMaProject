"use client";

import { useMemo, useState } from "react";

type Thread = {
  id: string;
  name: string;
  username: string;
  lastMessage: string;
  lastTime: string;
  unread?: boolean;
};

type Msg = {
  id: string;
  threadId: string;
  mine: boolean;
  text: string;
  time: string;
};

const mockThreads: Thread[] = [
  { id: "t1", name: "이종철님", username: "jongcheol", lastMessage: "ㅋㅋㅋㅋㅋㅋ", lastTime: "3분", unread: true },
  { id: "t2", name: "하연님", username: "hayoun", lastMessage: "넹 : 13주", lastTime: "13주" },
  { id: "t3", name: "이희진님", username: "heejin", lastMessage: "1시간 전에 활동", lastTime: "1시간" },
];

const mockMessages: Msg[] = [
  { id: "m1", threadId: "t1", mine: true, text: "ㅋㅋㅋㅋㅋㅋ엽병 ㅋㅋ", time: "오후 7:12" },
  { id: "m2", threadId: "t1", mine: false, text: "ㅋㅋㅋㅋㅋㅋ", time: "오후 7:14" },
  { id: "m3", threadId: "t1", mine: false, text: "여친생님? ㅋㅋㅋㅋ", time: "오후 8:05" },
  { id: "m4", threadId: "t1", mine: true, text: "ㅇㅇ ㅋㅋㅋㅋ", time: "오후 8:06" },
];

function Avatar({ size = 36 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-white/10 border border-white/10"
      style={{ width: size, height: size }}
    />
  );
}

export default function MessagesShell() {
  const [selectedId, setSelectedId] = useState<string>(mockThreads[0]?.id ?? "");
  const [input, setInput] = useState("");

  const threads = mockThreads;
  const selected = threads.find((t) => t.id === selectedId) ?? threads[0];
  const msgs = useMemo(
    () => mockMessages.filter((m) => m.threadId === selectedId),
    [selectedId]
  );

  const send = () => {
    if (!input.trim()) return;
    // 데모: 실제로는 API/WS로
    mockMessages.push({
      id: "m" + (mockMessages.length + 1),
      threadId: selectedId,
      mine: true,
      text: input.trim(),
      time: "방금",
    });
    setInput("");
  };

  return (
    <div className="min-h-[calc(100vh-0px)] w-full">
      {/* 전체 래퍼: (SidebarNav는 상위 레이아웃에 이미 있다고 가정)
          여기서는 메시지 영역만 2열(대화목록/채팅) */}
      <div className="mx-auto w-full max-w-[1400px] px-3 lg:px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f14] shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
          {/* LEFT: Thread list */}
          <section className="border-b border-white/10 lg:border-b-0 lg:border-r border-white/10">
            {/* header */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-white/90">seo_han93</div>
                <div className="h-2 w-2 rounded-full bg-white/20" />
              </div>
              <button
                className="rounded-xl px-3 py-2 text-xs text-white/80 hover:bg-white/5"
                type="button"
              >
                요청
              </button>
            </div>

            {/* search */}
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 rounded-xl bg-white/[0.06] px-3 py-2 border border-white/10">
                <div className="h-4 w-4 rounded bg-white/10" />
                <input
                  className="w-full bg-transparent text-sm text-white/80 outline-none placeholder:text-white/35"
                  placeholder="검색"
                />
              </div>
            </div>

            {/* list */}
            <div className="px-2 pb-3">
              <div className="px-2 py-2 text-xs text-white/50">메시지</div>

              <div className="space-y-1">
                {threads.map((t) => {
                  const active = t.id === selectedId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedId(t.id)}
                      className={[
                        "w-full text-left flex items-center gap-3 rounded-2xl px-3 py-2.5 transition",
                        active ? "bg-white/10" : "hover:bg-white/5",
                      ].join(" ")}
                    >
                      <Avatar size={44} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="truncate text-sm font-medium text-white/90">
                            {t.name}
                          </div>
                          <div className="text-[11px] text-white/45">{t.lastTime}</div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="truncate text-xs text-white/55">
                            {t.lastMessage}
                          </div>
                          {t.unread ? <div className="h-2 w-2 rounded-full bg-white/60" /> : null}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* RIGHT: Chat */}
          <section className="flex min-h-[520px] flex-col">
            {/* chat header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar size={34} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white/90">
                    {selected?.name ?? "대화"}
                  </div>
                  <div className="truncate text-xs text-white/45">
                    {selected ? `${selected.username} · 3분 전에 활동` : ""}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="h-9 w-9 rounded-xl hover:bg-white/5 grid place-items-center" type="button">
                  <div className="h-4 w-4 rounded bg-white/10" />
                </button>
                <button className="h-9 w-9 rounded-xl hover:bg-white/5 grid place-items-center" type="button">
                  <div className="h-4 w-4 rounded bg-white/10" />
                </button>
                <button className="h-9 w-9 rounded-xl hover:bg-white/5 grid place-items-center" type="button">
                  <div className="h-4 w-4 rounded bg-white/10" />
                </button>
              </div>
            </div>

            {/* messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {msgs.map((m) => (
                <div
                  key={m.id}
                  className={[
                    "flex",
                    m.mine ? "justify-end" : "justify-start",
                  ].join(" ")}
                >
                  <div className="max-w-[72%]">
                    <div
                      className={[
                        "rounded-2xl px-4 py-2 text-sm leading-relaxed",
                        m.mine
                          ? "bg-[#2f79ff] text-white"
                          : "bg-white/10 text-white/90 border border-white/10",
                      ].join(" ")}
                    >
                      {m.text}
                    </div>
                    <div className={["mt-1 text-[11px] text-white/35", m.mine ? "text-right" : "text-left"].join(" ")}>
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* input */}
            <div className="border-t border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
                <button className="h-9 w-9 rounded-xl hover:bg-white/5 grid place-items-center" type="button">
                  <div className="h-4 w-4 rounded bg-white/10" />
                </button>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                  className="flex-1 bg-transparent text-sm text-white/85 outline-none placeholder:text-white/35"
                  placeholder="메시지 입력..."
                />

                <button className="h-9 w-9 rounded-xl hover:bg-white/5 grid place-items-center" type="button">
                  <div className="h-4 w-4 rounded bg-white/10" />
                </button>
                <button
                  onClick={send}
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/5"
                  type="button"
                >
                  보내기
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
