'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignupPage: React.FC = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    nickname: '',
    phoneNumber: '',
    birth: '',
    gender: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validate = () => {
    if (!form.email.trim()) return '이메일을 입력해주세요.';
    if (!form.password.trim()) return '비밀번호를 입력해주세요.';
    if (form.password.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
    if (form.password !== form.confirmPassword)
      return '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
    if (!form.name.trim()) return '이름을 입력해주세요.';
    if (!form.agreeTerms) return '약관에 동의해야 가입할 수 있습니다.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setErrors(error);
      return;
    }

    setErrors(null);
    setLoading(true);

    // 🔹 1) 타임존 자동 감지
    let timeZone = 'Asia/Seoul';
    if (typeof window !== 'undefined') {
      try {
        const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (detectedTz) {
          timeZone = detectedTz;
        }
      } catch {
        // 실패하면 기본값 Asia/Seoul 유지
      }
    }

    // 🔹 2) 브라우저 언어 → ko/en/ja 매핑
    let preferredLanguage: 'ko' | 'en' | 'ja' = 'ko';
    if (typeof navigator !== 'undefined') {
      const lang = navigator.language.toLowerCase();

      if (lang.startsWith('ko')) preferredLanguage = 'ko';
      else if (lang.startsWith('ja')) preferredLanguage = 'ja';
      else preferredLanguage = 'en';
    }

    const payload = {
      email: form.email,
      password: form.password,
      name: form.name,
      nickname: form.nickname || null,
      phoneNumber: form.phoneNumber || null,
      birth: form.birth || null,
      gender: form.gender || null,
      preferredLanguage,
      timeZone,
    };

    try {
      // 👉 여기서 실제 백엔드 호출
      const res = await fetch('http://localhost:3005/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 쿠키를 쓸 거면 credentials 옵션도 나중에 붙일 수 있음
        // credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || '회원가입에 실패했습니다.');
      }

      // 성공
      // const data = await res.json(); // 필요하면 사용
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      router.push('/auth'); // 또는 '/' 로 바로 보내도 됨
    } catch (err: any) {
      console.error(err);
      setErrors(err.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-xl rounded-2xl bg-slate-800 p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6">회원가입</h1>

        {errors && (
          <div className="mb-4 rounded-md bg-red-500/10 border border-red-500 text-red-200 px-3 py-2 text-sm">
            {errors}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이메일 */} <div> <label className="block text-sm text-slate-200 mb-1"> 이메일 * </label> <input type="email" name="email" className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500" value={form.email} onChange={handleChange} placeholder="you@example.com" /> </div> {/* 비밀번호 */} <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label className="block text-sm text-slate-200 mb-1"> 비밀번호 * </label> <input type="password" name="password" className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500" value={form.password} onChange={handleChange} placeholder="8자 이상" /> </div> <div> <label className="block text-sm text-slate-200 mb-1"> 비밀번호 확인 * </label> <input type="password" name="confirmPassword" className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500" value={form.confirmPassword} onChange={handleChange} placeholder="비밀번호 재입력" /> </div> </div> {/* 이름 / 닉네임 */} <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label className="block text-sm text-slate-200 mb-1"> 이름 * </label> <input type="text" name="name" className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500" value={form.name} onChange={handleChange} placeholder="홍길동" /> </div> <div> <label className="block text-sm text-slate-200 mb-1"> 닉네임 </label> <input type="text" name="nickname" className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500" value={form.nickname} onChange={handleChange} placeholder="채팅에서 보이는 이름" /> </div> </div> {/* 휴대폰 / 생년월일 */} <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label className="block text-sm text-slate-200 mb-1"> 전화번호 </label> <input type="tel" name="phoneNumber" className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500" value={form.phoneNumber} onChange={handleChange} placeholder="010-1234-5678" /> </div> <div> <label className="block text-sm text-slate-200 mb-1"> 생년월일 </label> <input type="date" name="birth" className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500" value={form.birth} onChange={handleChange} /> </div> </div> {/* 성별 */} <div> <label className="block text-sm text-slate-200 mb-1"> 성별 </label> <select name="gender" className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500" value={form.gender} onChange={handleChange} > <option value="">선택 안 함</option> <option value="MALE">남성</option> <option value="FEMALE">여성</option> <option value="OTHER">기타</option> </select> </div> {/* 약관 동의 */} <div className="flex items-center gap-2 pt-2"> <input id="agreeTerms" type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500" /> <label htmlFor="agreeTerms" className="text-xs text-slate-300 cursor-pointer" > <span className="font-semibold">서비스 이용약관</span> 및{' '} <span className="font-semibold">개인정보 처리방침</span>에 동의합니다. </label> </div> {/* 버튼 */} <button type="submit" disabled={loading} className="mt-4 w-full rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed" > {loading ? '가입 중...' : '회원가입'} </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
