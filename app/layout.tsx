import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import "@/app/globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  verification: {
    // GSC 소유권 인증 토큰(공개값). Vercel 환경변수로 덮어쓸 수 있음.
    google:
      process.env.NEXT_PUBLIC_GSC_VERIFICATION ??
      "JQ07wJjhBF42tXyNQitGgdkk03TyUGeHjY3RewluX9U",
    other: {
      // 네이버 서치어드바이저 소유확인 토큰(공개값)
      "naver-site-verification": "c1adb4b8fea62db5e2a41e7d5182fe252236e679"
    }
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <Link
          href="/store"
          className="block bg-accentDeep px-4 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90"
        >
          📕 이 사이트를 굴린 428커밋의 기록이 상품이 됐습니다 — 전자책·스타터 키트 보기 →
        </Link>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
