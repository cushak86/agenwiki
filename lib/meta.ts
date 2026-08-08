import type { ContentMeta, ContentType } from "@/lib/types";

// fs 를 쓰지 않는 순수 메타 헬퍼 — 클라이언트 컴포넌트(목록 필터 등)에서도 import 할 수 있게
// lib/content.ts 에서 분리했다. content.ts 가 재수출하므로 기존 import 경로도 그대로 동작한다.

// 프롬프트는 개별 URL 을 갖지 않는다 — 태그별 허브 안의 앵커 섹션이다.
//
// 왜 (2026-08-09): 프롬프트 30편은 페이지에 실제로 렌더되는 고유 글자 수가 중앙값 979자였고
// (본문 508 + promptText 406 + 제목·설명), 30편 전부 1,500자 미만이었다. 게다가 30편 중 27편의
// h2 구조가 글자 하나까지 같았다("언제 쓰나 | 사용법 | 사용 예시 | 팁"). 979자짜리 근친 중복이
// 사이트맵의 20%를 차지하면 개별 색인의 한계효용이 없어 「발견됨 - 미색인」에 쌓이고,
// 그 덩어리가 사이트 전체 품질 평가를 끌어내려 멀쩡한 가이드의 색인까지 늦춘다.
// 30편을 각각 깊게 쓰는 대안은 26편분 신규 집필이라 비용이 30배다. 그래서 묶었다.
// 사람에게도 이쪽이 낫다 — 30번 클릭해 돌아다니지 않고 한 화면에서 골라 복사한다.
const PROMPT_HUB_FALLBACK = "prompt-engineering";

/** 프롬프트가 속할 허브 태그. `*-prompts` 태그를 우선하고, 없으면 프롬프트 설계 허브로 보낸다. */
export function promptHubOf(tags: string[]): string {
  const themed = tags.find((tag) => tag.endsWith("-prompts"));
  if (themed) {
    return themed;
  }

  return tags.includes(PROMPT_HUB_FALLBACK) ? PROMPT_HUB_FALLBACK : (tags[0] ?? PROMPT_HUB_FALLBACK);
}

/**
 * 콘텐츠의 정규 경로. **링크를 만드는 곳은 전부 이 함수를 거친다** —
 * 하드코딩하면 프롬프트처럼 경로 규칙이 바뀔 때 조용히 301 홉이 생기거나 죽은 링크가 남는다.
 */
export function getContentHref(type: ContentType, meta: ContentMeta) {
  return contentHref(type, meta.slug, meta.tags);
}

/**
 * 메타 객체 없이 (타입·슬러그·태그)만 있을 때 쓰는 하위 버전.
 * 검색 색인(SearchItem)처럼 ContentMeta 를 그대로 들고 있지 않은 소비자를 위해 열어 둔다 —
 * **경로 규칙을 두 벌로 만들지 않는 것이 목적이다.** 실제로 2026-08-09 에 프롬프트를 허브로
 * 옮긴 뒤, 경로를 하드코딩하고 있던 검색 결과만 죽은 URL(308 홉)을 가리키고 있었다.
 */
export function contentHref(type: ContentType, slug: string, tags: string[]) {
  if (type === "prompts") {
    return `/prompts/${promptHubOf(tags)}#${slug}`;
  }

  return `/${type}/${slug}`;
}

export function getContentTitle(meta: ContentMeta) {
  if ("term" in meta) {
    return meta.term;
  }

  return meta.title;
}

export function getContentDescription(meta: ContentMeta) {
  if ("description" in meta) {
    return meta.description;
  }

  if ("shortDef" in meta) {
    return meta.shortDef;
  }

  return meta.summary;
}
