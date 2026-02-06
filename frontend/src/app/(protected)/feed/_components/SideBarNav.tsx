import Avatar from "@/src/components/ui/Avatar";
import NavItem from "@/src/app/(protected)/feed/_components/ui/NavItem";

export default function SidebarNav() {
  return (
    <aside className="hidden lg:flex min-h-screen sticky top-0 flex-col px-4 py-6">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-3">
        <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/10" />
        <div className="text-sm font-semibold tracking-wide text-white/90">
          Instagram
        </div>
      </div>

      <nav className="space-y-2">
        <NavItem label="홈" href="/" />
        <NavItem label="모임 검색" href="/class-search" />
        <NavItem label="메시지" href="/messages" />
        <NavItem label="검색" href="/friend-search" />
        <NavItem label="알림" href="/notifications" />
      </nav>

      <div className="mt-auto space-y-3 px-3 pt-6">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/5 transition">
          <Avatar size={28} />
          <span className="text-sm text-white/85">프로필</span>
        </div>

        <button
          type="button"
          className="w-full text-left text-sm text-white/70 hover:text-white/90 transition"
        >
          더 보기
        </button>

        <div className="space-y-2 text-xs text-white/35">
          <div>Meta의 다른 앱</div>
        </div>
      </div>
    </aside>
  );
}
