"use client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    
      router.push("/chat");
  };

  return (
    <button
      className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
      onClick={handleLogout}
    >
      로그아웃
    </button>
  );
}
