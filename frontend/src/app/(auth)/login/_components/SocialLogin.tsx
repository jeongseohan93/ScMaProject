"use client"

import { useRouter } from 'next/navigation'
import Button from "@/src/components/ui/Button";

export default function SocialLogin() {

  const router = useRouter();

  const goRegister = () => {
    router.push("/register")
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-center"
      >
        Facebook으로 로그인
      </Button>

      <button
        onClick={goRegister}
        type="button"
        className="w-full rounded-xl border border-blue-500 py-3 text-sm font-medium text-blue-400 hover:bg-blue-500/10 transition"
      >
        새 계정 만들기
      </button>

      <div className="pt-2 text-center text-xs text-white/30">© Meta</div>
    </div>
  );
}