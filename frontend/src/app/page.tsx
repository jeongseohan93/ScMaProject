import { redirect } from "next/navigation";
import { LogoutButton } from "../app/Logout"; // 경로는 네 구조에 맞게 조정

export default async function Home() {

  // 2) 유저 있으면 → 메인 레이아웃 + 로그아웃 버튼
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-4 py-2 flex justify-between items-center">
        <div className="font-bold">SCMA</div>
        <div className="flex items-center gap-3">
          <span>님</span>
          <LogoutButton />
        </div>
      </header>

      <main className="flex-1 flex">
        <section className="flex-1 border-r p-4">
          {/* 여기다가 피드/캘린더/채팅 레고처럼 쌓으면 됨 */}
          피드 / 캘린더 / 채팅 자리
        </section>
        <aside className="w-80 p-4 hidden lg:block border-l">
          오른쪽 사이드바
        </aside>
      </main>
    </div>
  );
}
