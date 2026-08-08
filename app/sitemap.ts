import type { MetadataRoute } from "next";
import { CHAINS } from "@/lib/chains";
import { getAll, getAllTags } from "@/lib/content";
import { promptHubOf } from "@/lib/meta";
import { absoluteUrl } from "@/lib/seo";
import type { ContentMeta, ContentType, PromptMeta } from "@/lib/types";

const staticRoutes = [
  "/",
  "/guides",
  "/glossary",
  "/prompts",
  "/prompts/builder",
  "/tools",
  "/tools/claude-md",
  "/tools/llm-cost",
  "/tools/model-compare",
  "/tools/model-picker",
  "/tools/chunking",
  ...CHAINS.map((chain) => `/prompts/chains/${chain.slug}`),
  "/store",
  "/newsletter",
  "/topics",
  "/about",
  "/lab/index-log",
  "/terms",
  "/privacy",
  "/rankup",
  "/rankup/tools/keyword-vault.html"
];
// 프롬프트는 개별 URL 이 없다(2026-08-09 허브로 통합) — 사이트맵에도 허브만 올린다.
// 여기에 "prompts" 를 다시 넣으면 301 되는 죽은 URL 30개를 구글에 제출하게 된다.
const contentTypes: ContentType[] = ["guides", "glossary", "newsletter"];

const lastModified = (meta: ContentMeta) =>
  "updatedAt" in meta ? meta.updatedAt : meta.publishedAt;

/** 목록 중 가장 최신 lastModified. 비어 있으면 undefined — 모르는 날짜를 지어내지 않는다. */
const newestOf = (metas: ContentMeta[]) =>
  metas.length === 0
    ? undefined
    : metas.map(lastModified).reduce((max, date) => (date > max ? date : max));

export default function sitemap(): MetadataRoute.Sitemap {
  // 정적 라우트에는 lastModified 를 붙이지 않는다. 값을 모르는데 빌드 시각 같은 걸 넣으면
  // 배포할 때마다 "방금 바뀌었다"고 신고하게 되고, 구글은 일관되게 부정확한 lastmod 를
  // 통째로 무시한다 — **지어낸 날짜가 결측보다 나쁘다.**
  const pages = staticRoutes.map((route) => ({ url: absoluteUrl(route) }));

  const allContent = contentTypes.flatMap((type) => getAll(type).map((meta) => ({ type, meta })));

  // 프롬프트 허브 — 소속 프롬프트의 최신 발행일에서 lastModified 를 파생시킨다.
  const promptMetas = getAll("prompts") as PromptMeta[];
  const hubDates = new Map<string, string>();
  for (const meta of promptMetas) {
    const hub = promptHubOf(meta.tags);
    const current = hubDates.get(hub);
    if (!current || meta.publishedAt > current) {
      hubDates.set(hub, meta.publishedAt);
    }
  }
  const promptHubPages = [...hubDates.entries()].map(([hub, date]) => ({
    url: absoluteUrl(`/prompts/${hub}`),
    lastModified: date
  }));

  const contentPages = allContent.map(({ type, meta }) => ({
    url: absoluteUrl(`/${type}/${meta.slug}`),
    lastModified: lastModified(meta)
  }));

  // 토픽 페이지는 소속 글이 갱신되면 실제로 내용이 바뀐다 — 그 최신 날짜를 그대로 쓴다.
  // 지어내는 게 아니라 이미 갖고 있는 메타에서 파생하는 것이라, 글이 늘면 저절로 맞는다.
  // (2026-08-08 이전엔 토픽 15건 + 정적 21건 = 36건이 lastmod 없이 나가고 있었다.)
  const topicPages = getAllTags().map((tag) => ({
    url: absoluteUrl(`/topics/${encodeURIComponent(tag)}`),
    lastModified: newestOf(allContent.filter(({ meta }) => meta.tags.includes(tag)).map(({ meta }) => meta))
  }));

  return [...pages, ...contentPages, ...promptHubPages, ...topicPages];
}
