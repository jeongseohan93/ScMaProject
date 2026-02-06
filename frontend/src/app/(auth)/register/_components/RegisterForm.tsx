"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/src/lib/api/authApi.client";
import Button from "@/src/components/ui/Button";
import TextInput from "@/src/components/ui/TextInput";
import Select from "@/src/components/ui/Select";
import type { Gender, RegisterPayload } from "@/src/lib/types/auth.types";
import { getErrorMessage } from "@/src/lib/api/error";

type RegisterFormState = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  birth: string;
  gender: "" | Gender;
  agreeTerms: boolean;
};

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterFormState>({
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

  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const validate = () => {
    if (!form.email.trim()) return "이메일을 입력해주세요.";
    if (!form.password.trim()) return "비밀번호를 입력해주세요.";
    if (form.password.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
    if (form.password !== form.confirmPassword)
      return "비밀번호와 비밀번호 확인이 일치하지 않습니다.";
    if (!form.name.trim()) return "이름을 입력해주세요.";
    if (!form.agreeTerms) return "약관에 동의해야 가입할 수 있습니다.";
    return null;
  };

  const detectTimeZone = () => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Seoul";
    } catch {
      return "Asia/Seoul";
    }
  };

  const detectPreferredLanguage = (): "ko" | "en" | "ja" => {
    try {
      const lang = navigator.language.toLowerCase();
      if (lang.startsWith("ko")) return "ko";
      if (lang.startsWith("ja")) return "ja";
      return "en";
    } catch {
      return "ko";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      setErrors(error);
      return;
    }

    setErrors(null);
    setLoading(true);

    // ✅ 자동 감지(= UI 노출 제거)
    const timeZone = detectTimeZone();
    const preferredLanguage = detectPreferredLanguage();

    const payload: RegisterPayload = {
      email: form.email.trim(),
      password: form.password,
      name: form.name.trim(),
      nickname: form.nickname.trim() ? form.nickname.trim() : undefined,
      phoneNumber: form.phoneNumber.trim() ? form.phoneNumber.trim() : undefined,
      birth: form.birth || undefined,
      gender: form.gender || undefined,
      preferredLanguage,
      timeZone,
    };

    try {
      // ✅ axios 기반이면 여기서 res.ok / res.json() 하면 안 됨
      await register(payload);

      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      router.replace("/login");
    } catch (err: unknown) {
      // axios 에러 메시지 안전 처리
      console.error(err);
      setErrors(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* 에러 표시 */}
      {errors && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errors}
        </div>
      )}

      <TextInput
        name="email"
        type="email"
        placeholder="이메일 (필수)"
        value={form.email}
        onChange={handleChange}
      />

      <TextInput
        name="password"
        type="password"
        placeholder="비밀번호 (필수)"
        value={form.password}
        onChange={handleChange}
      />

      <TextInput
        name="confirmPassword"
        type="password"
        placeholder="비밀번호 확인"
        value={form.confirmPassword}
        onChange={handleChange}
      />

      <TextInput
        name="name"
        placeholder="이름 (실명, 필수)"
        value={form.name}
        onChange={handleChange}
      />

      <TextInput
        name="nickname"
        placeholder="닉네임 (선택)"
        value={form.nickname}
        onChange={handleChange}
      />

      <TextInput
        name="phoneNumber"
        placeholder="전화번호 (선택)"
        value={form.phoneNumber}
        onChange={handleChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          name="birth"
          type="date"
          value={form.birth}
          onChange={handleChange}
        />

        <Select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          placeholder="성별 (선택)"
          options={[
            { label: "남성", value: "MALE" },
            { label: "여성", value: "FEMALE" },
            { label: "기타", value: "OTHER" },
          ]}
        />
      </div>

      {/* 약관 동의 (체크박스 UI가 없어서 폼에서 true로 못 바꾸면 항상 막힘)
          필요 없으면 validate에서 agreeTerms 체크 제거하거나,
          아래 체크박스를 추가해서 사용자가 체크할 수 있게 해야 함
      */}
      <label className="flex items-center gap-3 text-sm text-white/70 select-none">
        <input
          type="checkbox"
          name="agreeTerms"
          checked={form.agreeTerms}
          onChange={handleChange}
          className="h-4 w-4 rounded border border-white/20 bg-transparent"
        />
        약관에 동의합니다.
      </label>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "처리 중..." : "계정 만들기"}
      </Button>
    </form>
  );
}
