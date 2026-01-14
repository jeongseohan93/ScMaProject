"use client";

export type ScheduleItem = {
  id: string;     // Next/TS 안전하게 string 권장
  date: string;   // "YYYY-MM-DD"
  title: string;
};

type Props = {
  schedules: ScheduleItem[];
  onExport?: (id: string) => void;
};

export default function ScheduleListUI({ schedules, onExport }: Props) {
  return (
    <div className="max-w-[800px] mx-auto my-10 p-[30px] bg-white rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
      <h2 className="text-center mb-5 text-[#333] text-xl font-bold">
        📋 전체 일정 리스트
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed mt-2.5">
          <thead>
            <tr className="border-b-2 border-[#1a1a1a] bg-[#f8f9fa]">
              <th className="p-[15px] w-[120px] text-left text-[14px] font-semibold text-[#555]">
                날짜
              </th>
              <th className="p-[15px] text-left text-[14px] text-[#333]">
                내용
              </th>
              <th className="p-[15px] w-[80px] text-center text-[14px] text-[#333]">
                관리
              </th>
            </tr>
          </thead>

          <tbody>
            {schedules.map((s) => (
              <tr key={s.id} className="border-b border-[#eee]">
                <td className="p-[15px] w-[120px] text-left text-[14px] font-semibold text-[#555]">
                  {s.date}
                </td>
                <td className="p-[15px] text-left text-[14px] text-[#333] whitespace-nowrap overflow-hidden text-ellipsis">
                  {s.title}
                </td>
                <td className="p-[15px] w-[80px] text-center">
                  <button
                    type="button"
                    onClick={() => onExport?.(s.id)}
                    className="px-3 py-1.5 bg-[#333] text-white rounded-[6px] text-[12px]"
                  >
                    내보내기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {schedules.length === 0 && (
        <p className="text-center py-10 text-[#999]">등록된 일정이 없습니다.</p>
      )}
    </div>
  );
}
