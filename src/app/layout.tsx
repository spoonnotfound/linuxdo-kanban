import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linux.do 任务面板",
  description: "Linux.do 鸿蒙项目任务追踪面板",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
