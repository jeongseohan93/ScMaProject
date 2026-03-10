"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_MESSAGES } from '@/src/lib/constants/messages';
import { API_ENDPOINTS } from '@/src/lib/constants/api-endpoint';
import { loginSchema, LoginInput } from '@/src/lib/validators/auth-schema';
import Button from '@/src/components/ui/Button';
import TextInput from '@/src/components/ui/TextInput';
import { loginAction } from '@/src/lib/api/auth.api-client';

export default function LoginForm() {

  // - 상태 관리 (로딩, 에러, 입력값)
    const router = useRouter();
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    const [ form, setForm ] = useState<LoginInput>({
        email: "",
        password: "",
    });

    // - 입력값 변경 이벤트 핸들러
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    // - 로그인 메인 로직
    const submitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

        // Zod를 이용한 1차 유효성 검사
        const validation = loginSchema.safeParse(form);
        if(!validation.success) {
            // 검사 실패 시 첫 번째 에러 메시지 띄우고 중단
            setError(validation.error.issues[0].message);
            return;
        }

        setError(null);
        setLoading(true);

        try {
            // 실제 API 호출 (백엔드로 데이터 전송)
            await loginAction(form);

            // 로그인 성공 시 피드 페이지로 이동 및 데이터 갱신
            router.replace(API_ENDPOINTS.FEED);
            router.refresh();
        } catch ( err: unknown ){
            // 에러 발생 처리 (네트워크 에러, 비번 틀림 등)
            if(err instanceof Error){
                setError(err.message || AUTH_MESSAGES.LOGIN_ERROR_DEFAULT);
            } else {
                setError("알 수 없는 에러가 발생했습니다.")
            }
        } finally {
          // 성공하든 실패하든 로딩 상태는 해제
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