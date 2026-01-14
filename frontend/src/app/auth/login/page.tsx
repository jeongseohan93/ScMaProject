"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginRequest } from "@/src/features/auth/api/client";

export default function InstagramLoginMock() {
  const router = useRouter();

  const [mode, setMode] = useState<"pick" | "form">("pick");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const r = await loginRequest(email.trim(), password);
      if (!r.ok) {
        setError(r.message || "로그인 실패");
        return;
      }

      // ✅ 쿠키 세팅 완료 → 홈으로
      router.replace("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      <div className="mx-auto grid min-h-screen max-w-[1200px] grid-cols-1 lg:grid-cols-2">
        {/* LEFT (목업) */}
        <section className="relative hidden overflow-hidden border-r border-white/10 lg:block">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-between p-16">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#515bd4] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
                    stroke="white"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                    stroke="white"
                    strokeWidth="1.6"
                  />
                  <path d="M17.4 6.6h.01" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            <div className="mt-12 max-w-[520px]">
              <h1 className="text-4xl font-semibold leading-tight">
                <span className="text-[#ff4d4d]">친한 친구</span>의 일상 속 순간들을 확인해
                <br />
                보세요.
              </h1>

              <div className="relative mt-14 h-[360px]">
                <div className="absolute left-6 top-10 h-[280px] w-[220px] rotate-[-12deg] rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.45)]" />
                <div className="absolute left-32 top-6 h-[300px] w-[240px] rotate-[8deg] rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.45)]" />
                <div className="absolute left-20 top-0 h-[320px] w-[260px] rotate-[-2deg] overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_25px_70px_rgba(0,0,0,0.55)]">
                  <div className="h-full w-full bg-gradient-to-br from-white/10 to-transparent" />
                  <div className="absolute left-4 top-4 flex gap-2">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs">💬</span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs">👀</span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs">✨</span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                    <div className="h-9 w-[160px] rounded-full bg-white/10" />
                    <div className="h-9 w-9 rounded-full bg-white/10" />
                  </div>
                </div>

                <div className="absolute left-2 top-52 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-[#ff2bd4] to-[#ff6b2b] shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                  <span className="text-xl">❤</span>
                </div>
              </div>
            </div>

            <footer className="text-xs text-white/50">
              Meta · 소개 · 블로그 · 도움말 · 개인정보처리방침 · 약관
            </footer>
          </div>
        </section>

        {/* RIGHT */}
        <section className="relative flex items-center justify-center px-6 py-14">
          <div className="w-full max-w-[520px]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 shadow-[0_25px_70px_rgba(0,0,0,0.55)]">
              <div className="flex items-start justify-end">
                <button
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
                  aria-label="설정"
                  type="button"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                      stroke="white"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M19.4 15a8.3 8.3 0 0 0 .1-2l2-1.2-2-3.4-2.3.6a7.8 7.8 0 0 0-1.7-1l-.3-2.3H9.8L9.5 8a7.8 7.8 0 0 0-1.7 1l-2.3-.6-2 3.4 2 1.2a8.3 8.3 0 0 0 .1 2l-2 1.2 2 3.4 2.3-.6a7.8 7.8 0 0 0 1.7 1l.3 2.3h4.4l.3-2.3a7.8 7.8 0 0 0 1.7-1l2.3.6 2-3.4-2-1.2Z"
                      stroke="white"
                      strokeWidth="1.6"
                      opacity="0.75"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-6 flex flex-col items-center text-center">
                {/* Avatar placeholder */}
                <div className="relative grid h-28 w-28 place-items-center rounded-full border border-white/10 bg-white/5">
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-white/10">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="opacity-80">
                      <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" stroke="white" strokeWidth="1.6" />
                      <path d="M4 20.5c0-3.6 3.6-6.5 8-6.5s8 2.9 8 6.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                <div className="mt-6 text-2xl font-semibold">seo_han93</div>

                {mode === "pick" ? (
                  <>
                    {/* ✅ 클릭하면 폼 모드로 */}
                    <button
                      className="mt-8 w-full rounded-xl bg-[#1877f2] py-3.5 text-base font-semibold hover:brightness-110 disabled:opacity-60"
                      type="button"
                      onClick={() => setMode("form")}
                    >
                      로그인
                    </button>

                    <button
                      className="mt-3 w-full rounded-xl border border-white/15 bg-transparent py-3.5 text-base font-medium text-white/90 hover:bg-white/5"
                      type="button"
                    >
                      다른 프로필 사용하기
                    </button>

                    <button
  className="mt-6 w-full rounded-xl border border-[#1877f2]/60 bg-transparent py-3.5 text-base font-semibold text-[#8bb8ff] hover:bg-[#1877f2]/10"
  type="button"
  onClick={() => router.push("/auth/register")}
>
  새 계정 만들기
</button>

                  </>
                ) : (
                  <>
                    <form className="mt-8 w-full text-left" onSubmit={onSubmit}>
                      <label className="block text-sm text-white/70">이메일</label>
                      <input
                        className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/25"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        autoComplete="email"
                      />

                      <label className="mt-4 block text-sm text-white/70">비밀번호</label>
                      <input
                        className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/25"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        type="password"
                        autoComplete="current-password"
                      />

                      {error ? (
                        <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                          {error}
                        </div>
                      ) : null}

                      <button
                        className="mt-5 w-full rounded-xl bg-[#1877f2] py-3.5 text-base font-semibold hover:brightness-110 disabled:opacity-60"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "로그인 중..." : "로그인"}
                      </button>

                      <button
                        className="mt-3 w-full rounded-xl border border-white/15 bg-transparent py-3.5 text-base font-medium text-white/90 hover:bg-white/5"
                        type="button"
                        onClick={() => {
                          setMode("pick");
                          setError(null);
                        }}
                        disabled={loading}
                      >
                        뒤로
                      </button>
                    </form>
                  </>
                )}

                <div className="mt-8 text-white/70">
                  <span className="font-semibold">∞</span> Meta
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-white/45">
              한국어 · © 2026 Instagram from Meta
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
