// 저장소에 **이름이 이상한 파일**이 커밋되지 않게 한다.
//
// 왜 (2026-08-09):
//   내가 `touch content/glossary/*.md` 를 돌렸는데 글롭이 확장되지 않아,
//   **`*.md` 라는 이름의 빈 파일이 만들어지고 그대로 커밋됐다.**
//   윈도우는 파일명에 `*` 를 못 쓰므로 U+F02A(사설 영역 문자)로 치환해 저장한다 — 그래서
//   `ls` 로는 `*.md` 처럼 보이고, git 은 `\357\200\252.md` 로 적는다. 눈으로는 구분이 안 된다.
//
//   0바이트라 빌드도 통과했고, 콘텐츠 개수를 세는 스크립트에서는 41편으로 잡혀
//   "용어집 41편" 이라는 **틀린 숫자**를 만들고 있었다. 조용한 오염이다.
//
// 잡는 것: ASCII 제어문자 · 사설 영역(U+E000–U+F8FF) · 윈도우 금지문자 · 앞뒤 공백 · 빈 콘텐츠 파일.
//
// 사용: node scripts/check-filenames.mjs   (실패하면 종료코드 1)

import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";

const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean);

const bad = [];
for (const f of files) {
  const name = f.split("/").pop() ?? f;
  const codes = [...name].map((c) => c.codePointAt(0) ?? 0);

  if (codes.some((c) => c < 0x20)) bad.push(`${f} — 제어문자`);
  // 사설 영역: 윈도우가 금지문자(* ? : < > | " )를 옮겨 적을 때 쓰는 자리다. 정상 파일명엔 올 일이 없다.
  else if (codes.some((c) => c >= 0xe000 && c <= 0xf8ff)) {
    const hex = codes.filter((c) => c >= 0xe000 && c <= 0xf8ff).map((c) => "U+" + c.toString(16).toUpperCase());
    bad.push(`${f} — 사설 영역 문자 ${hex.join(",")} (윈도우가 * ? : 등을 옮겨 적은 흔적)`);
  } else if (/[*?"<>|]/.test(name)) bad.push(`${f} — 윈도우 금지문자`);
  else if (name !== name.trim()) bad.push(`${f} — 이름 앞뒤에 공백`);
}

// 콘텐츠 파일이 0바이트면 글이 아니라 사고다.
for (const f of files) {
  if (!/^content\/.*\.mdx?$/.test(f)) continue;
  let size = -1;
  try { size = statSync(f).size; } catch { continue; } // 작업 트리에 없으면 다른 검사의 일이다
  if (size === 0) bad.push(`${f} — 0바이트 콘텐츠 파일`);
}

console.log(`추적 파일 ${files.length}개 검사`);
if (bad.length) {
  console.error(`\n❌ 이상한 파일명·빈 파일 ${bad.length}건`);
  bad.forEach((b) => console.error(`   ${b}`));
  console.error('\n   → git rm --cached "<파일>" 후 지워라. 글롭이 확장되지 않은 채 touch 한 결과일 수 있다.');
  process.exit(1);
}
console.log("✅ 이상한 파일명 0건");
