import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ContentMeta, ContentRecord, ContentType, SearchItem, TaggedContent } from "@/lib/types";

const contentRoot = path.join(process.cwd(), "content");
const contentTypes: ContentType[] = ["guides", "glossary", "prompts", "newsletter"];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function typeDir(type: ContentType) {
  return path.join(contentRoot, type);
}

function mdxPath(type: ContentType, slug: string) {
  return path.join(typeDir(type), `${slug}.mdx`);
}

function ensureArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === "string" && value.length > 0) {
    return [value];
  }

  return [];
}

function fail(filePath: string, message: string): never {
  throw new Error(`Invalid frontmatter in ${filePath}: ${message}`);
}

function assertString(data: Record<string, unknown>, key: string, filePath: string) {
  const value = data[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    fail(filePath, `${key} must be a non-empty string`);
  }

  return value;
}

function assertDate(data: Record<string, unknown>, key: string, filePath: string) {
  const value = assertString(data, key, filePath);
  const date = new Date(`${value}T00:00:00.000Z`);

  if (!datePattern.test(value) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    fail(filePath, `${key} must be a valid YYYY-MM-DD date`);
  }

  return value;
}

function assertNumber(data: Record<string, unknown>, key: string, filePath: string) {
  const value = data[key];

  if (typeof value !== "number" || !Number.isFinite(value)) {
    fail(filePath, `${key} must be a number`);
  }

  return value;
}

function validateTags(data: Record<string, unknown>, filePath: string) {
  const tags = ensureArray(data.tags).map((tag) => tag.trim()).filter(Boolean);

  if (tags.length === 0) {
    fail(filePath, "tags must include at least one non-empty tag");
  }

  return tags;
}

function validateSlug(data: Record<string, unknown>, fallbackSlug: string, filePath: string) {
  const slug = assertString(data, "slug", filePath);

  if (!slugPattern.test(slug)) {
    fail(filePath, "slug must use lowercase letters, numbers, and hyphens");
  }

  if (slug !== fallbackSlug) {
    fail(filePath, `slug "${slug}" must match filename "${fallbackSlug}"`);
  }

  return slug;
}

function validateCommon(data: Record<string, unknown>, fallbackSlug: string, filePath: string) {
  if (data.draft !== undefined && typeof data.draft !== "boolean") {
    fail(filePath, "draft must be a boolean when provided");
  }

  return {
    slug: validateSlug(data, fallbackSlug, filePath),
    tags: validateTags(data, filePath),
    draft: data.draft as boolean | undefined
  };
}

function validateMeta(type: ContentType, data: Record<string, unknown>, fallbackSlug: string, filePath: string): ContentMeta {
  const common = validateCommon(data, fallbackSlug, filePath);

  switch (type) {
    case "guides":
      return {
        ...common,
        title: assertString(data, "title", filePath),
        description: assertString(data, "description", filePath),
        category: assertString(data, "category", filePath),
        publishedAt: assertDate(data, "publishedAt", filePath),
        updatedAt: assertDate(data, "updatedAt", filePath),
        author: assertString(data, "author", filePath),
        cover: data.cover === undefined ? undefined : assertString(data, "cover", filePath)
      };
    case "glossary":
      return {
        ...common,
        term: assertString(data, "term", filePath),
        aliases: ensureArray(data.aliases),
        shortDef: assertString(data, "shortDef", filePath),
        category: assertString(data, "category", filePath),
        updatedAt: assertDate(data, "updatedAt", filePath),
        related: ensureArray(data.related)
      };
    case "prompts":
      return {
        ...common,
        title: assertString(data, "title", filePath),
        description: assertString(data, "description", filePath),
        targetModel: assertString(data, "targetModel", filePath),
        publishedAt: assertDate(data, "publishedAt", filePath),
        promptText: assertString(data, "promptText", filePath),
        variables: ensureArray(data.variables)
      };
    case "newsletter":
      return {
        ...common,
        title: assertString(data, "title", filePath),
        issueNumber: assertNumber(data, "issueNumber", filePath),
        publishedAt: assertDate(data, "publishedAt", filePath),
        summary: assertString(data, "summary", filePath)
      };
  }
}

function parseFile(type: ContentType, filePath: string): ContentRecord {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data as Record<string, unknown>;
  const fallbackSlug = path.basename(filePath, ".mdx");
  const meta = validateMeta(type, data, fallbackSlug, filePath);

  return { meta, body: parsed.content };
}

function sortDate(meta: ContentMeta) {
  if ("publishedAt" in meta) {
    return meta.publishedAt;
  }

  return "updatedAt" in meta ? meta.updatedAt : "";
}

export function getAll(type: ContentType): ContentMeta[] {
  const dir = typeDir(type);

  if (!fs.existsSync(dir)) {
    return [];
  }

  // 날짜 게이트: 미래 publishedAt 글은 빌드 시점에 목록·sitemap·RSS·라우트(getAllSlugs 경유) 전부에서 제외된다.
  // 정적 사이트라 게이트는 재빌드 시점에 평가된다 — 예약 발행은 미래 날짜가 아니라 draft:true로 관리하고,
  // 매일 재빌드(예약 발행 크론)가 결선되면 미래 날짜 글도 해당 날짜의 빌드부터 자동 공개된다.
  const today = new Date().toISOString().slice(0, 10);

  return fs
    .readdirSync(dir)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => parseFile(type, path.join(dir, fileName)).meta)
    .filter((meta) => !meta.draft)
    .filter((meta) => {
      const published = "publishedAt" in meta ? meta.publishedAt : "";
      return published === "" || published <= today;
    })
    .sort((a, b) => sortDate(b).localeCompare(sortDate(a)));
}

export function getBySlug(type: ContentType, slug: string): ContentRecord {
  return parseFile(type, mdxPath(type, slug));
}

export function getAllSlugs(type: ContentType): string[] {
  return getAll(type).map((meta) => meta.slug);
}

export function getByTag(tag: string): TaggedContent[] {
  const normalizedTag = decodeURIComponent(tag).toLowerCase();

  return contentTypes.flatMap((type) =>
    getAll(type)
      .filter((meta) => meta.tags.some((item) => item.toLowerCase() === normalizedTag))
      .map((meta) => ({ type, meta }))
  );
}

export function getAllTags(): string[] {
  const tags = contentTypes.flatMap((type) => getAll(type).flatMap((meta) => meta.tags));
  return Array.from(new Set(tags)).sort((a, b) => a.localeCompare(b, "ko"));
}

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

/**
 * 빌드/렌더 시점에 모든 콘텐츠(guides/glossary/prompts/newsletter)를 모아
 * title/description/tags 기준의 경량 검색 인덱스를 만든다.
 * fs를 사용하는 서버 전용 함수이므로 서버 컴포넌트에서만 호출하고,
 * 결과(SearchItem[])만 클라이언트 컴포넌트로 props 전달할 것.
 */
export function getSearchIndex(): SearchItem[] {
  return contentTypes.flatMap((type) =>
    getAll(type).map((meta) => ({
      type,
      slug: meta.slug,
      title: getContentTitle(meta),
      description: getContentDescription(meta),
      tags: meta.tags
    }))
  );
}
