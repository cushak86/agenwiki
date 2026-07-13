"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ContentType, SearchItem } from "@/lib/types";

const typeLabels: Record<ContentType, string> = {
  guides: "가이드",
  glossary: "용어",
  prompts: "프롬프트",
  newsletter: "뉴스레터"
};

function matches(item: SearchItem, query: string) {
  const needle = query.toLowerCase();

  if (item.title.toLowerCase().includes(needle)) {
    return true;
  }

  if (item.description.toLowerCase().includes(needle)) {
    return true;
  }

  return item.tags.some((tag) => tag.toLowerCase().includes(needle));
}

export function SearchClient({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();

  const results = useMemo(() => {
    if (trimmed.length === 0) {
      return [];
    }

    return items.filter((item) => matches(item, trimmed));
  }, [items, trimmed]);

  // 결과 0건 검색어는 다음 콘텐츠·도구 투자의 근거가 된다. 타이핑이 멈춘 뒤 1회만 기록.
  useEffect(() => {
    if (trimmed.length < 2 || results.length > 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      track("search_zero", { query: trimmed.slice(0, 50) });
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [trimmed, results.length]);

  return (
    <div>
      <label htmlFor="search-input" className="sr-only">
        검색어 입력
      </label>
      <input
        id="search-input"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="가이드, 용어, 프롬프트, 뉴스레터를 검색해보세요 (예: RAG, 에이전트, 프롬프트)"
        autoFocus
        className="w-full rounded-md border border-line bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-muted focus:border-accent"
      />

      <div className="mt-8">
        {trimmed.length === 0 ? (
          <p className="text-sm leading-6 text-muted">
            검색어를 입력하면 가이드·용어사전·프롬프트·뉴스레터에서 제목, 설명, 태그를 기준으로 결과를 찾아드립니다.
          </p>
        ) : results.length === 0 ? (
          <p className="text-sm leading-6 text-muted">&ldquo;{trimmed}&rdquo;에 대한 결과가 없습니다.</p>
        ) : (
          <div>
            <p className="mb-4 text-sm text-muted">총 {results.length}개 결과</p>
            <div className="grid gap-4 md:grid-cols-3">
              {results.map((item) => (
                <article
                  key={`${item.type}-${item.slug}`}
                  className="flex min-h-56 flex-col justify-between rounded-lg border border-line bg-white p-5 shadow-sm"
                >
                  <div className="space-y-3">
                    <span className="text-xs font-medium text-muted">{typeLabels[item.type]}</span>
                    <h3 className="text-lg font-semibold leading-snug text-ink">
                      <Link href={`/${item.type}/${item.slug}`} className="hover:text-accent">
                        {item.title}
                      </Link>
                    </h3>
                    <p className="text-sm leading-6 text-muted">{item.description}</p>
                  </div>
                  {item.tags.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
