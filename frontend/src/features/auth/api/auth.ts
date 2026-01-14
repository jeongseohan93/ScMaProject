// src/features/auth/api/auth.ts
import { cookies } from "next/headers";

type UserDTO = { id: string; nickname?: string; role?: string };

type AuthMeResponse =
  | { success: true; user: UserDTO }
  | { ok: true; user: UserDTO }
  | { success: false }
  | { ok: false }
  | any;

export async function authMe(): Promise<UserDTO | null> {
  try {
    const cookieHeader = (await cookies()).toString();

    const base = process.env.NEXT_PUBLIC_API_BASE; // 너가 쓰는 키 유지
    if (!base) return null;

    const res = await fetch(`${base}/auth/me`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = (await res.json()) as AuthMeResponse;

    // ✅ ok:true 또는 success:true 둘 중 하나면 통과
    const authed = data?.ok === true || data?.success === true;
    if (!authed) return null;

    return data?.user ?? null;
  } catch {
    return null;
  }
}
