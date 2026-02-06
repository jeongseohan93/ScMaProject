import LeftHero from "./LeftHero";
import LoginPanel from "./LoginPanel";

export default function LoginLayout() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0f171c] text-white">
      <LeftHero />
      <section className="flex items-center justify-center py-10">
        <LoginPanel />
      </section>
    </main>
  );
}
