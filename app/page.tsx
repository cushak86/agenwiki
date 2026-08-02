import Link from "next/link";
import { ContentCard } from "@/components/ContentCard";
import { ProductCard } from "@/components/ProductCard";
import { SubscribeForm } from "@/components/SubscribeForm";
import { getAll } from "@/lib/content";
import { chronicleProducts } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";
import type { ContentMeta, ContentType } from "@/lib/types";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "agenwiki",
  description: "AI 전반 지식백과와 에이전트 실전 가이드",
  pathname: "/"
});

const guides = getAll("guides");
const glossary = getAll("glossary");
const prompts = getAll("prompts");
const newsletter = getAll("newsletter");

const sections: { type: ContentType; title: string; href: string; items: ContentMeta[] }[] = [
  { type: "guides", title: "최신 가이드", href: "/guides", items: guides.slice(0, 3) },
  { type: "glossary", title: "픽업 용어", href: "/glossary", items: glossary.slice(0, 3) },
  { type: "prompts", title: "인기 프롬프트", href: "/prompts", items: prompts.slice(0, 3) },
  { type: "newsletter", title: "뉴스레터", href: "/newsletter", items: newsletter.slice(0, 3) }
];

const stats = [
  { k: "실전 가이드", v: guides.length },
  { k: "용어 정리", v: glossary.length },
  { k: "프롬프트", v: prompts.length },
  { k: "운영 실록 커밋", v: "428+" }
];

// 히어로 바로 아래 3분기 진입 카드 — 방문자가 상품보다 콘텐츠를 먼저 만나게 한다.
const entryCards = [
  {
    href: "/guides/getting-started-with-ai-agents",
    label: "처음이라면",
    title: "AI 에이전트 입문 가이드",
    description: "에이전트가 무엇이고 어디서부터 시작하는지, 첫 걸음을 안내합니다."
  },
  {
    href: "/glossary",
    label: "용어부터",
    title: "AI 용어사전",
    description: "RAG, 임베딩, 환각 — 자주 마주치는 개념을 짧고 명확하게 확인합니다."
  },
  {
    href: "/prompts",
    label: "바로 쓰기",
    title: "복사해 쓰는 프롬프트",
    description: "역할·형식·품질 규칙까지 갖춘 프롬프트를 복사해 바로 씁니다."
  }
];

const tools = [
  { href: "/tools/llm-cost", label: "💰 LLM 요금 계산기", description: "내 사용량 기준 월 비용을 모델별 비교" },
  { href: "/tools/chunking", label: "✂️ RAG 청킹 시뮬레이터", description: "문서가 어떻게 잘리는지 눈으로 확인" },
  { href: "/tools", label: "⛓ 도구 전체 보기", description: "모델 비교표·위저드·빌더 등 도구 모음" }
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <section className="border-b border-line pb-12">
        <p className="text-sm font-bold uppercase tracking-widest text-accent">
          1인 AI 회사가 굴리는 지식 베이스
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-[1.2] tracking-tight text-ink md:text-5xl">
          AI 에이전트 시대의
          <br />
          지식과 <span className="text-accentSoft">실전 기록</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-body">
          가이드·용어사전·프롬프트를 태그로 연결한 한국어 AI 지식 허브입니다. 이 사이트 자체가 AI
          에이전트 6명이 운영하는 실험이고, 실패까지 포함한 그 기록이 콘텐츠가 됩니다.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.k} className="rounded-xl border border-line bg-panel px-4 py-3">
              <p className="text-2xl font-extrabold tabular-nums text-ink">{s.v}</p>
              <p className="mt-0.5 text-xs font-medium text-muted">{s.k}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="grid gap-4 md:grid-cols-3">
          {entryCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-xl border border-line bg-panel p-5 transition hover:-translate-y-0.5 hover:border-accent/60"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-accentSoft">{card.label}</p>
              <h2 className="mt-2 text-lg font-bold text-ink transition group-hover:text-accentSoft">
                {card.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-14 space-y-12">
        {sections.map((section) => (
          <section key={section.type} className="space-y-5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-bold text-ink">{section.title}</h2>
              <Link href={section.href} className="text-sm font-medium text-muted hover:text-accent">
                전체 보기 →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {section.items.map((item) => (
                <ContentCard key={item.slug} type={section.type} meta={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-ink">직접 만들어 보기</h2>
        <p className="mt-2 text-sm text-muted">읽는 데서 끝나지 않도록, 로그인 없이 쓰는 도구를 두었습니다.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-xl border border-line bg-panel p-5 transition hover:-translate-y-0.5 hover:border-accent/60"
            >
              <p className="text-sm font-semibold text-accent">{tool.label}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-ink">기록으로 만든 상품</h2>
          <Link href="/store" className="text-sm font-bold text-accent hover:text-accentSoft">
            스토어 전체 →
          </Link>
        </div>
        <p className="mt-2 text-sm text-muted">
          이 회사가 실제로 굴린 기록에서 나온 것들입니다. 각색은 없습니다.
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {chronicleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section id="subscribe" className="mt-14">
        <SubscribeForm />
      </section>
    </div>
  );
}
