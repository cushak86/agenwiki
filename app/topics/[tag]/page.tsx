import { ContentCard } from "@/components/ContentCard";
import { getAllTags, getByTag } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export function generateMetadata({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  return buildMetadata({
    title: `#${tag}`,
    description: `${tag} 태그로 묶인 agenwiki 콘텐츠`,
    pathname: `/topics/${encodeURIComponent(tag)}`
  });
}

export default function TopicPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const items = getByTag(tag);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">#{tag}</h1>
      <p className="mt-3 max-w-2xl leading-8 text-muted">가이드, 용어, 프롬프트, 뉴스레터를 태그 기준으로 모았습니다.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <ContentCard key={`${item.type}-${item.meta.slug}`} type={item.type} meta={item.meta} />
        ))}
      </div>
    </div>
  );
}
