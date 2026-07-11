import { ContentCard } from "@/components/ContentCard";
import { getAll } from "@/lib/content";
import type { ContentMeta, ContentType } from "@/lib/types";

const MAX_RELATED = 4;
const CONTENT_TYPES: ContentType[] = ["guides", "glossary", "prompts", "newsletter"];

type Candidate = {
  type: ContentType;
  meta: ContentMeta;
  date: string;
};

function getDate(meta: ContentMeta): string {
  if ("publishedAt" in meta) {
    return meta.publishedAt;
  }

  return "updatedAt" in meta ? meta.updatedAt : "";
}

function collectCandidates(excludeType: ContentType, excludeSlug: string): Candidate[] {
  return CONTENT_TYPES.flatMap((type) =>
    getAll(type)
      .filter((meta) => !(type === excludeType && meta.slug === excludeSlug))
      .map((meta) => ({ type, meta, date: getDate(meta) }))
  );
}

/**
 * 현재 글과 같은 토픽 태그를 공유하는 다른 콘텐츠를 최대 4개까지 추천한다(자기 자신 제외).
 * 여러 태그를 공유하는 글을 우선하고, 부족하면 같은 콘텐츠 타입의 최신 글로 보충한다.
 * 빌드 타임(서버 컴포넌트)에서 계산한다.
 */
export function RelatedContent({ type, slug, tags }: { type: ContentType; slug: string; tags: string[] }) {
  const candidates = collectCandidates(type, slug);

  const shared = candidates
    .map((item) => ({
      ...item,
      sharedTagCount: item.meta.tags.filter((tag) => tags.includes(tag)).length
    }))
    .filter((item) => item.sharedTagCount > 0)
    .sort((a, b) => b.sharedTagCount - a.sharedTagCount || b.date.localeCompare(a.date));

  const picked = shared.slice(0, MAX_RELATED);

  if (picked.length < MAX_RELATED) {
    const pickedKeys = new Set(picked.map((item) => `${item.type}/${item.meta.slug}`));
    const fallback = candidates
      .filter((item) => item.type === type && !pickedKeys.has(`${item.type}/${item.meta.slug}`))
      .sort((a, b) => b.date.localeCompare(a.date));

    for (const item of fallback) {
      if (picked.length >= MAX_RELATED) {
        break;
      }

      picked.push({ ...item, sharedTagCount: 0 });
    }
  }

  if (picked.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-line pt-8">
      <h2 className="text-xl font-semibold text-ink">관련 글</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {picked.map((item) => (
          <ContentCard key={`${item.type}/${item.meta.slug}`} type={item.type} meta={item.meta} />
        ))}
      </div>
    </section>
  );
}
