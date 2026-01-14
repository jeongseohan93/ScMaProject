import { redirect } from "next/navigation";
import { authMe } from "@/src/features/auth/api/auth";
import MyCalendarClient from "./MyCalendarClient";

export default async function MyCalendarPage() {
  const user = await authMe();
  if (!user) redirect("/auth/login");

  return <MyCalendarClient />;
}
