// app/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    if (!confirm("로그아웃 하시겠습니까?")) return;

    // HttpOnly 쿠키 기반이므로 "토큰 삭제"가 아니라
    // 서버에 로그아웃 요청해서 쿠키를 지우게 해야 함
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    // 로그인 페이지로
    router.replace("/auth");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-[#ff4d4d] text-white border-0 px-4 py-2 rounded-[5px] text-[13px] cursor-pointer"
    >
      로그아웃
    </button>
  );
}
