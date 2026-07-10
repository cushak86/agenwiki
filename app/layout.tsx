import type { Metadata } from "next";
import type { ReactNode } from "react";
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
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
