"use client";

import { useState } from "react";
import MyCalendarUI, { CalendarEvent } from "./MyCalendarUI";

export default function MyCalendarClient() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  return (
    <MyCalendarUI
      events={events}
      isEditMode={isEditMode}
      onToggleEditMode={() => setIsEditMode((v) => !v)}
      onDateClick={(arg) => {
        // UI-only면 일단 stub
        console.log("dateClick:", arg.dateStr);
      }}
      onEventClick={(info) => {
        console.log("eventClick:", info.event.id, info.event.title);
      }}
    />
  );
}
