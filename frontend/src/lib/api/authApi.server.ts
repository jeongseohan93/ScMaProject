import "server-only";
import { headers } from "next/headers";

export async function authmeServer() {
  const h = await headers(); // ✅ await 필수 (Next sync dynamic API)
  const host = h.get("host");
  const proto = process.env.NODE_ENV === "production" ? "https" : "http";

  const res = await fetch(`${proto}://${host}/api/auth/me`, {
    method: "GET",
    cache: "no-store",
    headers: {
      cookie: h.get("cookie") ?? "",
    },
  });

  return res.json();
}
