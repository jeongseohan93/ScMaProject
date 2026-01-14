"use client";

import ScheduleListUI, { ScheduleItem } from "./ScheduleListUI";

export default function ScheduleListClient({
  schedules,
}: {
  schedules: ScheduleItem[];
}) {
  return (
    <ScheduleListUI
      schedules={schedules}
      onExport={(id) => alert(`(하드코딩) 내보내기 클릭: ${id}`)}
    />
  );
}
