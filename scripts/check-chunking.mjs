// 청킹 시뮬레이터가 **글자를 깨뜨리지 않는지** 확인한다.
//
// 왜 (2026-08-09 감사):
//   "글자 수로 자른다"를 가르치는 화면이 정작 글자를 깨고 있었다.
//   자바스크립트 문자열의 단위는 UTF-16 코드 유닛이라 이모지 하나가 2로 세지고,
//   그 한가운데를 `.slice()` 로 자르면 짝 잃은 서로게이트가 남아 화면에 � 로 나온다.
//   화면은 한글 샘플에선 멀쩡해 보였다 — 기본 예문에 이모지가 없어서 아무도 못 봤다.
//
// 그래서 이 검사는 **이모지가 든 입력**을 일부러 넣는다. 깨진 글자는 눈이 아니라 코드로 잡는다.
//
// 사용: node scripts/check-chunking.mjs   (실패하면 종료코드 1)

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let pass = 0;
const fails = [];
function check(name, ok) {
  if (ok) { console.log(`  ✓ ${name}`); pass++; }
  else { console.log(`  ✗ ${name}`); fails.push(name); }
}

const src = readFileSync(join(ROOT, "components", "ChunkingSimulator.tsx"), "utf8");
/** 주석을 걷어낸 코드만 본다 — 경고문("`.slice()` 를 쓰면 안 된다")이 위반으로 잡히면 안 된다. */
const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

console.log("\n[청킹] 자소 단위로만 다룬다");

{
  // 자소로 다루려면 Intl.Segmenter 를 써야 한다. Array.from 은 국기·가족 이모지를 못 지킨다.
  check("Intl.Segmenter 로 자소를 나눈다", code.includes('new Intl.Segmenter("ko", { granularity: "grapheme" })'));
}

{
  // ★ 이 검사가 이 파일의 존재 이유다. 사용자 텍스트를 코드 유닛으로 자르는 곳이 하나라도 있으면 안 된다.
  //   허용: graphemes(...)·prevG 같은 **배열**에 대한 .slice/.length, 그리고 배열 길이(CHUNK_COLORS 등).
  const lines = code.split(/\r?\n/);
  const bad = [];
  lines.forEach((line, i) => {
    // 배열 변수에 대한 것은 통과시킨다(이름으로 구분한다 — 배열은 g/prevG/graphemes(...) 뿐이다).
    const cleaned = line
      .replace(/graphemes\([^)]*\)\.(slice|length)/g, "")
      .replace(/\b(g|prevG)\.(slice|length)\b/g, "")
      .replace(/\b(pieces|merged|units|chunks|lines|CHUNK_COLORS|STRATEGIES|fails)\.length\b/g, "");
    if (/\b(chunk\.text|unit|prev|text)\.(slice|length)\b/.test(cleaned)) {
      bad.push(`${i + 1}행: ${line.trim().slice(0, 70)}`);
    }
  });
  check(`사용자 텍스트에 .slice()/.length 를 직접 쓰지 않는다${bad.length ? "\n     " + bad.join("\n     ") : ""}`, bad.length === 0);
}

console.log("\n[청킹] 실제로 깨지는가 — 이모지를 넣어 본다");

{
  // 컴포넌트를 그대로 실행할 수는 없으니(React·경로 별칭), **같은 알고리즘**을 여기서 재현해
  // 자소 방식과 코드 유닛 방식이 실제로 갈리는지 본다. 갈리지 않으면 이 검사는 무의미하다.
  const SEG = new Intl.Segmenter("ko", { granularity: "grapheme" });
  const graphemes = (s) => Array.from(SEG.segment(s), (g) => g.segment);
  const 입력 = "가족과 함께 👨‍👩‍👧 한국 🇰🇷 여행을 갔다 😀 정말 좋았다";
  const size = 10;

  // 코드 유닛 방식(옛 코드) — 깨지는지 확인
  const 옛 = [];
  for (let i = 0; i < 입력.length; i += size) 옛.push(입력.slice(i, i + size));
  // 짝 잃은 서로게이트: 상위(D800-DBFF)나 하위(DC00-DFFF)가 홀로 남은 것
  const 깨짐 = (s) => /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(s);
  const 옛깨짐 = 옛.filter(깨짐).length;

  const g = graphemes(입력);
  const 새 = [];
  for (let i = 0; i < g.length; i += size) 새.push(g.slice(i, i + size).join(""));
  const 새깨짐 = 새.filter(깨짐).length;

  // ★ 옛 방식이 실제로 깨져야 이 검사에 의미가 있다. 안 깨지면 입력이 잘못된 것이다.
  check(`옛 방식(.slice)은 실제로 글자를 깬다 — ${옛깨짐}조각`, 옛깨짐 > 0);
  check(`자소 방식은 하나도 안 깬다 — ${새깨짐}조각`, 새깨짐 === 0);
  check("두 방식을 이어 붙이면 원문과 같다(자소 방식)", 새.join("") === 입력);

  const 이모지수 = graphemes("👨‍👩‍👧🇰🇷😀").length;
  check(`가족·국기·표정 이모지가 3자로 세진다(코드 유닛으로는 ${"👨‍👩‍👧🇰🇷😀".length}자)`, 이모지수 === 3);
}

console.log(`\n${"─".repeat(46)}`);
if (fails.length) {
  console.error(`❌ ${fails.length}건 실패`);
  fails.forEach((f) => console.error(`   ${f}`));
  process.exit(1);
}
console.log(`✅ ${pass}개 전부 통과`);
