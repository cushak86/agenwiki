import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ContentMeta, ContentRecord, ContentType, SearchItem, TaggedContent } from "@/lib/types";

const contentRoot = path.join(process.cwd(), "content");
const contentTypes: ContentType[] = ["guides", "glossary", "prompts", "newsletter"];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

/**
 * 출처 블록 필수 규칙 — 단일 정의. 카테고리 문자열을 다른 곳에 복사하지 말 것.
 * (scripts/pipeline/publish.py 의 SOURCE_REQUIRED_* 와 반드시 같은 값을 유지한다.)
 *
 * ── 왜 category 기준인가
 * 2026-07-16 기준 content/guides 28건에서 출처 블록 유무는 category와 정확히 일치했다(예외 0).
 *   있음 12건 = "AI 연구" 11 + "AI 소식" 1
 *   없음 16건 = "입문" 10 + "비교" 5 + "실전" 1
 * 이전 규칙은 "guides면 출처 필수"였다(publish.py, type 기준). 그 규칙은 what-is-llm·
 * chatgpt-vs-claude 같은 개념 설명·비교글에도 원문 출처를 요구했다 — 기댈 원문이 없는 글에
 * 출처를 요구하는 규칙이라 현실과 맞지 않았고, 결국 지켜지지 않고 우회됐다(출처 블록 없는
 * guides 16건이 publish.py를 거치지 않은 일반 커밋으로 직접 들어왔다). 규칙이 콘텐츠보다
 * 틀렸던 것이므로, 콘텐츠를 고치는 대신 규칙을 콘텐츠에 맞췄다. 기존 28건은 전부 통과한다.
 *
 * ── 왜 guides 로 한정하는가 (category만으로 두지 않는 이유)
 * category 필드는 guides 와 glossary 에만 있다(lib/types.ts — prompts·newsletter 에는 없다).
 * 따라서 조건을 category 하나로만 두면 glossary 까지 조용히 사정권에 들어온다. glossary 는
 * 지금 category 를 "AI"/"AI 기본 개념" 으로 써서 우연히 겹치지 않을 뿐이고, 용어 하나가
 * "AI 연구" 로 분류되는 순간 출처 블록을 강요받는다. 그것은 /about 이 공개 선언한
 *   "특정 원문 하나에 기대지 않는 개념 설명, 용어 정의, 프롬프트 예시에는 출처 블록이 없습니다"
 * 와 정면으로 어긋난다. 공개 문서가 상위 규범이므로 규칙의 사정권을 guides 로 한정한다.
 *
 * ── 이 규칙이 여기 있는 이유
 * lib/content.ts 는 발행 경로와 무관하게 강제되는 유일한 지점이다. parseFile 은 content/ 의
 * 모든 .mdx 에 대해 빌드 중 실행되므로, 여기서 throw 하면 npm run build 가 깨지고 배포가 막힌다.
 * 스크립트 규율(publish.py)은 일반 커밋으로 우회됐지만 빌드는 우회할 수 없다.
 */
const SOURCE_REQUIRED_TYPE: ContentType = "guides";
const SOURCE_REQUIRED_CATEGORIES: readonly string[] = ["AI 연구", "AI 소식"];

/**
 * 출처 블록 형식: 줄 맨 앞이 ">", "출처:" 뒤 같은 줄에 http(s) URL 이 하나 이상.
 * 존재 여부만 본다 — URL 이 실제로 200 인지, 본문과 관련이 있는지는 여기서 검사하지 않는다.
 * 네트워크 호출은 빌드를 비결정적으로 만들고 arXiv 가 잠깐 죽으면 배포가 막히기 때문이다.
 * 실 200 확인은 빌드 밖 독립 스크립트가 한다: scripts/pipeline/check_source_links.py
 */
const sourceBlockPattern = /^>\s*출처:.*https?:\/\/\S+/m;

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

function requiresSourceBlock(type: ContentType, meta: ContentMeta): boolean {
  if (type !== SOURCE_REQUIRED_TYPE) {
    return false;
  }

  // guides 는 category 가 필수라 항상 존재하지만, 타입 좁히기를 위해 확인한다.
  return "category" in meta && SOURCE_REQUIRED_CATEGORIES.includes(meta.category);
}

/**
 * 근거로 삼은 원문이 있는 글(= 연구/소식 카테고리)에 출처 블록이 달려 있는지 검사한다.
 * 프론트매터가 아니라 본문(body)을 봐야 하므로 validateMeta 가 아닌 parseFile 에서 호출한다.
 */
function validateSourceBlock(type: ContentType, meta: ContentMeta, body: string, filePath: string) {
  if (!requiresSourceBlock(type, meta) || sourceBlockPattern.test(body)) {
    return;
  }

  const category = "category" in meta ? meta.category : "";

  throw new Error(
    [
      `Missing source block in ${filePath}`,
      `  category "${category}" 는 출처 블록이 필수인데 본문에서 찾지 못했습니다.`,
      "",
      "  왜 막혔나:",
      `    "${SOURCE_REQUIRED_CATEGORIES.join('" / "')}" 카테고리는 근거로 삼은 원문이 있는 글입니다.`,
      "    /about 출처 정책에 \"근거로 삼은 원문이 있는 글에는 글 끝에 출처 블록을 답니다\"라고",
      "    공개돼 있습니다. 공개 문서와 코드가 어긋나면 안 되므로 빌드가 막습니다.",
      "",
      "  고치는 법 — 둘 중 하나:",
      "    1) 기댄 원문이 있다면, 본문 끝에 출처 블록을 추가하세요:",
      '         > 출처: Kim et al., "논문 제목" (arXiv:2501.12345) https://arxiv.org/abs/2501.12345',
      '       형식: 줄 맨 앞이 ">", "출처:" 뒤 같은 줄에 http(s) URL 이 하나 이상.',
      "    2) 특정 원문 하나에 기대지 않는 개념 설명·비교글이라면, category 를 바꾸세요:",
      "         입문 / 비교 / 실전  (출처 블록이 필요 없는 카테고리)",
      "",
      "  규칙 정의: lib/content.ts 의 SOURCE_REQUIRED_CATEGORIES (근거 주석 참조).",
      "  URL 이 지금도 살아 있는지는 이 검사가 보지 않습니다 —",
      "  실 200 확인: python3 scripts/pipeline/check_source_links.py"
    ].join("\n")
  );
}

function parseFile(type: ContentType, filePath: string): ContentRecord {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data as Record<string, unknown>;
  const fallbackSlug = path.basename(filePath, ".mdx");
  const meta = validateMeta(type, data, fallbackSlug, filePath);

  validateSourceBlock(type, meta, parsed.content, filePath);

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
