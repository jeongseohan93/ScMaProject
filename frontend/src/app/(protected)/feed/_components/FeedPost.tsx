import Avatar from "@/src/components/ui/Avatar";
import IconButton from "@/src/components/ui/IconButton";
import Card from "@/src/components/ui/Card";

export default function FeedPost() {
  return (
    <article className="mx-auto max-w-[560px]">
      {/* Header */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Avatar size={36} />
          <div className="text-sm">
            <div className="font-semibold text-white/90">promppy_com</div>
            <div className="text-xs text-white/45">1일</div>
          </div>
        </div>

        <button
          type="button"
          className="text-sm text-blue-400 hover:text-blue-300 transition"
        >
          팔로우
        </button>
      </div>

      {/* Media placeholder */}
      <Card className="aspect-square w-full flex items-center justify-center text-white/35">
        MEDIA (placeholder)
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3">
        <div className="flex items-center gap-4">
          <IconButton ariaLabel="like" />
          <IconButton ariaLabel="comment" />
          <IconButton ariaLabel="share" />
        </div>
        <IconButton ariaLabel="save" />
      </div>

      {/* Meta */}
      <div className="pt-3 space-y-1">
        <div className="text-sm text-white/85">
          <span className="font-semibold">1.1천</span> 좋아요
        </div>
        <div className="text-sm text-white/75">
          <span className="font-semibold">promppy_com</span>{" "}
          <span className="text-white/70">배터리 교체 맡겼더니...</span>
        </div>
        <div className="text-sm text-white/40">… 더 보기</div>
      </div>
    </article>
  );
}
