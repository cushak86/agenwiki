#!/usr/bin/env node
// 내부 링크 분배 계측기 — 「관련 글」 위젯이 링크를 뿌리는가, 몰아주는가.
//
// 왜 필요한가:
//   이 위젯은 콘텐츠 112편 전부에 붙는 **유일한 자동 내부링크 분배 장치**다. 여기서 편중이 생기면
//   그대로 "아무도 가리키지 않는 페이지"가 만들어진다. 사이트맵 등재는 크롤러에게 "발견" 신호일 뿐
//   "중요하다"는 신호가 아니라서, 인바운드가 0인 URL 은 정확히 「발견됨 - 미색인」에 쌓인다.
//   2026-08-08 실측: 동점 정렬이 결정적이라 112편 중 48편이 인바운드 0, 한 페이지가 25개 독식.
//
//   화면만 봐서는 절대 안 보이는 종류의 결함이다. 각 페이지에는 관련 글 4개가 멀쩡히 떠 있고,
//   "아무도 나를 가리키지 않는다"는 사실은 전체를 한 번에 세어야만 드러난다. 그래서 계측기를 둔다.
//
// 로직을 여기 다시 적지 않는다 — lib/relatedSelection.ts 의 pickRelated 를 그대로 부른다.
// 사본을 만들면 계측기가 실제 동작이 아니라 옛 동작을 재는 물건이 된다.
//
// 사용법:
//   node --experimental-strip-types scripts/check-link-distribution.mjs
//   node --experimental-strip-types scripts/check-link-distribution.mjs --max-orphans 0
//
// 종료 코드: 0 = 임계 이하, 1 = 인바운드 0인 페이지가 임계 초과.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { pickRelated } from "../lib/relatedSelection.ts";

const CONTENT_TYPES = ["guides", "glossary", "prompts", "newsletter"];
const CONTENT_DIR = "content";

const argv = process.argv.slice(2);
const maxOrphansArg = argv.indexOf("--max-orphans");
// 기본 임계 10 = **회귀 감지선**이지 목표치가 아니다. 수정 전 48편이었고 수정 후 5~7편이다.
//
// 왜 5도 6도 아닌 10인가 (2026-08-08 실측으로 배운 것):
//   처음에 6으로 잡았다가 글 한 편을 발행하자마자 7이 되어 경보가 울렸다. 회귀가 아니었다 —
//   꼬리에 있는 페이지들은 큰 동점 그룹에 속하면서 그 태그를 쓰는 출발지가 적어, 콘텐츠가
//   늘거나 줄 때마다 회전 창에서 밀렸다 들어왔다 한다. 한 자릿수 초반에서 흔들리는 게 정상이고
//   임계를 거기 딱 붙여 두면 **글을 쓸 때마다 빨간불이 켜진다** — 그런 경보는 곧 무시당한다.
//   잡아야 하는 것은 "두 자릿수로 돌아갔는가"다. 정렬이 다시 결정적으로 고정되면 즉시 40대가 된다.
//
// 이 숫자를 줄이려면 알고리즘이 아니라 **태그**를 손봐야 한다. 꼬리에 남는 글들은 공유 태그
// 경쟁에서 구조적으로 밀리는 쪽이고, 연결해 줄 태그를 하나 더 다는 것이 유일한 처방이다.
const MAX_ORPHANS = maxOrphansArg >= 0 ? Number(argv[maxOrphansArg + 1]) : 10;

