"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
};

type Props = {
  events: CalendarEvent[];
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onDateClick?: (arg: { dateStr: string }) => void;
  onEventClick?: (info: { event: { id: string; title: string } }) => void;
};

export default function MyCalendarUI({
  events,
  isEditMode,
  onToggleEditMode,
  onDateClick,
  onEventClick,
}: Props) {
  return (
    <div className="m-5 rounded-[10px] bg-white p-5">
      <div className="mb-[10px] text-left">
        <button
          onClick={onToggleEditMode}
          className={[
            "rounded-[5px] px-5 py-2.5 font-bold text-white",
            isEditMode ? "bg-[#ff9800]" : "bg-[#2196f3]",
          ].join(" ")}
        >
          {isEditMode ? "수정 모드 활성화 중" : "일정 수정하기"}
        </button>

        <div className="mt-4">
          {isEditMode && (
            <span className="text-sm text-[#666]">수정할 일정을 클릭하세요.</span>
          )}
        </div>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        // UI-only: 핸들러는 있으면 연결, 없으면 no-op
        dateClick={(arg) => onDateClick?.({ dateStr: arg.dateStr })}
        eventClick={(info) => onEventClick?.({ event: { id: String(info.event.id), title: info.event.title } })}
        locale="ko"
        height="80vh"
      />
    </div>
  );
}
