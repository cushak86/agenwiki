import type { ContentMeta, ContentType } from "@/lib/types";

// fs 를 쓰지 않는 순수 메타 헬퍼 — 클라이언트 컴포넌트(목록 필터 등)에서도 import 할 수 있게
// lib/content.ts 에서 분리했다. content.ts 가 재수출하므로 기존 import 경로도 그대로 동작한다.

export function getContentHref(type: ContentType, slug: string) {
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
