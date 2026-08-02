import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import "@/app/globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TopBanner } from "@/components/TopBanner";
import { organizationJsonLd, siteConfig, websiteJsonLd } from "@/lib/seo";

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <TopBanner />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
