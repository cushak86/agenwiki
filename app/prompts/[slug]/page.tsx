import { notFound } from "next/navigation";
import { Mdx } from "@/components/Mdx";
import { PromptCopyButton } from "@/components/PromptCopyButton";
import { Prose } from "@/components/Prose";
import { RelatedContent } from "@/components/RelatedContent";
import { TagChips } from "@/components/TagChips";
import { getAllSlugs, getBySlug } from "@/lib/content";
import { metadataForContent } from "@/lib/seo";
import type { PromptMeta } from "@/lib/types";

export const dynamic = "force-static";
export const dynamicParams = false;

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-accent">{meta.targetModel}</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">{meta.title}</h1>
        <p className="mt-4 leading-8 text-muted">{meta.description}</p>
        <div className="mt-5">
          <TagChips tags={meta.tags} />
        </div>
      </div>
      <section className="mt-8 max-w-3xl rounded-lg border border-line bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-ink">복사 대상 프롬프트</h2>
          <PromptCopyButton text={meta.promptText} />
        </div>
        <pre className="overflow-x-auto rounded-md bg-neutral-950 p-4 text-sm leading-7 text-neutral-100">
          <code>{meta.promptText}</code>
        </pre>
      </section>
      <div className="mt-10">
        <Prose>
          <Mdx source={record.body} />
        </Prose>
      </div>
      <RelatedContent type="prompts" slug={meta.slug} tags={meta.tags} />
    </div>
  );
}
