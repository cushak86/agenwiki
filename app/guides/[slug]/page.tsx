import Link from "next/link";
import { notFound } from "next/navigation";
import { AiDisclosure } from "@/components/AiDisclosure";
import { GuideProductCTA } from "@/components/GuideProductCTA";
import { Mdx } from "@/components/Mdx";
import { Prose } from "@/components/Prose";
import { RelatedContent } from "@/components/RelatedContent";
import { TableOfContents } from "@/components/TableOfContents";
import { TagChips } from "@/components/TagChips";
import { getAll, getAllSlugs, getBySlug } from "@/lib/content";
import { articleJsonLd, buildBreadcrumbJsonLd, metadataForContent } from "@/lib/seo";
import type { GuideMeta } from "@/lib/types";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs("guides").map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const { meta } = getBySlug("guides", params.slug);
    return metadataForContent("guides", meta);
  } catch {
    return {};
  }
}

// 같은 토픽(첫 태그) 안에서 발행일 순 이전/다음 글을 찾는다 — 한 번 들어온 방문자의 연속 읽기 경로.
function siblingGuides(meta: GuideMeta) {
  const topic = meta.tags[0];
  const series = (getAll("guides") as GuideMeta[]).filter((g) => g.tags[0] === topic);
  const index = series.findIndex((g) => g.slug === meta.slug);

  return {
    // getAll 은 최신순 — index+1 이 더 오래된 글(이전), index-1 이 더 새 글(다음)
    prev: index >= 0 && index + 1 < series.length ? series[index + 1] : undefined,
    next: index > 0 ? series[index - 1] : undefined
  };
}

export default function GuideDetailPage({ params }: { params: { slug: string } }) {
  let record;

  try {
    record = getBySlug("guides", params.slug);
  } catch {
    notFound();
  }

  const meta = record.meta as GuideMeta;
  const { prev, next } = siblingGuides(meta);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "홈", pathname: "/" },
    { name: "가이드", pathname: "/guides" },
    { name: meta.title, pathname: `/guides/${meta.slug}` }
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(meta)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-accent">{meta.category}</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">{meta.title}</h1>
        <p className="mt-4 leading-8 text-muted">{meta.description}</p>
        <p className="mt-3 text-sm tabular-nums text-muted">
          발행 <time dateTime={meta.publishedAt}>{meta.publishedAt}</time>
          {meta.updatedAt !== meta.publishedAt ? (
            <>
              {" · "}최종 수정 <time dateTime={meta.updatedAt}>{meta.updatedAt}</time>
            </>
          ) : null}
        </p>
        <div className="mt-5">
          <TagChips tags={meta.tags} />
        </div>
      </div>

      {meta.category === "비교" ? (
        <aside className="mt-8 max-w-3xl rounded-lg border border-accent/40 bg-panel p-4 text-sm leading-6 text-muted">
          <strong className="font-semibold text-ink">기준 시점: {meta.updatedAt.slice(0, 7)}</strong> — 모델·서비스
          비교는 빠르게 낡습니다. 이 글은 위 시점 기준이며, 최신 사양·가격은 각 서비스의 공식 문서를
          확인하세요.{" "}
          <Link href="/tools/model-compare" className="font-medium text-ink hover:text-accent">
            모델 스펙 비교표에서 정렬 비교 →
          </Link>
        </aside>
      ) : null}

      <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start lg:gap-10">
        <div className="min-w-0">
          <div className="lg:hidden">
            <TableOfContents body={record.body} />
          </div>
          <Prose>
            <Mdx source={record.body} />
          </Prose>
        </div>
        <aside className="hidden lg:sticky lg:top-24 lg:block">
          <TableOfContents body={record.body} />
        </aside>
      </div>

      {prev || next ? (
        <nav aria-label="이 토픽의 다른 글" className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/guides/${prev.slug}`}
              className="rounded-lg border border-line bg-panel p-4 transition hover:border-accent/60"
            >
              <p className="text-xs font-semibold text-muted">← 이 토픽의 이전 글</p>
              <p className="mt-1 text-sm font-bold leading-snug text-ink">{prev.title}</p>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/guides/${next.slug}`}
              className="rounded-lg border border-line bg-panel p-4 text-right transition hover:border-accent/60"
            >
              <p className="text-xs font-semibold text-muted">이 토픽의 다음 글 →</p>
              <p className="mt-1 text-sm font-bold leading-snug text-ink">{next.title}</p>
            </Link>
          ) : null}
        </nav>
      ) : null}

      <GuideProductCTA guideSlug={meta.slug} />
      <AiDisclosure title={meta.title} pathname={`/guides/${meta.slug}`} />
      <RelatedContent type="guides" slug={meta.slug} tags={meta.tags} />
    </div>
  );
}
