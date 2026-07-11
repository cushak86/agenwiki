import { notFound } from "next/navigation";
import { Mdx } from "@/components/Mdx";
import { Prose } from "@/components/Prose";
import { RelatedContent } from "@/components/RelatedContent";
import { SubscribeForm } from "@/components/SubscribeForm";
import { TagChips } from "@/components/TagChips";
import { getAllSlugs, getBySlug } from "@/lib/content";
import { buildBreadcrumbJsonLd, metadataForContent } from "@/lib/seo";
import type { NewsletterMeta } from "@/lib/types";

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
        <div className="mt-5">
          <TagChips tags={meta.tags} />
        </div>
      </div>
      <div className="mt-10">
        <Prose>
          <Mdx source={record.body} />
        </Prose>
      </div>
      <RelatedContent type="newsletter" slug={meta.slug} tags={meta.tags} />
      <section id="subscribe" className="mt-12">
        <SubscribeForm />
      </section>
    </div>
  );
}
