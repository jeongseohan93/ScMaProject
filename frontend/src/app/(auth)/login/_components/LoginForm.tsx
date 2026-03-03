"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/src/lib/api/auth-api.client';
import { AUTH_MESSAGES } from '@/src/lib/constants/messages';
import { API_ENDPOINTS } from '@/src/lib/constants/api-endpoint';
import { loginSchema, LoginInput } from '@/src/lib/validators/auth-schema';
import Button from '@/src/components/ui/Button';
import TextInput from '@/src/components/ui/TextInput';

export default function LoginForm() {
    const router = useRouter();
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    const [ form, setForm ] = useState<LoginInput>({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const submitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validation = loginSchema.safeParse(form);
        if(!validation.success) {
            setError(validation.error.issues[0].message);
            return;
        }

        setError(null);
        setLoading(true);

        try {
            await loginAction(form);
            router.replace(API_ENDPOINTS.FEED);
            router.refresh();
        } catch ( err: unknown ){
            if(err instanceof Error){
                setError(err.message || AUTH_MESSAGES.LOGIN_ERROR_DEFAULT);
            } else {
                setError("알 수 없는 에러가 발생했습니다.")
            }
        } finally {
            setLoading(false);
        }
    }

    return (
    <form className="space-y-4" onSubmit={submitLogin}>
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
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
        {loading ? AUTH_MESSAGES.LOADING : "로그인"}
      </Button>
    </form>
  );
}