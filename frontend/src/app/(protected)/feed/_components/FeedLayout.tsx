import SidebarNav from "./SideBarNav";
import StoriesBar from "./StoriesBar";
import FeedPost from "./FeedPost";
import RightRail from "./RightRail";

export default function FeedLayout() {
  return (
    <main className="min-h-screen bg-[#0f1418] text-white">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_360px]">
          <SidebarNav />

          {/* Center */}
          <section className="min-w-0 border-l border-white/5 border-r border-white/5">
            <div className="px-6 pt-6">
              <StoriesBar />
            </div>

            <div className="px-6 py-6 space-y-10">
              {/* UI-only: 일단 한 개만, 필요하면 배열로 반복 */}
              <FeedPost />
            </div>
          </section>

          <RightRail />
        </div>
      </div>
    </main>
  );
}
