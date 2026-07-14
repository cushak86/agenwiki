import { notFound } from "next/navigation";
import { Mdx } from "@/components/Mdx";
import { OpenInButtons } from "@/components/OpenInButtons";
import { PromptCopyButton } from "@/components/PromptCopyButton";
import { PromptFillForm } from "@/components/PromptFillForm";
import { Prose } from "@/components/Prose";
import { RelatedContent } from "@/components/RelatedContent";
import { TagChips } from "@/components/TagChips";
import { getAllSlugs, getBySlug } from "@/lib/content";
import { buildBreadcrumbJsonLd, metadataForContent } from "@/lib/seo";
import type { PromptMeta } from "@/lib/types";

export const dynamic = "force-static";
export const dynamicParams = false;

// 빈칸 채우기 폼 파일럿. 복사 이벤트로 실사용 신호가 확인되면 전체 프롬프트로 확대한다.
const FILL_FORM_PILOT_SLUGS = new Set(["long-document-summary-prompt"]);

export function generateStaticParams() {
  return getAllSlugs("prompts").map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const { meta } = getBySlug("prompts", params.slug);
    return metadataForContent("prompts", meta);
  } catch {
    return {};
  }
}

export default function PromptDetailPage({ params }: { params: { slug: string } }) {
  let record;

  try {
    record = getBySlug("prompts", params.slug);
  } catch {
    notFound();
  }

  const meta = record.meta as PromptMeta;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "홈", pathname: "/" },
    { name: "프롬프트", pathname: "/prompts" },
    { name: meta.title, pathname: `/prompts/${meta.slug}` }
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-accent">{meta.targetModel}</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">{meta.title}</h1>
        <p className="mt-4 leading-8 text-muted">{meta.description}</p>
        <div className="mt-5">
          <TagChips tags={meta.tags} />
        </div>
      </div>
      <section className="mt-8 max-w-3xl rounded-lg border border-line bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">복사 대상 프롬프트</h2>
          <div className="flex flex-wrap items-center gap-2">
            <PromptCopyButton text={meta.promptText} slug={meta.slug} />
            <OpenInButtons text={meta.promptText} slug={meta.slug} />
          </div>
        </div>
        <pre className="overflow-x-auto rounded-md bg-neutral-950 p-4 text-sm leading-7 text-neutral-100">
          <code>{meta.promptText}</code>
        </pre>
      </section>
      {FILL_FORM_PILOT_SLUGS.has(meta.slug) ? <PromptFillForm promptText={meta.promptText} slug={meta.slug} /> : null}
      <div className="mt-10">
        <Prose>
          <Mdx source={record.body} />
        </Prose>
      </div>
      <RelatedContent type="prompts" slug={meta.slug} tags={meta.tags} />
    </div>
  );
}
