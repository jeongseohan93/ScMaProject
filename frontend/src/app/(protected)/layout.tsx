import Sidebar from "@/src/components/sidebar/Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black min-h-screen text-white flex">
      {/* 1. 왼쪽 사이드바 */}
      <Sidebar />

      {/* 2. 실제 페이지 내용물 
          주의: 현재 Sidebar가 클라이언트 컴포넌트라 layout에서 width를 바로 알 수 없습니다.
          실무에서는 Zustand로 상태를 관리해서 여기 padding-left 값을 동적으로 주거나,
          Sidebar가 본문을 밀어내게끔 flex 구조를 짭니다.
          일단은 가운데 정렬로 무난하게 보이도록 넉넉한 여백(pl-[72px] md:pl-[245px])을 줍니다.
      */}
      <main className="flex-1 ml-[72px] transition-all duration-300 ease-in-out flex justify-center">
        {children}
      </main>
    </div>
  );
}