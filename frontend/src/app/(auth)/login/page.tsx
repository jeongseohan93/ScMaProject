import { redirect } from "next/navigation";
import LoginLayout from "./_components/LoginLayout";
import { authmeServer } from "@/src/lib/api/authApi.server";

export default async function LoginPage() {
    
    const data = await authmeServer().catch(() => null);

    if(data?.user?.id) redirect('/feed');
    
  return <LoginLayout />;
}
