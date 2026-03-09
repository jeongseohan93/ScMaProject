import LeftHero from "./LeftHero";
import RegisterPanel from "./RegisterPanel";

export default function RegisterLayout() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0f171c] text-white">
      <LeftHero />
      <section className="flex items-center justify-center py-10">
        <RegisterPanel />
      </section>
    </main>
  );
}