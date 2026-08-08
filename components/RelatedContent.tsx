import { ContentCard } from "@/components/ContentCard";
import { getAll } from "@/lib/content";
// 고르는 규칙은 lib/relatedSelection.ts 에 있다 — 여기 다시 적지 마라.
// 렌더링 없이 돌려 볼 수 있어야 scripts/check-link-distribution.mjs 가 실제 동작을 잰다.
import { pickRelated, type Candidate } from "@/lib/relatedSelection";
import type { ContentMeta, ContentType } from "@/lib/types";

const CONTENT_TYPES: ContentType[] = ["guides", "glossary", "prompts", "newsletter"];

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
 * 빌드 타임(서버 컴포넌트)에서 계산한다.
 */
export function RelatedContent({ type, slug, tags }: { type: ContentType; slug: string; tags: string[] }) {
  const picked = pickRelated({ candidates: collectCandidates(type, slug), type, slug, tags });

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
