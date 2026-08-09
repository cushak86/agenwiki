// 용어집 ↔ 가이드 **문단 중복**을 잰다.
//
// ── 이 파일이 존재하는 진짜 이유: 앞서 두 번이나 「0건 ✅」이 거짓이었다 (2026-08-09)
//
//   ① 첫 시도는 "정확히 같은 문장"으로 비교했다. 조사 하나만 달라도 안 잡힌다 → 0건.
//   ② 두 번째는 유사도로 바꿨는데, 용어집 파일이 **CRLF** 라 문단 분리(`\n{2,}`)가 통째로 실패해
//      **용어집 쪽 표본이 0개인 채로** 비교했다 → 또 0건. 화면엔 똑같이 초록불이 떴다.
//
//   그래서 이 검사는 **표본 수를 먼저 찍고, 한쪽이라도 0 이면 실패로 끝낸다.**
//   "비교할 게 없었다"와 "비교했는데 문제없다"를 절대 같은 결과로 내보내지 않는다.
//
// ── 임계를 왜 0.6 으로 두나
//   용어 정의는 **첫 문장이 겹칠 수밖에 없다.** "MCP는 …프로토콜이다" 를 두 글이 다르게 쓸 이유가 없고,
//   억지로 다르게 쓰면 글이 나빠진다. 실측 분포상 정상 범위가 0.35~0.50 이라 0.6 을 회귀 감지선으로 둔다.
//   잡아야 하는 것은 "문단을 통째로 옮겨 붙였는가"이지 "정의가 비슷한가"가 아니다.
//   2026-08-09 최고치는 0.550(glossary/mcp ↔ guides/what-is-mcp)이었고, 그 한 문단은 실제로
//   가이드 문장을 거의 그대로 쓰고 있어서 용어집 관점으로 다시 썼다.
//
// 사용: node scripts/check-duplicate-prose.mjs   (실패 1, 계측 실패 2)

import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "content");
const THRESHOLD = 0.6;

function load(dir) {
  return readdirSync(join(ROOT, dir))
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => ({ f: `${dir}/${f}`, body: readFileSync(join(ROOT, dir, f), "utf8") }));
}

function paragraphs(raw) {
  const body = raw
    .replace(/\r\n/g, "\n") // ★ 줄바꿈 통일이 먼저다. 이걸 빼먹어 지난번에 표본이 0 이었다.
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    .replace(/```[\s\S]*?```/g, "") // 코드는 같아도 정상이다
    .replace(/<[A-Z][\s\S]*?\/>/g, "");
  return body
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length >= 80 && !/^[#|>\-*\d]/.test(p));
}

const shingles = (s, n = 4) => {
  const t = s.replace(/[^가-힣a-zA-Z0-9]/g, "");
  const out = new Set();
  for (let i = 0; i + n <= t.length; i++) out.add(t.slice(i, i + n));
  return out;
};
const jaccard = (a, b) => {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
};

const gParas = load("glossary").flatMap((g) => paragraphs(g.body).map((p) => ({ f: g.f, p, sh: shingles(p) })));
const uParas = load("guides").flatMap((g) => paragraphs(g.body).map((p) => ({ f: g.f, p, sh: shingles(p) })));

console.log(`용어집 산문 문단 ${gParas.length}개 · 가이드 산문 문단 ${uParas.length}개`);

// ★ 계측 실패와 통과를 구분한다.
if (!gParas.length || !uParas.length) {
  console.error("\n❌ 한쪽 표본이 0 이다 — 결과가 아니라 **계측 실패**다.");
  console.error("   파서(줄바꿈·프론트매터·필터)를 고쳐라. 이 상태의 「0건」은 아무것도 뜻하지 않는다.");
  process.exit(2);
}

let max = { sim: 0 };
const over = [];
for (const a of gParas) {
  for (const b of uParas) {
    const sim = jaccard(a.sh, b.sh);
    if (sim > max.sim) max = { sim, a, b };
    if (sim >= THRESHOLD) over.push({ sim, a, b });
  }
}

console.log(`비교 ${gParas.length * uParas.length}쌍 · 최고 유사도 ${max.sim.toFixed(3)} (${max.a.f} ↔ ${max.b.f})`);

if (over.length) {
  console.error(`\n❌ 유사도 ${THRESHOLD} 이상 ${over.length}쌍 — 문단을 옮겨 붙인 것으로 본다.`);
  over.slice(0, 5).forEach((o) => {
    console.error(`   ${o.sim.toFixed(3)}  ${o.a.f}  ↔  ${o.b.f}`);
    console.error(`      용어집: "${o.a.p.slice(0, 80)}…"`);
  });
  console.error("\n   → 용어집은 **어디서 이 말을 만나는가**를, 가이드는 **어떻게 하는가**를 쓴다.");
  console.error("      같은 내용을 말만 바꿔 쓰지 말고 각도를 바꿔라.");
  process.exit(1);
}
console.log(`✅ 문단 중복 0쌍 (임계 ${THRESHOLD})`);
