import { ContentCard } from "@/components/ContentCard";
import { getAllTags, getByTag } from "@/lib/content";
import { getTopicDescription, getTopicName } from "@/lib/topics";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";
export const dynamicParams = false;

// `*-prompts` 태그는 토픽 페이지를 만들지 않는다 — /prompts/<tag> 허브가 같은 의도를 더 두껍게
// 담고 있어 둘 다 두면 자기잠식이다(lib/meta.ts topicHref 주석). 옛 URL 은 next.config.mjs 가 308 한다.
export function generateStaticParams() {
  return getAllTags()
    .filter((tag) => !tag.endsWith("-prompts"))
    .map((tag) => ({ tag }));
}

export function generateMetadata({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  return buildMetadata({
    title: getTopicName(tag),
    description: getTopicDescription(tag) ?? `${tag} 태그로 묶인 agenwiki 콘텐츠`,
    pathname: `/topics/${encodeURIComponent(tag)}`
  });
}

export default function TopicPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const items = getByTag(tag);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "홈", pathname: "/" },
    { name: "토픽", pathname: "/topics" },
    { name: getTopicName(tag), pathname: `/topics/${encodeURIComponent(tag)}` }
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <h1 className="text-3xl font-bold text-ink">{getTopicName(tag)}</h1>
      <p className="mt-3 max-w-2xl leading-8 text-muted">
        {getTopicDescription(tag) ?? "가이드, 용어, 프롬프트, 뉴스레터를 태그 기준으로 모았습니다."}
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <ContentCard key={`${item.type}-${item.meta.slug}`} type={item.type} meta={item.meta} />
        ))}
      </div>
    </div>
  );
}
