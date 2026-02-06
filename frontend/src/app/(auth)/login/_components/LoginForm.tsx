"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from "@/src/components/ui/Button";
import TextInput from "@/src/components/ui/TextInput";
import { login } from '@/src/lib/api/authApi.client'
import { getErrorMessage } from '@/src/lib/api/error';
import { LoginFormState } from '@/src/lib/types/auth.types';

export default function LoginForm() {
  
  const router = useRouter();

  const [ form, setForm ] = useState<LoginFormState>({
    email: "",
    password:"",
  });

  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = ( e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({...prev, [name]: value}));
  };

  const submitLogin = async (e:React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    setErrors(null);
    setLoading(true);

    const loginInfo:LoginFormState = {
      email: form.email.trim(),
      password: form.password.trim(),
    }

    try {
      await login(loginInfo);
      router.replace("/feed");
      router.refresh();
    } catch (err: unknown) {
      setErrors(getErrorMessage(err));
    } finally{
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={submitLogin}>
      {errors && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errors}
        </div>
      )}
      <TextInput
        name="email"
        placeholder="휴대폰 번호, 사용자 이름 또는 이메일 주소"
        onChange={handleChange}
        value={form.email}
        autoComplete="username"
      />
      <TextInput
        name="password"
        type="password"
        placeholder="비밀번호"
        onChange={handleChange}
        value={form.password}
        autoComplete="current-password"
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
