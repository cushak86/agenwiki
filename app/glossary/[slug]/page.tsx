import Link from "next/link";
import { notFound } from "next/navigation";
import { AiDisclosure } from "@/components/AiDisclosure";
import { Mdx } from "@/components/Mdx";
import { Prose } from "@/components/Prose";
import { RelatedContent } from "@/components/RelatedContent";
import { TagChips } from "@/components/TagChips";
import { getAll, getAllSlugs, getBySlug } from "@/lib/content";
import { buildBreadcrumbJsonLd, definedTermJsonLd, metadataForContent } from "@/lib/seo";
import type { GlossaryMeta } from "@/lib/types";

// 가나다순 이전/다음 용어 — 사전을 넘겨 보듯 연속으로 읽는 순회 경로.
function siblingTerms(current: GlossaryMeta) {
  const terms = (getAll("glossary") as GlossaryMeta[]).sort((a, b) => a.term.localeCompare(b.term, "ko"));
  const index = terms.findIndex((t) => t.slug === current.slug);

  return {
    prev: index > 0 ? terms[index - 1] : undefined,
    next: index >= 0 && index + 1 < terms.length ? terms[index + 1] : undefined
  };
}

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs("glossary").map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const { meta } = getBySlug("glossary", params.slug);
    return metadataForContent("glossary", meta);
  } catch {
    return {};
  }
}

export default function GlossaryDetailPage({ params }: { params: { slug: string } }) {
  let record;

  try {
    record = getBySlug("glossary", params.slug);
  } catch {
    notFound();
  }

  const meta = record.meta as GlossaryMeta;

  const glossaryTerms = getAllSlugs("glossary");
  const relatedTerms = (meta.related ?? [])
    .filter((slug, index, self) => slug !== meta.slug && glossaryTerms.includes(slug) && self.indexOf(slug) === index)
    .map((slug) => getBySlug("glossary", slug).meta as GlossaryMeta);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "홈", pathname: "/" },
    { name: "용어사전", pathname: "/glossary" },
    { name: meta.term, pathname: `/glossary/${meta.slug}` }
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermJsonLd(meta)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-accent">{meta.category}</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">{meta.term}</h1>
        <p className="mt-4 leading-8 text-muted">{meta.shortDef}</p>
        <p className="mt-3 text-sm tabular-nums text-muted">
          최종 수정 <time dateTime={meta.updatedAt}>{meta.updatedAt}</time>
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
      {relatedTerms.length > 0 ? (
        <section className="prose-shell mt-10">
          <h2 className="text-lg font-semibold text-ink">관련 용어</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {relatedTerms.map((term) => (
              <li key={term.slug}>
                <Link
                  href={`/glossary/${term.slug}`}
                  className="rounded-full border border-line bg-panel px-3 py-1.5 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
                >
                  {term.term}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {(() => {
        const { prev, next } = siblingTerms(meta);
        if (!prev && !next) {
          return null;
        }
        return (
          <nav aria-label="이전·다음 용어" className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/glossary/${prev.slug}`}
                className="rounded-lg border border-line bg-panel p-4 transition hover:border-accent/60"
              >
                <p className="text-xs font-semibold text-muted">← 이전 용어</p>
                <p className="mt-1 text-sm font-bold leading-snug text-ink">{prev.term}</p>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/glossary/${next.slug}`}
                className="rounded-lg border border-line bg-panel p-4 text-right transition hover:border-accent/60"
              >
                <p className="text-xs font-semibold text-muted">다음 용어 →</p>
                <p className="mt-1 text-sm font-bold leading-snug text-ink">{next.term}</p>
              </Link>
            ) : null}
          </nav>
        );
      })()}
      <AiDisclosure title={meta.term} pathname={`/glossary/${meta.slug}`} />
      <RelatedContent type="glossary" slug={meta.slug} tags={meta.tags} />
    </div>
  );
}
