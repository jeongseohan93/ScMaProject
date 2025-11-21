// app/login/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
        { email, password: pw },
        { withCredentials: true }
      );

      // 로그인 성공 시 SSR에서 자동 분기되도록 새로고침 또는 redirect
      window.location.replace("/");
    } catch {
      setError("로그인 실패. 이메일/비밀번호를 확인해 주세요.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm p-6 border rounded-lg shadow-sm bg-white flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center">로그인</h1>

        <div className="flex flex-col gap-2">
          <input
            className="border px-3 py-2 rounded"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border px-3 py-2 rounded"
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button className="bg-black text-white rounded py-2 hover:bg-gray-800">
          로그인
        </button>
      </form>
    </div>
  );
}
