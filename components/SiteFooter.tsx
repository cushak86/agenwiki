import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-muted md:grid-cols-[1fr_auto]">
        <p>agenwiki는 AI 전반 지식과 에이전트 실전 흐름을 정리하는 한국어 지식백과입니다.</p>
        <nav className="flex flex-wrap gap-4">
          <Link href="/about" className="hover:text-accent">
            소개
          </Link>
          <Link href="/terms" className="hover:text-accent">
            약관
          </Link>
          <Link href="/privacy" className="hover:text-accent">
            개인정보
          </Link>
          <Link href="/rss.xml" className="hover:text-accent">
            RSS
          </Link>
        </nav>
      </div>
    </footer>
  );
}
