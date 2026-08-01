import Link from "next/link";

const navItems = [
  { href: "/guides", label: "가이드" },
  { href: "/glossary", label: "용어사전" },
  { href: "/prompts", label: "프롬프트" },
  { href: "/newsletter", label: "뉴스레터" },
  { href: "/topics", label: "토픽" },
  { href: "/search", label: "검색" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-ink">
          agen<span className="text-accent">wiki</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
          <Link href="/store" className="font-bold text-accentSoft transition hover:text-ink">
            스토어
          </Link>
          <a
            href="#subscribe"
            className="rounded-lg bg-accentDeep px-4 py-2 font-semibold text-white transition hover:bg-accent"
          >
            구독
          </a>
        </nav>
      </div>
    </header>
  );
}
