import { redirect } from "next/navigation";
import { authmeServer } from "@/src/lib/api/authApi.server";

export default async function HomePage() {
  try {
    const data = await authmeServer();
    if (data?.user?.id) redirect("/feed");
  } catch (e) {
    // ignore and fall through
  }

  redirect("/login");
}
