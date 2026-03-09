export interface User {
    name: string;
    image: string;
    lastActive?: string;
}

export interface MenuItem {
    name: string;
    icon: React.ReactNode;
    href: string;
}

export interface ChatRoom {
  id: string;
  user: User;
  lastMessage?: string;
  isOnline?: boolean;
}
