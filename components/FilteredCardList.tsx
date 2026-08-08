"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ContentCard } from "@/components/ContentCard";
import { topicHref } from "@/lib/meta";
import { getTopicName } from "@/lib/topics";
import type { ContentMeta, ContentType } from "@/lib/types";

export type CardEntry = { type: ContentType; meta: ContentMeta };

const DIFFICULTY_TABS = [
  { key: "all", label: "전체" },
  { key: "intro", label: "입문" },
  { key: "advanced", label: "실전·연구" }
] as const;

type DifficultyKey = (typeof DIFFICULTY_TABS)[number]["key"];

function difficultyOf(meta: ContentMeta): DifficultyKey {
  return "category" in meta && meta.category === "입문" ? "intro" : "advanced";
}

/**
 * ?topic= 쿼리와 동기화되는 태그 필터 상태.
 * useSearchParams 대신 location/history 를 직접 쓴다 — force-static 페이지에서 Suspense 경계 없이 동작.
 */
export function useTopicFilter() {
  const [topic, setTopic] = useState<string | null>(null);

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("topic");
    if (initial) {
      setTopic(initial);
    }
  }, []);

  function selectTopic(next: string | null) {
    setTopic(next);
    const url = new URL(window.location.href);
    if (next) {
      url.searchParams.set("topic", next);
    } else {
      url.searchParams.delete("topic");
    }
    window.history.replaceState(null, "", url);
  }

  return { topic, selectTopic };
}

export function TopicFilterBar({
  tags,
  topic,
  selectTopic
}: {
  tags: [string, number][];
  topic: string | null;
  selectTopic: (tag: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map(([tag, count]) => {
        const active = topic === tag;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => selectTopic(active ? null : tag)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              active
                ? "border-accent bg-accentDeep/30 text-ink"
                : "border-line bg-panel text-muted hover:border-accent hover:text-accent"
            }`}
          >
            #{tag} <span className="tabular-nums opacity-70">{count}</span>
          </button>
        );
      })}
      {topic ? (
        <Link
          /* topicHref 를 쓴다. `*-prompts` 태그가 넘어오면 하드코딩된 /topics/ 는 308 로 나간다.
             지금 렌더되는 조합에서는 안 걸렸지만 태그 하나 늘면 바로 걸린다. */
          href={topicHref(topic)}
          className="text-xs font-semibold text-accent hover:text-accentSoft"
        >
          → {getTopicName(topic)} 토픽 전체 보기
        </Link>
      ) : null}
    </div>
  );
}

/**
 * 태그(?topic= 동기화)·난이도 탭으로 좁힐 수 있는 카드 목록.
 * 콘텐츠가 수십 건 규모라 전부 클라이언트 사이드 필터로 처리한다.
 */
export function FilteredCardList({
  entries,
  withDifficultyTabs = false,
  columns = "md:grid-cols-3"
}: {
  entries: CardEntry[];
  withDifficultyTabs?: boolean;
  columns?: string;
}) {
  const [tab, setTab] = useState<DifficultyKey>("all");
  const { topic, selectTopic } = useTopicFilter();

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of entries) {
      for (const tag of entry.meta.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  const visible = entries.filter(
    (entry) =>
      (tab === "all" || difficultyOf(entry.meta) === tab) &&
      (!topic || entry.meta.tags.includes(topic))
  );

  return (
    <div>
      {withDifficultyTabs ? (
        <div className="flex gap-2" role="tablist" aria-label="난이도">
          {DIFFICULTY_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                tab === t.key
                  ? "bg-accentDeep text-white"
                  : "border border-line bg-panel text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className={withDifficultyTabs ? "mt-4" : ""}>
        <TopicFilterBar tags={tags} topic={topic} selectTopic={selectTopic} />
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-sm text-muted">조건에 맞는 글이 없습니다. 필터를 해제해 보세요.</p>
      ) : (
        <div className={`mt-6 grid gap-4 ${columns}`}>
          {visible.map((entry) => (
            <ContentCard
              key={`${entry.type}-${entry.meta.slug}`}
              type={entry.type}
              meta={entry.meta}
              onTagClick={(tag) => selectTopic(topic === tag ? null : tag)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
