// app/page.tsx (Server Component)
import { authMe } from "../features/auth/api/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await authMe();

  // 1) 유저 없으면 → /login 으로 보내기
  if (!user) {
    redirect("/login");
  }

  // 2) 유저 있으면 → 여기서 바로 메인 레이아웃 구성
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-4 py-2 flex justify-between items-center">
        <div className="font-bold">SCMA</div>
        <div>{user.nickname} 님</div>
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
