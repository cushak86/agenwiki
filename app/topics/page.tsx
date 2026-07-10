import Link from "next/link";
import { getByTag } from "@/lib/content";
import { TOPICS } from "@/lib/topics";
import { buildMetadata } from "@/lib/seo";
import type { ContentType } from "@/lib/types";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "토픽 전체 보기",
  description: "agenwiki 콘텐츠를 핵심 토픽 10개로 묶어 모아봅니다.",
  pathname: "/topics"
});

const typeLabels: Record<ContentType, string> = {
  guides: "가이드",
  glossary: "용어",
  prompts: "프롬프트",
  newsletter: "뉴스레터"
};

function countByType(items: { type: ContentType }[]) {
  return (Object.keys(typeLabels) as ContentType[])
    .map((type) => ({ type, count: items.filter((item) => item.type === type).length }))
    .filter((entry) => entry.count > 0);
}

export default function TopicsPage() {
  const topics = TOPICS.map((topic) => {
    const items = getByTag(topic.slug);
    return { ...topic, count: items.length, breakdown: countByType(items) };
  }).sort((a, b) => b.count - a.count);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">토픽 전체 보기</h1>
      <p className="mt-3 max-w-2xl leading-8 text-muted">agenwiki 콘텐츠를 핵심 토픽 10개로 묶어 모아봅니다.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/topics/${topic.slug}`}
            className="flex min-h-40 flex-col justify-between rounded-lg border border-line bg-white p-5 shadow-sm transition hover:border-accent"
          >
            <div className="space-y-2">
              <h2 className="text-lg font-semibold leading-snug text-ink">{topic.name}</h2>
              <p className="text-sm leading-6 text-muted">{topic.description}</p>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-medium text-muted">
              <span className="rounded-full border border-line px-3 py-1 text-accent">{topic.count}편</span>
              {topic.breakdown.map((entry) => (
                <span key={entry.type}>
                  {typeLabels[entry.type]} {entry.count}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
