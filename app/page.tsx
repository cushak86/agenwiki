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

      <section className="mt-12">
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

      <section id="subscribe" className="mt-14">
        <SubscribeForm />
      </section>
    </div>
  );
}
