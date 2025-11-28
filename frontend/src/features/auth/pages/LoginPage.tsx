"use client";

import { useState } from "react";
import Link from 'next/link';
import axios from "axios";

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/login`,
        {
          email: emailOrUsername,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log("LOGIN SUCCESS", res.status, res.data);
      // 로그인 성공 시 SSR 분기 다시 태우기
      window.location.href = "/";
    } catch (err) {
      setError("로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-6xl flex flex-col md:flex-row md:items-stretch md:justify-between px-4 md:px-8 py-8 gap-10">
        {/* ====== 왼쪽: 인스타 느낌 이미지 / 카피 영역 ====== */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-400 flex items-center justify-center">
                <span className="text-2xl font-bold">📸</span>
              </div>
              <span className="text-xl font-semibold">Instagram</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold leading-snug">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 bg-clip-text text-transparent">
                친한 친구
              </span>
              의 일상 속
              <br />
              순간들을 확인해 보세요.
            </h1>
            <p className="mt-4 text-sm md:text-base text-neutral-400">
              스토리, 릴스, 메시지까지 한 곳에서.
              <br />
              가장 가까운 사람들의 오늘을 바로 만나보세요.
            </p>
          </div>

          {/* 카드형 이미지 더미 (디자인용) */}
          <div className="relative mt-4 hidden md:block">
            <div className="absolute -top-6 -left-4 w-36 h-64 rounded-3xl bg-gradient-to-b from-pink-500/80 to-purple-700/80 blur-sm" />
            <div className="absolute top-6 left-12 w-40 h-72 rounded-3xl bg-gradient-to-b from-green-400/80 to-emerald-700/80 blur-sm" />
            <div className="relative w-60 h-80 rounded-3xl bg-neutral-900 border border-neutral-700 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-col justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-300 flex items-center justify-center text-lg">
                  😎
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">친한 친구 스토리</span>
                  <span className="text-xs text-neutral-400">
                    오늘 본 스토리 5개
                  </span>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-4xl">📱</span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>오늘도 기록해볼까?</span>
                <span className="text-pink-400">● LIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* ====== 오른쪽: 로그인 폼 ====== */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm space-y-4">
            {/* 로그인 카드 */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl px-8 py-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <div className="flex justify-center mb-8">
                <span className="text-2xl font-semibold">Instagram</span>
              </div>

              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="휴대폰 번호, 사용자 이름 또는 이메일 주소"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                  />
                </div>
                <div className="space-y-1">
                  <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-400 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors text-sm font-semibold py-2 mt-2 disabled:opacity-60"
                  disabled={!emailOrUsername || !password}
                >
                  로그인
                </button>

                <div className="mt-3 text-center">
                  <button
                    type="button"
                    className="text-xs text-neutral-400 hover:underline"
                  >
                    비밀번호를 잊으셨나요?
                  </button>
                </div>
              </form>
            </div>

            {/* 또는 / 페이스북으로 로그인 */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl px-8 py-4 text-center text-sm">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-blue-400"
              >
                <span>f</span>
                <span>Facebook으로 로그인</span>
              </button>
            </div>

            {/* 가입 유도 */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl px-8 py-4 text-center text-sm">
              <span className="text-neutral-300">계정이 없으신가요? </span>
              <Link
                href="/auth/register"
                className="text-blue-400 font-semibold hover:underline"
              >
                새 계정 만들기
              </Link>
            </div>

            {/* 푸터 */}
            <div className="mt-6 text-[11px] text-neutral-500 text-center space-y-1">
              <div className="flex flex-wrap justify-center gap-3">
                <span>Meta</span>
                <span>소개</span>
                <span>블로그</span>
                <span>채용 정보</span>
                <span>도움말</span>
                <span>API</span>
                <span>개인정보처리방침</span>
                <span>약관</span>
              </div>
              <div>한국어 · © {new Date().getFullYear()} Instagram from Meta</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
