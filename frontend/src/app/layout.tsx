import type { Metadata } from 'next';
import './globals.css'; // 테일윈드 설정이 들어있는 파일

export const metadata: Metadata = {
  title: "chatDate",
  description: "챗, 캘린더",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}