"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/guides", label: "가이드" },
  { href: "/glossary", label: "용어사전" },
  { href: "/prompts", label: "프롬프트" },
  { href: "/tools", label: "도구" },
  { href: "/newsletter", label: "뉴스레터" },
  { href: "/topics", label: "토픽" },
  { href: "/search", label: "검색" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // 페이지를 이동하면 모바일 메뉴를 닫는다.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:py-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-ink">
          agen<span className="text-accent">wiki</span>
        </Link>

        <nav className="hidden items-center gap-4 text-sm font-medium text-muted md:flex">
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

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-line text-ink md:hidden"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-line px-4 pb-4 pt-2 md:hidden">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-panel hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/store"
                className="block rounded-lg px-3 py-2.5 text-sm font-bold text-accentSoft transition hover:bg-panel"
              >
                스토어
              </Link>
            </li>
            <li className="pt-1">
              <a
                href="#subscribe"
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-accentDeep px-3 py-2.5 text-center text-sm font-semibold text-white"
              >
                구독
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
