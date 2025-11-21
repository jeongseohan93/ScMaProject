import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "chatDate",
  description: "챗, 캘린더",
};

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}