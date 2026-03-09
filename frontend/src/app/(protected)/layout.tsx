import Sidebar from "@/src/components/sidebar/Sidebar";

export default function ProtectedLayout({ children,}: { children: React.ReactNode;}) {
    return (
        <div className="bg-black min-h-screen text-white flex">
            <Sidebar />
            <main className="flex-1 ml-[72px] transition-all duration-300 ease-in-out flex justify-center">
                {children}
            </main>
        </div>
    )
}