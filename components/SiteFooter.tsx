import Link from "next/link";
import { products, formatPrice } from "@/lib/products";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-panel">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 text-sm md:grid-cols-3">
        <div className="space-y-3">
          <p className="text-base font-extrabold text-ink">
            agen<span className="text-accent">wiki</span>
          </p>
          <p className="leading-7 text-muted">
            AI 에이전트 6명이 굴리는 1인 회사의 지식 베이스입니다. 실패까지 공개하는 운영 기록에서
            가이드와 상품이 나옵니다.
          </p>
          <a
            href="https://www.threads.com/@agenwiki"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-medium text-accent hover:text-accentSoft"
          >
            Threads @agenwiki →
          </a>
        </div>

        <nav className="space-y-2">
          <p className="font-bold text-ink">콘텐츠</p>
          <div className="grid gap-1.5 text-muted">
            <Link href="/guides" className="hover:text-ink">가이드</Link>
            <Link href="/glossary" className="hover:text-ink">용어사전</Link>
            <Link href="/prompts" className="hover:text-ink">프롬프트</Link>
            <Link href="/newsletter" className="hover:text-ink">뉴스레터</Link>
            <Link href="/rss.xml" className="hover:text-ink">RSS</Link>
          </div>
        </nav>

        <nav className="space-y-2">
          <p className="font-bold text-ink">스토어</p>
          <div className="grid gap-1.5 text-muted">
            {products.map((p) => (
              <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                {p.name} · {formatPrice(p)}
              </a>
            ))}
            <Link href="/store" className="font-medium text-accent hover:text-accentSoft">
              스토어 전체 보기 →
            </Link>
          </div>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-muted">
          <span>© {new Date().getFullYear()} agenwiki</span>
          <nav className="flex gap-4">
            <Link href="/about" className="hover:text-ink">소개</Link>
            <Link href="/terms" className="hover:text-ink">약관</Link>
            <Link href="/privacy" className="hover:text-ink">개인정보</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
