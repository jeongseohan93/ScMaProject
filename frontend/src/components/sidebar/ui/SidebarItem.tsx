"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

// 1. 인터페이스 정의 (any 탈출)
interface MenuItem {
  name: string;
  icon: React.ReactNode;
  href: string; // 이동할 경로 추가
}

interface SidebarItemProps {
  item: MenuItem;
  isCollapsed: boolean;
}

export default function SidebarItem({ item, isCollapsed }: SidebarItemProps) {
  const pathname = usePathname();
  
  // 현재 경로와 메뉴의 href가 일치하는지 확인 (Active 상태)
  const isActive = pathname === item.href;

  return (
    <Link href={item.href}>
      <li className={`
        flex items-center h-12 rounded-lg cursor-pointer transition-colors group relative
        ${isActive ? "font-bold" : "hover:bg-neutral-900"}
      `}>
        {/* 아이콘 영역: Active 상태일 때 약간 더 강조하거나 애니메이션 추가 가능 */}
        <div className={`
          w-12 h-12 flex items-center justify-center shrink-0 transition-transform 
          group-hover:scale-105 ${isActive ? "scale-110" : ""}
        `}>
          {item.icon}
        </div>
        
        {/* 메뉴 이름 */}
        <span className={`
          text-base whitespace-nowrap overflow-hidden transition-all duration-300
          ${isCollapsed ? "w-0 opacity-0 ml-0" : "w-[130px] opacity-100 ml-2"}
          ${isActive ? "text-white" : "text-neutral-400"}
        `}>
          {item.name}
        </span>

        {/* 축소 상태 툴팁 */}
        {isCollapsed && (
          <div className="absolute left-[65px] bg-neutral-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap shadow-md">
            {item.name}
          </div>
        )}
      </li>
    </Link>
  );
}