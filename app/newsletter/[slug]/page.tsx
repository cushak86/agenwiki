import Link from "next/link";
import { notFound } from "next/navigation";
import { AiDisclosure } from "@/components/AiDisclosure";
import { Mdx } from "@/components/Mdx";
import { Prose } from "@/components/Prose";
import { RelatedContent } from "@/components/RelatedContent";
import { SubscribeForm } from "@/components/SubscribeForm";
import { TagChips } from "@/components/TagChips";
import { getAll, getAllSlugs, getBySlug } from "@/lib/content";
import { buildBreadcrumbJsonLd, metadataForContent } from "@/lib/seo";
import type { NewsletterMeta } from "@/lib/types";

// 호수 순 이전/다음 — guides·glossary 에 이미 있는 순회 패턴을 그대로 가져온다.
//
// 왜 필요했나 (2026-08-08): 링크 그래프를 실제로 파싱해 보니 뉴스레터 4편 전부가 본문·구조 어디에서도
// 인바운드 링크를 못 받는 고아였고, issue-1·2·4 는 RelatedContent 위젯에서조차 0이라 완전 고아였다.
// prev/next 구조 링크가 guides·glossary 에만 있고 여기엔 통째로 없었던 게 원인이다.
// 사이트맵 등재는 "발견" 신호일 뿐 "중요하다"는 신호가 아니라서, 아무도 가리키지 않는 URL 은
// 정확히 「발견됨 - 미색인」에 쌓인다. 읽는 사람에게도 다음 호로 갈 길이 없어 거기서 세션이 끝난다.
function siblingIssues(current: NewsletterMeta) {
  const issues = (getAll("newsletter") as NewsletterMeta[])
    .slice()
    .sort((a, b) => a.issueNumber - b.issueNumber);
  const index = issues.findIndex((i) => i.slug === current.slug);

  return {
    prev: index > 0 ? issues[index - 1] : undefined,
    next: index >= 0 && index + 1 < issues.length ? issues[index + 1] : undefined
  };
}

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs("newsletter").map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const { meta } = getBySlug("newsletter", params.slug);
    return metadataForContent("newsletter", meta);
  } catch {
    return {};
  }
}

export default function NewsletterDetailPage({ params }: { params: { slug: string } }) {
  let record;

  try {
    record = getBySlug("newsletter", params.slug);
  } catch {
    notFound();
  }

  const meta = record.meta as NewsletterMeta;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "홈", pathname: "/" },
    { name: "뉴스레터", pathname: "/newsletter" },
    { name: meta.title, pathname: `/newsletter/${meta.slug}` }
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-accent">Issue #{meta.issueNumber}</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">{meta.title}</h1>
        <p className="mt-4 leading-8 text-muted">{meta.summary}</p>
        <p className="mt-3 text-sm tabular-nums text-muted">
          발행 <time dateTime={meta.publishedAt}>{meta.publishedAt}</time>
        </p>
        <div className="mt-5">
          <TagChips tags={meta.tags} />
        </div>
      </div>
      <div className="mt-10">
        <Prose>
          <Mdx source={record.body} />
        </Prose>
      </div>
      <AiDisclosure title={meta.title} pathname={`/newsletter/${meta.slug}`} />
      {(() => {
        const { prev, next } = siblingIssues(meta);
        if (!prev && !next) {
          return null;
        }
        return (
          <nav aria-label="이전·다음 호" className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/newsletter/${prev.slug}`}
                className="rounded-lg border border-line bg-panel p-4 transition hover:border-accent/60"
              >
                <p className="text-xs font-semibold text-muted">← 이전 호 (Issue #{prev.issueNumber})</p>
                <p className="mt-1 text-sm font-bold leading-snug text-ink">{prev.title}</p>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/newsletter/${next.slug}`}
                className="rounded-lg border border-line bg-panel p-4 text-right transition hover:border-accent/60"
              >
                <p className="text-xs font-semibold text-muted">다음 호 (Issue #{next.issueNumber}) →</p>
                <p className="mt-1 text-sm font-bold leading-snug text-ink">{next.title}</p>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        );
      })()}
      <RelatedContent type="newsletter" slug={meta.slug} tags={meta.tags} />
      <section id="subscribe" className="mt-12">
        <SubscribeForm />
      </section>
    </div>
  );
}
