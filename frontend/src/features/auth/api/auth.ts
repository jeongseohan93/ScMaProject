import "server-only";
import { headers as nextHeaders } from "next/headers";
import { serverApi } from "@/src/lib/serverApi";
import type { CurrentUser } from "../types/types";

type AuthMeResponse = {
  success: boolean;
  user: CurrentUser;
};

export async function authMe(): Promise<CurrentUser | null> {
  // ✅ Next 16: headers()는 Promise
  const reqHeaders = await nextHeaders();
  const cookieHeader = reqHeaders.get("cookie") ?? "";

  // 쿠키 자체가 없으면 비로그인으로 취급
  if (!cookieHeader) return null;

  try {
    const res = await serverApi.get<AuthMeResponse>("/auth/me", {
      headers: {
        cookie: cookieHeader, // 대소문자 상관 없음
      },
    });

    if (!res.data?.success) return null;
    return res.data.user;
  } catch (e) {
    console.error("authMe error:", e);
    return null;
  }
}
