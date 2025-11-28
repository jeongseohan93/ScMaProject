// src/components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3005";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include", // 쿠키 포함해서 요청
      });

      // 전역 auth 상태 써도 있다면 여기서 같이 reset
      router.push("/auth");
    } catch (err) {
      console.error("[FE] logout error:", err);
      // 원하면 토스트로 에러 띄우기
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
    >
      로그아웃
    </button>
  );
}
