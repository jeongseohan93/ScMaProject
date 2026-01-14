// app/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { authMe } from "@/src/features/auth/api/auth";
import LogoutButton  from "../app/Logout";

export default async function HomePage() {
  const user = await authMe();
  console.log(user);

  // 로그인 안 됐으면 로그인 페이지로
  if (!user) redirect("/auth/login");

  // 닉네임/ID는 authMe 응답에서 내려주는 걸 권장
  const nickname = user.nickname ?? "사용자";
  const userId = user.id ?? "ID 없음";

  return (
    <div className="min-h-screen bg-[#282c34] px-5 py-10 flex flex-col items-center">
      <div className="w-full max-w-[400px]">
        {/* 프로필 섹션 */}
        <div className="w-full flex justify-between items-center p-5 bg-[#333] rounded-[15px] box-border">
          <div className="text-left">
            <h2 className="text-white m-0 text-xl font-semibold">{nickname}</h2>
            <p className="text-[#61dafb] m-0 text-sm">ID : {userId}</p>
          </div>

          <LogoutButton />
        </div>

        <p className="text-white my-5">원하는 기능을 선택하세요.</p>

        {/* 메뉴 그리드 */}
        <div className="grid grid-cols-2 gap-[15px] w-full">
          <MenuCard href="/mycalendar" icon="📅" label="캘린더" />
          <MenuCard href={`/chat/${userId}`} icon="💭" label="나와의 채팅" />
          <MenuCard href="/schedule-list" icon="📝" label="일정 관리" />
          <MenuCard href="/search-friend" icon="🔍" label="친구 검색" />
          <MenuCard href="/chat" icon="💬" label="채팅 목록" />
          <MenuCard href="/friend-list" icon="👤" label="친구 목록" />
        </div>
      </div>
    </div>
  );
}

function MenuCard({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="bg-[#3e4451] rounded-[15px] px-[10px] py-[30px] flex flex-col items-center text-white
                 transition-transform hover:scale-[1.02] active:scale-[0.99]"
    >
      <span className="text-[2.5rem] mb-[10px]">{icon}</span>
      <span className="text-base font-bold">{label}</span>
    </Link>
  );
}
