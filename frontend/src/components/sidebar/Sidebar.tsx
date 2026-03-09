import SidebarContent from "./ui/SidebarContent";
import { 
  AiFillHome, AiOutlineSearch, AiOutlineCompass, 
  AiOutlineMessage, AiOutlineHeart, AiOutlinePlusSquare 
} from "react-icons/ai";
import { RiVideoLine } from "react-icons/ri";

export default function Sidebar() {
  const menuItems = [
    { name: "홈", icon: <AiFillHome size={26} />, href: "/feed" },
    { name: "검색", icon: <AiOutlineSearch size={26} />, href: "/search" },
    { name: "탐색 탭", icon: <AiOutlineCompass size={26} />, href: "/explore" },
    { name: "릴스", icon: <RiVideoLine size={26} />, href: "/reels" },
    { name: "메시지", icon: <AiOutlineMessage size={26} />, href: "/direct" },
    { name: "알림", icon: <AiOutlineHeart size={26} />, href: "/notifications" },
    { name: "만들기", icon: <AiOutlinePlusSquare size={26} />, href: "/create" },
    { name: "프로필", icon: <div className="w-[26px] h-[26px] bg-neutral-600 rounded-full border border-neutral-500" />, href: "/profile" },
  ];

  return <SidebarContent menuItems={menuItems} />;
}