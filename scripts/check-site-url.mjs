// 사이트 주소가 **한 곳에서만 나오는지** 확인한다.
//
// 왜 (2026-08-09):
//   next.config.mjs 의 호스트 정규화 destination 이 도메인을 따로 적고 있었다.
//   도메인을 옮기면 그 파일이 남아 **라이브 트래픽 전체를 죽은 주소로 308** 시킨다.
//   404 가 나지 않으므로 옮기는 날에야 드러나고, 그날은 이미 늦다.
//
//   같은 결함을 오늘 형제 저장소 셋에서 다 찾았다 — D2R(2곳) · budget-planner(8곳) · 여기(1곳).
//   한 저장소에서 확인된 결함은 형제에도 있다. 오늘 이 패턴으로 여러 건을 찾았다.
//   (강냥은 astro.config.mjs 의 SITE 하나로 이미 통일돼 있어 손댈 것이 없었다.)
//
// 정본을 .mjs 에 둔 이유는 lib/siteUrl.mjs 머리말에 있다 — next.config.mjs 와 scripts/*.mjs 가
// .ts 를 import 할 수 없어서다. 그래서 **예외 없이** 전부 한 곳을 읽는다.
//
// 사용: node scripts/check-site-url.mjs   (실패하면 종료코드 1)

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL } from "../lib/siteUrl.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HOST = SITE_URL.replace(/^https?:\/\//, "");

let pass = 0;
const fails = [];
const check = (name, ok) => {
  if (ok) { console.log(`  ✓ ${name}`); pass++; }
  else { console.log(`  ✗ ${name}`); fails.push(name); }
};

/** 주석을 걷어낸 코드만 본다 — 산문이 도메인을 언급하는 것은 위반이 아니다. */
const codeOf = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

console.log("\n[주소] 정본이 한 곳이다");

// 정본 파일과 **이 검사 자신**은 제외한다.
// 검사는 탐지할 문자열("process.env.NEXT_PUBLIC_SITE_URL")을 코드로 갖고 있어서, 안 빼면 스스로를 잡는다
// (2026-08-09 실제로 그랬다). 오늘만 세 번째다 — 검사가 자기가 금지한 것을 언급했다는 이유로 실패한 것.
// 주석은 걷어내지만 **문자열 리터럴은 못 걷는다.** 걷으려면 파서가 필요하고, 그건 이 검사가 할 일이 아니다.
const EXEMPT = new Set(["lib/siteUrl.mjs", "lib/siteUrl.d.mts", "scripts/check-site-url.mjs"]);
const SCAN = ["app", "lib", "components", "scripts", "next.config.mjs"];

{
  const hits = [];
  const walk = (p) => {
    let st;
    try { st = statSync(p); } catch { return; }
    if (st.isDirectory()) { readdirSync(p).forEach((e) => walk(join(p, e))); return; }
    if (!/\.(ts|tsx|js|mjs|mts)$/.test(p)) return;
    const rel = p.slice(ROOT.length + 1).replace(/\\/g, "/");
    if (EXEMPT.has(rel)) return;
    if (codeOf(readFileSync(p, "utf8")).includes(`https://${HOST}`)) hits.push(rel);
  };
  SCAN.forEach((d) => walk(join(ROOT, d)));
  check(`코드에 주소가 하드코딩돼 있지 않다${hits.length ? " — " + hits.join(", ") : ""}`, hits.length === 0);
}

{
  // 환경변수를 따로 **읽는** 곳이 있으면 프리뷰 배포에서 호스트가 갈린다 —
  // ⚠️ 변수 **이름**이 아니라 `process.env.` 접두사까지 본다. 안 그러면 "NEXT_PUBLIC_SITE_URL 을
  //    맞춰라" 같은 **에러 메시지**가 위반으로 잡힌다(2026-08-09 실제로 그렇게 실패했다).
  // canonical 은 env 를 따라가는데 다른 곳은 프로덕션 주소를 가리키는 상태가 된다.
  const hits = [];
  const walk = (p) => {
    let st;
    try { st = statSync(p); } catch { return; }
    if (st.isDirectory()) { readdirSync(p).forEach((e) => walk(join(p, e))); return; }
    if (!/\.(ts|tsx|js|mjs|mts)$/.test(p)) return;
    const rel = p.slice(ROOT.length + 1).replace(/\\/g, "/");
    if (EXEMPT.has(rel)) return;
    if (codeOf(readFileSync(p, "utf8")).includes("process.env.NEXT_PUBLIC_SITE_URL")) hits.push(rel);
  };
  SCAN.forEach((d) => walk(join(ROOT, d)));
  check(`NEXT_PUBLIC_SITE_URL 을 직접 읽는 곳이 없다${hits.length ? " — " + hits.join(", ") : ""}`, hits.length === 0);
}

{
  // ★ 빌드 산출물로 **실제 결과**를 본다. 소스가 정본을 읽는다는 것과 나가는 URL 이 맞다는 것은 다른 사실이다.
  //   빌드가 없으면 통과시키지 않는다 — 오늘 "조용히 건너뛴 검사가 초록불" 로 여러 번 헛짚었다.
  const manifest = join(ROOT, ".next", "routes-manifest.json");
  let redirects = null;
  try { redirects = JSON.parse(readFileSync(manifest, "utf8")).redirects ?? []; } catch { /* 아래에서 처리 */ }
  if (!redirects) {
    console.error("\n❌ .next/routes-manifest.json 이 없다 — 이 항목을 **검사하지 못했다.**");
    console.error("   `npm run build` 후 다시 실행하라.");
    process.exit(2);
  }
  const hostNorm = redirects.filter((r) => /vercel\.app/.test(JSON.stringify(r.has ?? [])));
  const bad = hostNorm.filter((r) => !String(r.destination).startsWith(SITE_URL));
  check(
    `호스트 정규화 리다이렉트 ${hostNorm.length}건이 정본으로 간다${bad.length ? " — " + bad.map((r) => r.destination).join(", ") : ""}`,
    hostNorm.length > 0 && bad.length === 0
  );
}

console.log(`\n${"─".repeat(46)}`);
if (fails.length) {
  console.error(`❌ ${fails.length}건 실패`);
  fails.forEach((f) => console.error(`   ${f}`));
  process.exit(1);
}
console.log(`✅ ${pass}개 전부 통과`);
