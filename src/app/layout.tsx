import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HEROZZ 経営ダッシュボード",
  description: "契約/発生ベース × 本日/昨日 の経営指標をリアルタイム表示",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
