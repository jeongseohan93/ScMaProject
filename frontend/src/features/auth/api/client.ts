export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3005";

export type LoginResult =
  | { ok: true }
  | { ok: false; message?: string };

export async function loginRequest(email: string, password: string): Promise<LoginResult> {
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    credentials: "include", // ✅ HttpOnly 쿠키 받기
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) return { ok: true };

  // 에러 메시지 파싱(백엔드가 {message} 내려주는 케이스)
  try {
    const data = await res.json();
    return { ok: false, message: data?.message || "로그인 실패" };
  } catch {
    return { ok: false, message: "로그인 실패" };
  }
}

export async function logoutRequest(): Promise<void> {
  await fetch(`${BACKEND_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
