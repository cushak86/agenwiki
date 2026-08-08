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
// 기본 임계 6 = 2026-08-08 수정 직후의 실측값(수정 전 48). 목표치가 아니라 **회귀 감지선**이다.
// 여기서 늘면 무언가 되돌아간 것이고, 줄이려면 알고리즘이 아니라 태그를 손봐야 한다 —
// 남은 6편은 태그가 사실상 고유해서 공유 태그 경쟁에 아예 참여하지 못하는 글들이다
// (paper-* 3편·uniclawbench·meeting-notes-summary-automation·glossary/grounding).
// 이 줄을 낮출 때는 실제로 낮아진 것을 확인하고 낮춰라. 임계를 먼저 낮추면 경보만 시끄러워진다.
const MAX_ORPHANS = maxOrphansArg >= 0 ? Number(argv[maxOrphansArg + 1]) : 6;

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

console.log(`\n콘텐츠 ${all.length}편 · 「관련 글」 위젯 인바운드 분포`);
console.log(`  인바운드 0    : ${orphans.length}편`);
console.log(`  중앙값        : ${counts[Math.floor(counts.length / 2)]}`);
console.log(`  최댓값        : ${top[0]?.[1]} (${top.map(([k, n]) => `${k}=${n}`).join(", ")})`);
if (orphans.length) console.log(`  0인 페이지    : ${orphans.map(([k]) => k).join(", ")}`);

if (orphans.length > MAX_ORPHANS) {
  console.log(`\n❌ 인바운드 0인 페이지가 ${orphans.length}편 — 임계 ${MAX_ORPHANS} 초과.`);
  console.log("   동점 구간이 다시 결정적으로 고정됐는지 lib/relatedSelection.ts 를 보라.");
  process.exit(1);
}
console.log(`\n✅ 인바운드 0인 페이지 ${orphans.length}편 (임계 ${MAX_ORPHANS} 이하)`);
