// IndexNow 색인 요청 — 라이브 sitemap.xml의 URL을 Bing·Naver·Yandex·Seznam에 일괄 제출.
// 구글은 IndexNow 미지원(2026-08 기준) — 구글은 GSC URL 검사로 한 건씩 수동 요청해야 한다.
// 사용: npm run indexnow -- --dry (제출 없이 페이로드만 확인) / npm run indexnow (실제 제출)
//
// 순서가 중요하다: 키 파일 public/<키>.txt가 라이브에서 200으로 서빙된 뒤에만 제출이 검증된다.
// 배포 전에 돌리면 키 검증 단계에서 중단된다(버그가 아니라 의도된 동작).

// 사이트 주소 정본은 lib/seo.ts의 siteConfig.url 이다. .mjs 스크립트에서 .ts를 import할 수 없어
// 폴백 규칙을 그대로 복제했다 — 도메인 변경 시 lib/seo.ts와 이 파일 두 곳을 함께 고칠 것.
import { SITE_URL } from "../lib/siteUrl.mjs";

const BASE = SITE_URL;
const KEY = "7f701a246cb6b3b350e4ca0e2903fa3e";
const KEY_LOCATION = `${BASE}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/IndexNow";

const dry = process.argv.includes("--dry");

async function main() {
  const keyRes = await fetch(KEY_LOCATION);
  const keyBody = keyRes.ok ? (await keyRes.text()).trim() : "";
  if (!keyRes.ok || keyBody !== KEY) {
    console.error(`[중단] 키 파일 미검증: ${KEY_LOCATION} → HTTP ${keyRes.status}, 본문 일치=${keyBody === KEY}`);
    console.error("배포가 선행돼야 한다. 키 파일이 라이브 200이 아니면 제출해도 거부된다.");
    process.exit(1);
  }
  // next.config.mjs가 agenwiki.vercel.app 호스트를 정식 도메인으로 308 보낸다. 리다이렉트를 타고
  // 200을 받았다면 BASE가 별칭 호스트라는 뜻 — 그대로 제출하면 host/keyLocation이 실제와 어긋난다.
  if (keyRes.redirected) {
    console.error(`[중단] 키 파일이 리다이렉트됨: ${KEY_LOCATION} → ${keyRes.url}`);
    console.error("NEXT_PUBLIC_SITE_URL을 정식 도메인으로 맞춰라. 별칭 호스트로는 제출하지 않는다.");
    process.exit(1);
  }
  console.log(`키 파일 검증: ${KEY_LOCATION} → HTTP 200, 본문 일치 ✅`);

  const smRes = await fetch(`${BASE}/sitemap.xml`);
  if (!smRes.ok) {
    console.error(`[중단] sitemap.xml → HTTP ${smRes.status}`);
    process.exit(1);
  }
  const urlList = [...(await smRes.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  // sitemap이 다른 호스트를 뱉으면 payload.host와 urlList가 어긋나 IndexNow가 422로 거부한다.
  // 도메인 전환 직후에만 생기는 상태인데, 422 메시지만으로는 원인을 알기 어려워 여기서 끊는다.
  const offHost = urlList.filter((u) => !u.startsWith(BASE));
  if (offHost.length > 0) {
    console.error(`[중단] sitemap URL이 BASE(${BASE})와 다른 호스트다: ${offHost[0]} 외 ${offHost.length - 1}건`);
    console.error("NEXT_PUBLIC_SITE_URL과 라이브 sitemap의 호스트를 맞춘 뒤 다시 실행하라.");
    process.exit(1);
  }
  if (urlList.length === 0) {
    console.error("[중단] sitemap에서 URL을 못 찾음");
    process.exit(1);
  }
  console.log(`제출 대상 ${urlList.length}개:`);
  urlList.forEach((u) => console.log(`  - ${u}`));

  const payload = { host: new URL(BASE).host, key: KEY, keyLocation: KEY_LOCATION, urlList };
  if (dry) {
    console.log("\n[--dry] 실제 제출 안 함. 페이로드:");
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  console.log(`\n제출 결과: HTTP ${res.status} ${res.statusText}`);
  if (text) console.log(`응답 본문: ${text}`);
  // 200=수락, 202=수락(키 검증 대기). 그 외는 실패로 본다.
  if (res.status !== 200 && res.status !== 202) process.exit(1);
}

main().catch((e) => {
  console.error(`[에러] ${e.message}`);
  process.exit(1);
});