/** 프론트매터에서 필요한 것만 뽑는다 — tags(배열)와 날짜. YAML 파서를 들이지 않는다. */
function parseFrontmatter(text) {
  const end = text.indexOf("\n---", 4);
  const head = text.slice(4, end === -1 ? text.length : end);
  const out = { tags: [] };
  let inTags = false;

  for (const raw of head.split("\n")) {
    const line = raw.replace(/\r$/, "");
    const item = line.match(/^\s*-\s*"?([^"]+)"?\s*$/);
    if (inTags && item) {
      out.tags.push(item[1].trim());
      continue;
    }
    inTags = false;

    const kv = line.match(/^([A-Za-z_][\w]*):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rest] = kv;
    if (key === "tags") {
      // 프론트매터에 두 형식이 섞여 있다: 여러 줄 목록(`tags:\n  - "x"`)과 인라인 배열(`tags: ["x"]`).
      // **프롬프트 30편은 전부 인라인 배열이다.** 2026-08-09 까지 이 파서가 인라인을 못 읽어
      // 프롬프트의 태그를 통째로 놓치고 있었고, 그래서 이 계측기가 프롬프트의 태그 공유 관계를
      // 보지 못했다. 계측기가 눈이 먼 것을 계측기로는 알 수 없다 — 다른 검사를 붙이다 드러났다.
      const inline = rest.trim().match(/^\[(.*)\]$/);
      if (inline) {
        for (const raw of inline[1].split(",")) {
          const v = raw.trim().replace(/^["']|["']$/g, "");
          if (v) out.tags.push(v);
        }
        inTags = false;
        continue;
      }
      inTags = rest.trim() === "";
      continue;
    }
    if (key === "slug" || key === "publishedAt" || key === "updatedAt") {
      out[key] = rest.trim().replace(/^"|"$/g, "");
    }
  }

  return out;
}

const all = [];
for (const type of CONTENT_TYPES) {
  for (const file of readdirSync(join(CONTENT_DIR, type))) {
    if (!file.endsWith(".mdx")) continue;
    const fm = parseFrontmatter(readFileSync(join(CONTENT_DIR, type, file), "utf8"));
    const slug = fm.slug ?? file.replace(/\.mdx$/, "");
    all.push({ type, meta: { slug, tags: fm.tags }, date: fm.publishedAt ?? fm.updatedAt ?? "" });
  }
}

const key = (c) => `${c.type}/${c.meta.slug}`;
const inbound = new Map(all.map((c) => [key(c), 0]));

for (const source of all) {
  const candidates = all.filter((c) => key(c) !== key(source));
  for (const target of pickRelated({
    candidates,
    type: source.type,
    slug: source.meta.slug,
    tags: source.meta.tags
  })) {
    inbound.set(key(target), (inbound.get(key(target)) ?? 0) + 1);
  }
}

const counts = [...inbound.values()].sort((a, b) => a - b);
const orphans = [...inbound.entries()].filter(([, n]) => n === 0);
const top = [...inbound.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

// ── 본문 링크까지 합친 '진짜 고아' ──────────────────────────────────────────
// 위 분포는 **위젯 인바운드만** 센다(회귀 감지용). 사람이 글 안에서 건 링크는 안 보인다.
// 그런데 어떤 글에 편집자가 직접 링크를 걸면 그건 위젯 4칸보다 강한 신호다 —
// 2026-08-09 에 편집 링크를 하나 달았는데 이 지표가 꿈쩍도 하지 않아서 드러났다.
// 그래서 본문 링크를 함께 세어 '진짜 고아'를 따로 보고한다. 임계는 위젯 쪽에만 건다
// (본문 링크는 글을 쓰다 자연히 늘고 줄어, 임계를 걸면 경보가 시끄러워진다).
const bodyInbound = new Map(all.map((c) => [key(c), 0]));
for (const type of CONTENT_TYPES) {
  for (const file of readdirSync(join(CONTENT_DIR, type))) {
    if (!file.endsWith(".mdx")) continue;
    const body = readFileSync(join(CONTENT_DIR, type, file), "utf8");
    for (const [, href] of body.matchAll(/\]\((\/(?:guides|glossary|prompts|newsletter)\/[a-z0-9-]+)/g)) {
      const k = href.slice(1); // "/guides/x" → "guides/x"
      if (bodyInbound.has(k) && k !== `${type}/${file.replace(/\.mdx$/, "")}`) {
        bodyInbound.set(k, bodyInbound.get(k) + 1);
      }
    }
  }
}
const trueOrphans = [...inbound.keys()].filter((k) => inbound.get(k) === 0 && (bodyInbound.get(k) ?? 0) === 0);

console.log(`\n콘텐츠 ${all.length}편 · 「관련 글」 위젯 인바운드 분포`);
console.log(`  인바운드 0    : ${orphans.length}편`);
console.log(`  중앙값        : ${counts[Math.floor(counts.length / 2)]}`);
console.log(`  최댓값        : ${top[0]?.[1]} (${top.map(([k, n]) => `${k}=${n}`).join(", ")})`);
if (orphans.length) console.log(`  0인 페이지    : ${orphans.map(([k]) => k).join(", ")}`);
console.log(`\n본문 링크까지 합치면 — 진짜 고아 ${trueOrphans.length}편${trueOrphans.length ? `: ${trueOrphans.join(", ")}` : ""}`);
console.log("  (위 위젯 수치와 다른 이유: 편집자가 본문에 직접 건 링크는 위젯 시뮬레이션에 안 잡힌다)");

// ── 경로 하드코딩 검사 ─────────────────────────────────────────────────────
// 콘텐츠 링크는 lib/meta.ts 의 getContentHref/contentHref 를 거쳐야 한다.
// 2026-08-09 에 프롬프트를 허브 앵커로 옮겼을 때, 경로를 손으로 조립하던 두 곳
// (ContentCard·SearchClient)만 죽은 URL(308 홉)을 가리켰다. 화면은 멀쩡했다 —
// 리다이렉트가 받아 주니까. 그래서 사람 눈으로는 안 잡히고 이렇게 세어야 잡힌다.
const HARDCODE_RE = /href=\{`\/\$\{(?:type|item\.type|entry\.type)\}\//;
const scanDirs = ["components", "app"];
const offenders = [];
const walk = (dir) => {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, name.name);
    if (name.isDirectory()) walk(full);
    else if (/\.tsx?$/.test(name.name) && HARDCODE_RE.test(readFileSync(full, "utf8"))) offenders.push(full);
  }
};
for (const dir of scanDirs) walk(dir);

// **본문(MDX)도 본다.** 2026-08-09 실측: 프롬프트 개별 URL 을 폐기하고 리다이렉트까지 넣었는데
// content/**/*.mdx 의 마크다운 링크 20개가 옛 주소를 그대로 가리키고 있었다. 그중 4개는
// 허브가 자기 자신으로 308 하는 링크였다 — 사람이 누르면 아무 일도 안 일어난 것처럼 보인다.
// .tsx 만 훑던 이 가드는 그걸 구조적으로 못 잡았고, 그 사실을 모른 채 "0건"이라고 커밋했다.
// 링크는 코드보다 본문에 더 많다. 본문을 안 보는 링크 검사는 반쪽이다.
const promptSlugs = new Set(
  readdirSync(join(CONTENT_DIR, "prompts"))
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
);
for (const type of CONTENT_TYPES) {
  for (const file of readdirSync(join(CONTENT_DIR, type))) {
    if (!file.endsWith(".mdx")) continue;
    const full = join(CONTENT_DIR, type, file);
    for (const [, slug] of readFileSync(full, "utf8").matchAll(/\]\(\/prompts\/([a-z0-9-]+)\)/g)) {
      if (promptSlugs.has(slug)) offenders.push(`${full}  → /prompts/${slug} (폐기된 개별 URL)`);
    }
  }
}

if (offenders.length) {
  console.log(`\n❌ 콘텐츠 경로를 하드코딩한 곳 ${offenders.length}개 — lib/meta.ts 의 contentHref 를 쓰세요.`);
  offenders.forEach((f) => console.log(`   ${f}`));
  process.exit(1);
}
console.log("✅ 콘텐츠 경로 하드코딩 0건");

// ── 렌더 안 된 마크다운 검사 ─────────────────────────────────────────────────
// 한국어 문서에서 가장 흔한 마크다운 사고: `**강조(영문)**조사` 처럼 닫는 `**` 앞이 문장부호이고
// 뒤가 한글이면 CommonMark 의 right-flanking 조건을 못 채워 **굵게 처리가 안 되고 별표가 그대로 찍힌다.**
// 2026-08-09 실측으로 5개 페이지 6곳에서 발견됐고 그중 3곳은 이번 작업 이전부터 있던 것이다.
// 눈으로 읽으면 보이는데 아무도 전 페이지를 눈으로 읽지 않는다 — 그래서 센다.
// (plain text 로 렌더되는 필드에 마크다운을 쓴 경우도 여기서 함께 잡힌다. lib/indexLog.ts 의 note 가 그랬다.)
{
  const buildDir = ".next/server/app";
  const leaked = [];
  const scanHtml = (dir) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return; // 빌드 전이면 조용히 건너뛴다 — 이 검사는 빌드 산출물이 있을 때만 의미가 있다
    }
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory()) scanHtml(full);
      else if (e.name.endsWith(".html")) {
        const body = readFileSync(full, "utf8").replace(/<script[\s\S]*?<\/script>/g, "");
        for (const [, text] of body.matchAll(/\*\*([^*<]{1,60})\*\*/g)) leaked.push(`${full}  → **${text}**`);
      }
    }
  };
  scanHtml(buildDir);

  // 중복 id 검사. 한 페이지에 여러 MDX 를 이어 붙이면 소제목 슬러그가 겹친다 —
  // 프롬프트 허브에서 실제로 '사용법' id 가 9개씩 생겼다(HTML 무효 + 앵커가 첫 번째로만 간다).
  // 페이지를 합칠 때마다 재발하는 종류라 함께 센다.
  const dupPages = [];
  const scanIds = (dir) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory()) scanIds(full);
      else if (e.name.endsWith(".html")) {
        const seen = new Map();
        for (const [, id] of readFileSync(full, "utf8").matchAll(/\sid="([^"]+)"/g)) {
          seen.set(id, (seen.get(id) ?? 0) + 1);
        }
        const dups = [...seen.entries()].filter(([, n]) => n > 1);
        if (dups.length) dupPages.push(`${full}  → ${dups.map(([id, n]) => `${id}×${n}`).join(", ")}`);
      }
    }
  };
  scanIds(buildDir);
  if (dupPages.length) {
    console.log(`\n❌ 한 페이지 안에서 id 가 중복된 곳 ${dupPages.length}개 — 앵커가 첫 번째로만 간다.`);
    dupPages.slice(0, 8).forEach((l) => console.log(`   ${l}`));
    console.log("   고치는 법: 여러 MDX 를 한 페이지에 이어 붙일 때 <Mdx idPrefix={slug} /> 로 접두어를 준다.");
    process.exit(1);
  }
  console.log("✅ 페이지 내 id 중복 0건");

  if (leaked.length) {
    console.log(`\n❌ 렌더되지 않은 마크다운 ${leaked.length}건 — 화면에 별표가 그대로 찍힌다.`);
    leaked.slice(0, 10).forEach((l) => console.log(`   ${l}`));
    console.log("   고치는 법: 닫는 ** 앞이 문장부호이면 조사를 강조 안에 넣거나 괄호를 강조 밖으로 뺀다.");
    process.exit(1);
  }
  console.log("✅ 렌더되지 않은 마크다운 0건");
}

// ── 토픽 리다이렉트 정합 검사 ────────────────────────────────────────────────
// `*-prompts` 태그는 토픽 페이지를 만들지 않고 /prompts/<tag> 허브로 301 한다(next.config.mjs).
// 그 규칙이 성립하려면 리다이렉트 목록과 실제 태그 집합이 같아야 한다 — 태그를 새로 만들고
// 리다이렉트를 잊으면 404 가 되고, 반대면 죽은 규칙이 남는다. 목록이 두 벌인 곳이라 여기서 묶는다.
{
  const promptTags = [...new Set(all.flatMap((c) => c.meta.tags))].filter((t) => t.endsWith("-prompts")).sort();
  const config = readFileSync("next.config.mjs", "utf8");
  const redirected = [...config.matchAll(/source:\s*"\/topics\/([a-z0-9-]+-prompts)"/g)].map((m) => m[1]).sort();
  const missing = promptTags.filter((t) => !redirected.includes(t));
  const stale = redirected.filter((t) => !promptTags.includes(t));
  if (missing.length || stale.length) {
    console.log("\n❌ 토픽 리다이렉트가 태그와 어긋난다.");
    if (missing.length) console.log(`   리다이렉트 누락(404 위험): ${missing.join(", ")}`);
    if (stale.length) console.log(`   죽은 리다이렉트: ${stale.join(", ")}`);
    process.exit(1);
  }
  console.log(`✅ 토픽 리다이렉트 정합 (${promptTags.length}개 태그)`);
}

if (orphans.length > MAX_ORPHANS) {
  console.log(`\n❌ 인바운드 0인 페이지가 ${orphans.length}편 — 임계 ${MAX_ORPHANS} 초과.`);
  console.log("   동점 구간이 다시 결정적으로 고정됐는지 lib/relatedSelection.ts 를 보라.");
  process.exit(1);
}
console.log(`\n✅ 인바운드 0인 페이지 ${orphans.length}편 (임계 ${MAX_ORPHANS} 이하)`);
