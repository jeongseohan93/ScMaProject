import ScheduleListClient from "./ScheduleListClient";
import { ScheduleItem } from "./ScheduleListUI";

export default async function ScheduleListPage() {
  // ✅ 하드코딩 데이터(날짜순 정렬까지 미리)
  const schedules: ScheduleItem[] = [
    { id: "1", date: "2026-01-15", title: "내일 세차" },
    { id: "2", date: "2026-01-18", title: "회의: SCMA 기능 정리" },
    { id: "3", date: "2026-02-01", title: "친구 기능 API 붙이기" },
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return <ScheduleListClient schedules={schedules} />;
}
