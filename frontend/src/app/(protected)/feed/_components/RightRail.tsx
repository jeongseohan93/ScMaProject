import Avatar from "@/src/components/ui/Avatar";

function SuggestItem({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar size={36} />
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white/90 truncate">
            {name}
          </div>
          <div className="text-xs text-white/40">회원님을 위한 추천</div>
        </div>
      </div>
      <button type="button" className="text-sm text-blue-400 hover:text-blue-300">
        팔로우
      </button>
    </div>
  );
}

export default function RightRail() {
  const suggestions = ["LEEJIN", "이명진", "윤종이", "민주", "김형균"];

  return (
    <aside className="hidden lg:block min-h-screen sticky top-0 px-6 py-8">
      {/* Account box */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar size={44} />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white/90 truncate">
              seo_han93
            </div>
            <div className="text-xs text-white/45 truncate">정서한</div>
          </div>
        </div>
        <button type="button" className="text-sm text-blue-400 hover:text-blue-300">
          전환
        </button>
      </div>

      {/* Suggestions */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-white/70">
          회원님을 위한 추천
        </div>
        <button type="button" className="text-sm text-white/60 hover:text-white/80">
          모두 보기
        </button>
      </div>

      <div className="space-y-1">
        {suggestions.map((name) => (
          <SuggestItem key={name} name={name} />
        ))}
      </div>

      {/* Footer links */}
      <div className="mt-10 text-xs text-white/30 leading-relaxed">
        소개 · 도움말 · 홍보 센터 · API · 채용 정보 ·
        <br />
        개인정보처리방침 · 약관 · 위치 · 언어 · Meta Verified
        <div className="mt-4">© 2026 INSTAGRAM FROM META</div>
      </div>

      {/* Bottom message bubble */}
      <div className="fixed bottom-6 right-8 hidden lg:flex items-center gap-3 rounded-full bg-white/5 border border-white/10 px-4 py-3">
        <div className="h-6 w-6 rounded bg-white/10 border border-white/10" />
        <div className="text-sm text-white/80">메시지</div>
        <div className="flex items-center gap-2 pl-2">
          <Avatar size={20} />
          <Avatar size={20} />
          <Avatar size={20} />
        </div>
      </div>
    </aside>
  );
}
