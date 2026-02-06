import { redirect } from "next/navigation";
import { authmeServer } from "@/src/lib/api/authApi.server";
import AuthCookieSync from "@/src/components/auth/AuthCookieSync";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const data = await authmeServer();

    if (!data?.user?.id) redirect("/login");

    return (
      <>
        {/* 클라이언트에서 /api/auth/me를 호출해 Set-Cookie를 브라우저에 반영 */}
        <AuthCookieSync />
        {children}
      </>
    );
  } catch {
    redirect("/login");
  }
}
