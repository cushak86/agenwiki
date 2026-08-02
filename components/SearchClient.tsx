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

const TYPE_FILTERS: { key: ContentType | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "guides", label: "가이드" },
  { key: "glossary", label: "용어" },
  { key: "prompts", label: "프롬프트" },
  { key: "newsletter", label: "뉴스레터" }
];

// 검색어 입력 전 빈 화면에 보여줄 추천 검색어 — 현재 토픽 상위 개념에서 뽑았다.
const SUGGESTED_QUERIES = ["RAG", "프롬프트 인젝션", "MCP", "파인튜닝", "벡터 DB", "컨텍스트 윈도우", "멀티에이전트", "환각"];

function matches(item: SearchItem, query: string) {
  const needle = query.toLowerCase();

  if (item.title.toLowerCase().includes(needle)) {
    return true;
  }

  if (item.description.toLowerCase().includes(needle)) {
    return true;
  }

  if (item.tags.some((tag) => tag.toLowerCase().includes(needle))) {
    return true;
  }

  // 본문 발췌(헤딩+앞부분)까지 본다 — 제목에 없는 개념(청킹, 리랭킹 등)도 걸리게.
  return item.excerpt.toLowerCase().includes(needle);
}

export function SearchClient({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ContentType | "all">("all");
  const trimmed = query.trim();

  const results = useMemo(() => {
    if (trimmed.length === 0) {
      return [];
    }

    return items.filter((item) => matches(item, trimmed));
  }, [items, trimmed]);

  const visible = typeFilter === "all" ? results : results.filter((item) => item.type === typeFilter);

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
        className="w-full rounded-md border border-line bg-panel px-4 py-3 text-base text-ink outline-none transition placeholder:text-muted focus:border-accent"
      />

      <div className="mt-8">
        {trimmed.length === 0 ? (
          <div>
            <p className="text-sm leading-6 text-muted">
              제목·설명·태그와 본문 도입부를 기준으로 가이드·용어사전·프롬프트·뉴스레터 전체에서
              찾아드립니다. 이런 검색어로 시작해 보세요:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTED_QUERIES.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setQuery(suggestion)}
                  className="rounded-full border border-line bg-panel px-4 py-2 text-sm font-medium text-muted transition hover:border-accent hover:text-accent"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <p className="text-sm leading-6 text-muted">&ldquo;{trimmed}&rdquo;에 대한 결과가 없습니다.</p>
        ) : (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {TYPE_FILTERS.map((filter) => {
                  const count =
                    filter.key === "all" ? results.length : results.filter((r) => r.type === filter.key).length;
                  if (filter.key !== "all" && count === 0) {
                    return null;
                  }
                  return (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={() => setTypeFilter(filter.key)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        typeFilter === filter.key
                          ? "border-accent bg-accentDeep/30 text-ink"
                          : "border-line bg-panel text-muted hover:border-accent hover:text-accent"
                      }`}
                    >
                      {filter.label} <span className="tabular-nums opacity-70">{count}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-muted">총 {visible.length}개 결과</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {visible.map((item) => (
                <article
                  key={`${item.type}-${item.slug}`}
                  className="flex min-h-56 flex-col justify-between rounded-lg border border-line bg-panel p-5"
                >
                  <div className="space-y-3">
                    <span className="inline-block rounded-full border border-accent/40 px-2.5 py-0.5 text-xs font-bold text-accentSoft">
                      {typeLabels[item.type]}
                    </span>
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
