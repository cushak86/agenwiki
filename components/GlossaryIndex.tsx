"use client";

import { useMemo } from "react";
import type { GlossaryMeta } from "@/lib/types";
import { ContentCard } from "@/components/ContentCard";
import { TopicFilterBar, useTopicFilter } from "@/components/FilteredCardList";

function groupKey(term: string) {
  const first = term.trim().charAt(0);
  return first ? first.toUpperCase() : "#";
}

export function GlossaryIndex({ items }: { items: GlossaryMeta[] }) {
  const { topic, selectTopic } = useTopicFilter();

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      for (const tag of item.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [items]);

  const visible = topic ? items.filter((item) => item.tags.includes(topic)) : items;

  const groups = visible.reduce<Record<string, GlossaryMeta[]>>((acc, item) => {
    const key = groupKey(item.term);
    acc[key] = acc[key] ?? [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div>
      <TopicFilterBar tags={tags} topic={topic} selectTopic={selectTopic} />

      <div className="mt-8 space-y-10">
        {Object.entries(groups)
          .sort(([a], [b]) => a.localeCompare(b, "ko"))
          .map(([key, terms]) => (
            <section key={key} className="space-y-4">
              <h2 className="border-b border-line pb-2 text-2xl font-semibold text-ink">{key}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {terms.map((term) => (
                  <ContentCard
                    key={term.slug}
                    type="glossary"
                    meta={term}
                    onTagClick={(tag) => selectTopic(topic === tag ? null : tag)}
                  />
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
