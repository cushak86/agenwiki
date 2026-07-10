import { notFound } from "next/navigation";
import { Mdx } from "@/components/Mdx";
import { Prose } from "@/components/Prose";
import { TagChips } from "@/components/TagChips";
import { getAllSlugs, getBySlug } from "@/lib/content";
import { articleJsonLd, metadataForContent } from "@/lib/seo";
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

export default function GuideDetailPage({ params }: { params: { slug: string } }) {
  let record;

  try {
    record = getBySlug("guides", params.slug);
  } catch {
    notFound();
  }

  const meta = record.meta as GuideMeta;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(meta)) }} />
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-accent">{meta.category}</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">{meta.title}</h1>
        <p className="mt-4 leading-8 text-muted">{meta.description}</p>
        <div className="mt-5">
          <TagChips tags={meta.tags} />
        </div>
      </div>
      <div className="mt-10">
        <Prose>
          <Mdx source={record.body} />
        </Prose>
      </div>
    </div>
  );
}
