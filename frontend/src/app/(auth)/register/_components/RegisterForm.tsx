"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/src/lib/api/auth-api.client"; // Axios 기반 함수
import { API_ENDPOINTS } from "@/src/lib/constants/api-endpoint";
import { AUTH_MESSAGES } from "@/src/lib/constants/messages";
import { registerSchema, RegisterInput } from "@/src/lib/validators/auth-schema";

import Button from "@/src/components/ui/Button";
import TextInput from "@/src/components/ui/TextInput";
import Select from "@/src/components/ui/Select";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<RegisterInput>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    nickname: "",
    phoneNumber: "",
    birth: "",
    gender: "",
    agreeTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const result = registerSchema.safeParse(form);

    if(!result.success) {
        setError(result.error.issues[0].message);
        return;
    }

    setError(null);
    setLoading(true);

    try {
      // 2. 타임존 및 언어 자동 감지
      const payload  = {
        ...result.data,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Seoul",
        preferredLanguage: navigator.language.startsWith("ko") ? "ko" : "en",
      };

      // 3. Axios 기반 가입 요청
      await registerAction(payload);

      alert(AUTH_MESSAGES.REGISTER_SUCCESS || "회원가입이 완료되었습니다!");
      router.replace('/login');

    } catch (err: unknown) {
        if(err instanceof Error) {
             setError(err.message || "가입 중 오류가 발생했습니다.");
        } else {
            setError("알 수 없는 에러가 발생했습니다.");
        } 
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <TextInput name="email" type="email" placeholder="이메일 (필수)" value={form.email} onChange={handleChange} />
      <TextInput name="password" type="password" placeholder="비밀번호 (필수)" value={form.password} onChange={handleChange} />
      <TextInput name="confirmPassword" type="password" placeholder="비밀번호 확인" value={form.confirmPassword} onChange={handleChange} />
      <TextInput name="name" placeholder="이름 (실명, 필수)" value={form.name} onChange={handleChange} />
      <TextInput name="nickname" placeholder="닉네임 (선택)" value={form.nickname} onChange={handleChange} />
      <TextInput name="phoneNumber" placeholder="전화번호 (선택)" value={form.phoneNumber} onChange={handleChange} />

      <div className="grid grid-cols-2 gap-4">
        <TextInput name="birth" type="date" value={form.birth} onChange={handleChange} />
        <Select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          options={[
            { label: "남성", value: "MALE" },
            { label: "여성", value: "FEMALE" },
            { label: "기타", value: "OTHER" },
          ]}
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-white/70 cursor-pointer">
        <input
          type="checkbox"
          name="agreeTerms"
          checked={form.agreeTerms}
          onChange={handleChange}
          className="h-4 w-4 rounded border-white/20 bg-transparent"
        />
        약관에 동의합니다.
      </label>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "처리 중..." : "계정 만들기"}
      </Button>
    </form>
  );
}