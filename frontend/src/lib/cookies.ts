import { cookies } from "next/headers";

/**
 * SSR 환경에서 현재 요청의 쿠키를 Cookie 헤더 문자열로 변환
 * 예: "foo=bar; token=abc"
 */
export async function buildServerCookieHeader(): Promise<string> {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}
