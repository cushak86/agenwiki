// 「관련 글」 4개를 고르는 순수 로직. 렌더링과 분리해 둔 이유는 두 가지다.
//   ① 이 선택이 사이트 전체의 내부 링크 분배를 결정한다 — 112페이지 전부에 붙는 유일한 자동
//      링크 장치라, 여기서 편중이 생기면 그대로 "아무도 안 가리키는 페이지"가 된다.
//   ② 그래서 렌더링 없이 돌려 볼 수 있어야 한다. scripts/check-link-distribution.mjs 가
//      이 함수를 그대로 불러 인바운드 분포를 잰다. 로직을 스크립트에 다시 옮겨 적으면
//      두 사본이 갈라지고, 그러면 계측기가 실제 동작이 아니라 옛 동작을 재는 물건이 된다.
//
// 의존성을 여기 넣지 마라(next/*, 컴포넌트, fs). 순수하게 유지되는 것이 이 파일의 존재 이유다.
import type { ContentMeta, ContentType } from "./types";

export const MAX_RELATED = 4;

export type Candidate = {
  type: ContentType;
  meta: ContentMeta;
  date: string;
};

/**
 * 출발지에서 뽑는 결정적 오프셋.
 *
 * 왜 필요한가: 정렬 키(공유 태그 수 → 날짜)에 출발지 정보가 없으면, 같은 태그 집합을 가진 글들이
 * **전부 똑같은 상위 4개**를 고른다. 2026-08-08 실측에서 그 결과가 승자독식이었다 —
 * 112편 중 48편이 이 위젯으로부터 인바운드를 하나도 못 받고, /glossary/few-shot-learning
 * 한 곳이 25개를 가져갔다. 링크를 뿌리는 장치가 실은 몰아주고 있었다.
 * 크롤러에겐 "발견은 됐지만 아무도 안 가리키는 페이지"가 48개 생기고, 사람에겐 어느 글을 읽든
 * 관련 글 칸에 같은 4개가 뜨는 경험이 된다.
 *
 * 무작위가 아니라 해시인 이유: 빌드는 결정적이어야 한다. 같은 글은 언제 빌드해도 같은 추천을 받고,
 * 다른 글은 동점 구간의 다른 지점에서 시작한다.
 */
export function rotationOffset(seed: string, length: number) {
  if (length <= 1) {
    return 0;
  }

  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  return hash % length;
}

export function rotate<T>(items: T[], offset: number): T[] {
  if (items.length <= 1) {
    return items;
  }

  const at = offset % items.length;
  return [...items.slice(at), ...items.slice(0, at)];
}

/**
 * 같은 토픽 태그를 공유하는 글을 우선하고, 부족하면 같은 타입의 최신 글로 보충해 최대 4개를 고른다.
 * 우선순위(태그를 더 많이 공유하는 글이 먼저)는 그대로 두고, **동점 구간만** 출발지마다 회전시킨다.
 */
export function pickRelated({
  candidates,
  type,
  slug,
  tags
}: {
  candidates: Candidate[];
  type: ContentType;
  slug: string;
  tags: string[];
}): Candidate[] {
  const seed = `${type}/${slug}`;

  const shared = candidates
    .map((item) => ({
      ...item,
      sharedTagCount: item.meta.tags.filter((tag) => tags.includes(tag)).length
    }))
    .filter((item) => item.sharedTagCount > 0)
    .sort((a, b) => b.sharedTagCount - a.sharedTagCount || b.date.localeCompare(a.date));

  const tieGroups = new Map<number, typeof shared>();
  for (const item of shared) {
    const group = tieGroups.get(item.sharedTagCount) ?? [];
    group.push(item);
    tieGroups.set(item.sharedTagCount, group);
  }

  const picked = [...tieGroups.keys()]
    .sort((a, b) => b - a)
    .flatMap((count) => {
      const group = tieGroups.get(count) ?? [];
      return rotate(group, rotationOffset(seed, group.length));
    })
    .slice(0, MAX_RELATED);

  if (picked.length < MAX_RELATED) {
    const pickedKeys = new Set(picked.map((item) => `${item.type}/${item.meta.slug}`));
    // 보충 경로도 같은 병을 앓는다 — 최신순 고정이면 태그가 부족한 글들이 전부 같은 글을 가리킨다.
    const remaining = candidates
      .filter((item) => item.type === type && !pickedKeys.has(`${item.type}/${item.meta.slug}`))
      .sort((a, b) => b.date.localeCompare(a.date));

    for (const item of rotate(remaining, rotationOffset(seed, remaining.length))) {
      if (picked.length >= MAX_RELATED) {
        break;
      }

      picked.push({ ...item, sharedTagCount: 0 });
    }
  }

  return picked;
}
