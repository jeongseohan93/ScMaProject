"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * 브라우저에서 /api/auth/me를 한 번 호출해 백엔드가 내려주는
 * Set-Cookie 헤더를 실제 브라우저 쿠키에 반영한다.
 * (서버 컴포넌트에서 요청하면 Set-Cookie가 클라이언트로 전달되지 않음)
 */
export default function AuthCookieSync() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok && res.status === 401 && !cancelled) {
          router.replace("/login");
        }
      })
      .catch(() => {
        /* 네트워크 오류는 무시 (다음 네비게이션 시 재시도) */
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  return null;
}
