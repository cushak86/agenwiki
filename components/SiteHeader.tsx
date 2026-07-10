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
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="text-xl font-bold tracking-normal text-ink">
          agenwiki
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-accent">
              {item.label}
            </Link>
          ))}
          <a
            href="#subscribe"
            className="rounded-md bg-ink px-4 py-2 text-white transition hover:bg-accent"
          >
            구독
          </a>
        </nav>
      </div>
    </header>
  );
}
