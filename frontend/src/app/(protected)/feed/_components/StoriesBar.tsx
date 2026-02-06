import Avatar from "@/src/components/ui/Avatar";
import IconButton from "@/src/components/ui/IconButton";

function StoryItem({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-400">
        <div className="rounded-full bg-[#0f1418] p-[3px]">
          <Avatar size={56} />
        </div>
      </div>
      <div className="w-[70px] truncate text-xs text-white/80 text-center">
        {label}
      </div>
    </div>
  );
}

export default function StoriesBar() {
  const items = ["js_2634", "k__hn.a", "ghjm_jw", "hyanggito...", "hhny0703"];

  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-4">
      {items.map((it) => (
        <StoryItem key={it} label={it} />
      ))}

      <div className="flex items-center pl-2">
        <IconButton ariaLabel="next story">{`→`}</IconButton>
      </div>
    </div>
  );
}
