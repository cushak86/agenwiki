import { ContentCard } from "@/components/ContentCard";
import { SubscribeForm } from "@/components/SubscribeForm";
import { getAll } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { ContentMeta, ContentType } from "@/lib/types";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "agenwiki",
  description: "AI 전반 지식백과와 에이전트 실전 가이드",
  pathname: "/"
});

const sections: { type: ContentType; title: string; items: ContentMeta[] }[] = [
  { type: "guides", title: "최신 가이드", items: getAll("guides").slice(0, 3) },
  { type: "glossary", title: "픽업 용어", items: getAll("glossary").slice(0, 3) },
  { type: "prompts", title: "인기 프롬프트", items: getAll("prompts").slice(0, 3) },
  { type: "newsletter", title: "뉴스레터", items: getAll("newsletter").slice(0, 3) }
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="grid gap-8 border-b border-line pb-12 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <p className="text-sm font-semibold text-accent">AI knowledge base</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-ink md:text-5xl">
            AI 에이전트 시대의 지식과 실전 흐름을 한곳에 정리합니다.
          </h1>
        </div>
        <p className="text-base leading-8 text-muted">
          가이드, 용어사전, 프롬프트, 뉴스레터 아카이브를 태그 기반으로 연결하는 한국어 AI 지식 허브입니다.
        </p>
      </section>

      <div className="mt-12 space-y-12">
        {sections.map((section) => (
          <section key={section.type} className="space-y-5">
            <h2 className="text-2xl font-semibold text-ink">{section.title}</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {section.items.map((item) => (
                <ContentCard key={item.slug} type={section.type} meta={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <section id="subscribe" className="mt-12">
        <SubscribeForm />
      </section>
    </div>
  );
}
