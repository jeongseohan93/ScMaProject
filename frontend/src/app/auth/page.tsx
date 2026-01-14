import { authMe } from "@/src/features/auth/api/auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const user = await authMe();

  // 이미 로그인된 상태라면 / 로 보내기
  if (user) {
    redirect("/");
  }

  if (!user) {
    redirect("/auth/login")
  }
    
}
