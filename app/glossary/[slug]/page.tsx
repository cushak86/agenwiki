import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Prose } from "@/components/Prose";
import { TagChips } from "@/components/TagChips";
import { mdxComponents } from "@/components/mdx-components";
import { getAllSlugs, getBySlug } from "@/lib/content";
import { definedTermJsonLd, metadataForContent } from "@/lib/seo";
import type { GlossaryMeta } from "@/lib/types";

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermJsonLd(meta)) }} />
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-accent">{meta.category}</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">{meta.term}</h1>
        <p className="mt-4 leading-8 text-muted">{meta.shortDef}</p>
        <div className="mt-5">
          <TagChips tags={meta.tags} />
        </div>
      </div>
      <div className="mt-10">
        <Prose>
          <MDXRemote source={record.body} components={mdxComponents} />
        </Prose>
      </div>
    </div>
  );
}
