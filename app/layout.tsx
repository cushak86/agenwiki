import type { Metadata } from "next";
import type { ReactNode } from "react";
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
      "JQ07wJjhBF42tXyNQitGgdkk03TyUGeHjY3RewluX9U"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <a
          href="https://www.latpeed.com/products/1TaKZ"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-accent px-4 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90"
        >
          📕 『1인 AI 회사 실전기』 출간 — 이 사이트를 굴리는 1인 AI 회사의 428커밋 실전 기록 · 런칭 특가 14,900원 →
        </a>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
