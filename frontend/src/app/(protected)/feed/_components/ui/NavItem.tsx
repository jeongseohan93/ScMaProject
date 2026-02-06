"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItemProps = {
  label: string;
  href: string;             
  icon?: React.ReactNode;
  className?: string;
};

export default function NavItem({ label, href, icon, className }: NavItemProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-3 rounded-xl px-3 py-2.5 transition text-sm",
        active
          ? "bg-white/10 text-white"
          : "text-white/80 hover:bg-white/5 hover:text-white",
        className ?? "",
      ].join(" ")}
    >
      <span className="grid h-5 w-5 place-items-center">
        {icon ?? <span className="h-4 w-4 rounded bg-white/10" />}
      </span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
