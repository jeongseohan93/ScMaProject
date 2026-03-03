export default function LeftHero() {
  return (
    <section className="relative hidden lg:flex items-center justify-center bg-black">
      <div className="w-full max-w-lg px-10">
        <div className="space-y-6">
          <div className="text-4xl font-semibold leading-tight tracking-tight">
            <span className="text-pink-500">친한 친구</span>의 일상 속 순간들을
            확인해
            <br />
            보세요.
          </div>

          <div className="mt-10 h-72 w-full rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/35">
            IMAGE AREA (placeholder)
          </div>
        </div>
      </div>
    </section>
  );
}