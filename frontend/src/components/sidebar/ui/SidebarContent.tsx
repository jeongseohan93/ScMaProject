"use client";

import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import SidebarItem from "./SidebarItem";

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  href: string; 
}

interface SidebarContentProps {
  menuItems: MenuItem[]; 
}

export default function SidebarContent({ menuItems }: SidebarContentProps) {
  const [isCollapsed, setIsCollapsed] = useState(true); // 기본 상태를 축소(true)로 설정

  return (
    <nav 
      // 1. Hover 이벤트 추가: 마우스 진입 시 확장, 이탈 시 축소
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
      className={`h-screen bg-black text-white border-r border-neutral-800 fixed left-0 top-0 z-50 py-5 px-3 flex flex-col justify-between transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[72px]" : "w-[245px]"
      }`}
    >
      <div>
        {/* 2. 클릭 이벤트 제거 및 로고 영역 유지 */}
        <div className="flex items-center h-12 mb-6 rounded-lg cursor-pointer hover:bg-neutral-900 transition-colors">
          <div className="w-12 h-12 flex items-center justify-center shrink-0">
            <div className="w-7 h-7 bg-neutral-600 rounded-lg flex items-center justify-center font-bold text-[10px]">
              IG
            </div>
          </div>
          <h1 className={`text-xl font-bold tracking-tighter whitespace-nowrap overflow-hidden transition-all duration-300 ${
            isCollapsed ? "w-0 opacity-0 ml-0" : "w-[120px] opacity-100 ml-1"
          }`}>
            Instagram
          </h1>
        </div>

        <ul className="space-y-1">
          {menuItems.map((item) => (
            <SidebarItem key={item.name} item={item} isCollapsed={isCollapsed} />
          ))}
        </ul>
      </div>

      <div className="flex items-center h-12 rounded-lg cursor-pointer hover:bg-neutral-900 transition-colors group relative">
        <div className="w-12 h-12 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
          <AiOutlineMenu size={26} />
        </div>
        <span className={`text-base whitespace-nowrap overflow-hidden transition-all duration-300 ${
          isCollapsed ? "w-0 opacity-0 ml-0" : "w-[130px] opacity-100 ml-2"
        }`}>
          더 보기
        </span>
      </div>
    </nav>
  );
}