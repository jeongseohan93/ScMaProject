import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  const h = await headers();
  const cookie = h.get("cookie") ?? ""; // ✅ 브라우저가 보낸 cookie raw

  const beRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/me`, {
    method: "GET",
    headers: { cookie }, // ✅ 통째로 전달
    cache: "no-store",
  });

  // ✅ Set-Cookie 전달(중요)
  const res = new NextResponse(await beRes.text(), { status: beRes.status });

  const setCookie = beRes.headers.getSetCookie?.() ?? []; // node fetch 계열에서 지원되는 경우
  for (const c of setCookie) res.headers.append("set-cookie", c);

  // JSON 응답이면 content-type 맞추기
  const ct = beRes.headers.get("content-type");
  if (ct) res.headers.set("content-type", ct);

  return res;
}
