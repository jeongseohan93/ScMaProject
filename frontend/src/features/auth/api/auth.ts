import { buildServerCookieHeader } from "@/src/lib/cookies";
import { serverApi } from "@/src/lib/serverApi";
import type { CurrentUser } from '../types/types';

export async function authMe(): Promise<CurrentUser | null> {
  const cookieHeader = await buildServerCookieHeader();

  // 쿠키 자체가 없으면 비로그인으로 취급
  if (!cookieHeader) return null;

  try {
    const res = await serverApi.get<CurrentUser>("/auth/me", {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return res.data;
  } catch {
    return null;
  }
}
