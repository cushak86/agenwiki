/**
 * 사이트 주소 **정본**. 여기 한 줄이다.
 *
 * ── 왜 .mjs 인가 (2026-08-09)
 *
 * 주소를 쓰는 곳이 세 종류인데 **서로 읽을 수 있는 형식이 다르다**:
 *   · lib/seo.ts        — TypeScript, Next 번들
 *   · next.config.mjs   — plain node ESM, **.ts 를 import 할 수 없다**
 *   · scripts/*.mjs     — plain node ESM, 마찬가지
 *
 * .ts 에 두면 뒤의 둘이 못 읽어 문자열을 따로 갖게 된다. 실제로 그랬다 —
 * next.config.mjs 의 호스트 정규화 destination 이 도메인을 다시 적고 있었다.
 * 도메인을 옮기면 그 파일이 남아 **라이브 트래픽 전체를 죽은 주소로 308** 시킨다.
 * 404 가 나지 않으므로 옮기는 날에야 드러나고, 그날은 이미 늦다.
 *
 * .mjs 에 두면 셋 다 읽는다. 형제 저장소 D2R 은 lib/site-pages.js(=.js)라 처음부터 이 문제가 없었고,
 * budget-planner 는 오늘 같은 이유로 예외를 하나 남겼다가 여기 방식으로 다시 정리했다.
 *
 * ⚠️ 주소가 필요하면 **여기서 import 해라.** 문자열을 다시 적지 마라 —
 *    scripts/check-site-url.mjs 가 하드코딩을 막는다.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://agenwiki.online";
