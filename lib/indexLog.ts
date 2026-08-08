// 색인 실측 기록: 이 사이트가 검색엔진에 얼마나 색인됐는지 주기적으로 재서 남기는 공개 로그.
// 회차는 배열에 append 한다 — 새 측정 때 INDEX_LOG_ROUNDS 맨 앞에 항목을 추가하고
// NEXT_MEASUREMENT_AT 을 다음 예정일로 옮기면 페이지·표·추이가 자동으로 갱신된다.
//
// 수치 출처가 지표마다 다르다 — 한 줄로 뭉뚱그리지 마라:
//   - indexed              : Google URL Inspection API로 고정 표본 81건을 전수 조회한 값(샘플링 아님).
//                            measuredAt 시점의 스냅샷이다.
//   - impressions / clicks : Google Search Console 실적 보고서의 4주 누적치. 색인 측정일과 집계 구간이
//                            다르다(1회차: 2026-06-16~07-13). 같은 날짜의 값이 아니므로 표에 각주가 붙는다.
//
// ⚠️ **어느 속성에서 읽었는지를 반드시 property 에 적어라.** (2026-08-09 추가)
//    이 사이트는 agenwiki.vercel.app → agenwiki.online 으로 도메인을 옮겼고, GSC 속성이 둘로 남았다.
//    같은 집계 구간을 두 속성에 물으면 답이 다르다 — 3회차 구간(2026-07-09~08-05) 실측:
//      https://agenwiki.vercel.app/  → 노출 52 · 클릭 1
//      sc-domain:agenwiki.online     → 노출  6 · 클릭 0
//    구글이 아직 옛 URL 에 실적을 붙이고 있어서 그렇다(리다이렉트는 308 로 정상 동작 중).
//    속성을 안 적으면 다음 회차에 속성을 바꾸는 순간 52→6 이 '폭락'으로 읽힌다. 실제로는 자 바뀐 것이다.
//    **회차 간 비교는 같은 속성끼리만 하고, 속성이 바뀌면 그 회차부터 계열을 새로 시작해라.**

export type IndexLogRound = {
  round: number;
  measuredAt: string;
  dayNumber: number;
  /** URL Inspection API 전수 조회 기준 색인된 URL 수. 분모는 BASELINE_SIZE. */
  indexed: number;
  /** GSC 4주 누적. measuredAt과 집계 구간이 다르다 — impressionsWindow에 구간을 적는다. */
  impressions: number;
  /** GSC 4주 누적. impressions와 같은 구간. */
  clicks: number;
  /** impressions·clicks의 집계 구간(예: "2026-06-16~07-13"). */
  impressionsWindow: string;
  /**
   * impressions·clicks를 읽은 GSC 속성. 도메인 이전 중이라 회차마다 다를 수 있어 필수다 —
   * 안 적으면 속성이 바뀌는 회차에 숫자가 통째로 뒤집히고, 그걸 성과 변화로 오독하게 된다.
   */
  property: string;
  note?: string;
};

// 고정 표본(기준선). 2026-07-16 사이트맵을 그대로 동결한 것으로, 이후 사이트맵에 추가된 URL은
// 표본에 넣지 않는다 — 분모가 회차마다 흔들리면 색인률을 회차 간에 비교할 수 없기 때문이다.
// 추적기(MA/scripts/gsc-index-track.mjs)가 이 기준선을 상태 파일에 동결해 두고 매 회차 같은 81건만
// 재측정하며, 기준선 밖 신규 URL은 별도로 분리 집계한다.
// 색인률의 분모는 언제나 이 상수다 — 회차 데이터에 표본 크기를 따로 적지 않는 이유가 이것이다
// (회차마다 적게 두면 사이트맵을 보고 82를 적어 넣는 순간 회차 간 비교가 조용히 깨진다).
// 기준선을 다시 동결하는 날이 오면 과거 회차의 색인률이 소급 변경되므로, 그때는 회차별 표본 크기로
// 스키마를 바꿔야 한다.
export const BASELINE_FROZEN_AT = "2026-07-16";
export const BASELINE_SIZE = 81;

// 최신 회차가 앞에 오도록 유지한다(표·최신 스냅샷이 이 순서를 그대로 쓴다).
export const INDEX_LOG_ROUNDS: IndexLogRound[] = [
  {
    round: 3,
    measuredAt: "2026-08-09",
    dayNumber: 30,
    indexed: 33,
    impressions: 52,
    clicks: 1,
    impressionsWindow: "2026-07-09~08-05",
    property: "https://agenwiki.vercel.app/ (구 도메인 속성)",
    note: "색인 34→33건(42.0%→40.7%). /glossary/transformer 1건이 색인에서 이탈했습니다 — 2회차의 /terms 이탈에 이어 두 번째라, 이탈이 계속되는지 다음 회차에 봅니다. 이번 회차의 큰 발견은 색인이 아니라 측정입니다. 판독 스크립트가 '총 노출·총 클릭'을 검색어 차원 상위 20행의 합으로 계산하고 있었는데, 구글은 희소 검색어를 익명화해 그 차원에서 아예 빼기 때문에 실제보다 적게 나옵니다. 차원 없이 총계를 다시 물으니 노출 30→52, 그리고 클릭이 0이 아니라 1이었습니다(/topics/ai-research-insights, 평균순위 6.5). 1·2회차의 노출 3·41도 같은 방식으로 축소된 값이라, 이번 회차와 직접 비교할 수 없습니다 — 늘어난 것처럼 보이는 부분에 측정 수정분이 섞여 있습니다. 그래서 이 회차는 '증가'라고 부르지 않습니다. [2026-08-09 추가] 같은 날 더 큰 것을 발견했습니다. 위 노출 52·클릭 1은 옛 도메인 속성(agenwiki.vercel.app)에서 읽은 값이고, 지금 도메인인 agenwiki.online 속성에 똑같은 구간을 물으면 노출 6·클릭 0입니다. 리다이렉트는 308로 정상 동작하지만 구글이 아직 옛 URL에 실적을 붙이고 있어서 그렇습니다. 세 회차 모두 옛 속성 값이라 회차끼리는 비교가 되지만, 이 숫자를 '지금 도메인의 성적'으로 읽으면 안 됩니다. 그래서 이제 회차마다 어느 속성에서 읽었는지를 함께 적습니다."
  },
  {
    round: 2,
    measuredAt: "2026-08-02",
    dayNumber: 23,
    indexed: 34,
    impressions: 41,
    clicks: 0,
    impressionsWindow: "2026-07-03~07-30",
    property: "https://agenwiki.vercel.app/ (구 도메인 속성)",
    note: "색인 27→34건(33.3%→42.0%), 노출 3→41회. /terms 1건이 색인에서 이탈해 원인 확인이 필요합니다. 측정 표본은 기준선 81건 그대로입니다 — 이 사이 도메인이 agenwiki.online으로 바뀌고 문서가 대량 추가되어 기준선 밖 신규 URL 147건이 잡혔지만, 회차 간 비교를 위해 표본에 넣지 않았습니다. 클릭은 여전히 0 — 노출된 검색어(RAG·벡터DB 계열)의 평균 순위가 40~100위권이라 클릭 전환 이전 단계입니다."
  },
  {
    round: 1,
    measuredAt: "2026-07-16",
    dayNumber: 6,
    indexed: 27,
    impressions: 3,
    clicks: 0,
    impressionsWindow: "2026-06-16~07-13",
    property: "https://agenwiki.vercel.app/ (구 도메인 속성)",
    note: "사이트 공개 6일차 첫 측정. 사이트맵 81건 전수를 URL Inspection API로 확인했습니다. 6일은 색인 지연과 크롤 실패를 구분하기에 짧아, 33.3%가 정상인지 아닌지는 판단하지 않습니다."
  }
];

// 다음 측정 예정일. 회차를 추가할 때마다 함께 옮긴다.
export const NEXT_MEASUREMENT_AT = "2026-08-16";

/**
 * 같은 사이트의 색인률이 **세 개 존재한다**는 사실을 공개하기 위한 대조표.
 *
 * 왜 이걸 만들었나 (2026-08-08):
 *   이 페이지의 헤드라인은 위 고정 표본 계통(81건)이다. 그런데 분모를 언제 동결했느냐에 따라
 *   같은 사이트의 색인률이 42.0% / 39.1% / 11.6% 로 갈렸고, **하필 공개된 것이 셋 중 가장 높은
 *   숫자였다.** 세 방법론 모두 타당하고 어느 것도 조작이 아니지만, 유리한 하나만 보이는 구조는
 *   그 자체로 정직하지 않다. 이 페이지의 가치가 정직성 하나이므로 셋을 나란히 놓는다.
 *
 * 여기 숫자를 손으로 고치지 마라 — 각 항목의 method 에 적힌 방식으로 다시 재서 갱신한다.
 */
export type MeasurementSystem = {
  label: string;
  indexed: number;
  total: number;
  /** 측정(또는 표본 동결) 시점. */
  measuredAt: string;
  method: string;
  /** 왜 다른 숫자가 나오는가. */
  why: string;
};

export const MEASUREMENT_SYSTEMS: MeasurementSystem[] = [
  {
    label: "이 페이지 (고정 표본)",
    indexed: 33,
    total: 81,
    measuredAt: "2026-08-09",
    method: "URL 검사 API 전수 조회",
    why: "2026-07-16 사이트맵을 동결한 표본입니다. 회차 간 비교를 위해 분모를 고정했으므로, 그 뒤 발행한 글은 분모에도 분자에도 들어오지 않습니다."
  },
  {
    label: "추적기 (새 도메인 전체 표본)",
    indexed: 59,
    total: 147,
    measuredAt: "2026-08-09",
    method: "URL 검사 API 전수 조회",
    why: "커스텀 도메인 전환 뒤 새 주소 기준으로 다시 동결한 표본입니다. 2026-08-02에는 17/147(11.6%)로 셋 중 가장 낮았는데, 이번에 59/147(40.1%)로 올라 고정 표본과 거의 같아졌습니다 — 낮았던 이유가 콘텐츠가 아니라 새 주소가 아직 안 읽혔던 것이었음을 사후에 확인한 셈입니다."
  },
  {
    label: "서치 콘솔 내려받기 (당시 전체)",
    indexed: 59,
    total: 151,
    measuredAt: "2026-08-08",
    method: "GSC 페이지 보고서 내려받기",
    why: "그 시점 사이트가 알고 있던 URL 전체입니다. 「발견됨 – 미색인」 79건이 여기 들어 있습니다. 위 추적기 수치와 분모만 다르고(151 vs 147) 분자가 같아 서로를 검증합니다."
  }
];

export function getSystemRate(system: MeasurementSystem) {
  return (system.indexed / system.total) * 100;
}

// 0으로 나눌 걱정은 없다 — BASELINE_SIZE가 0이 아닌 리터럴 상수임을 타입 검사가 보장한다.
export function getIndexedRate(round: IndexLogRound) {
  return (round.indexed / BASELINE_SIZE) * 100;
}

export function getLatestRound() {
  return INDEX_LOG_ROUNDS[0];
}

/** 직전 회차 대비 색인 증감. 첫 회차면 비교 대상이 없으므로 undefined. */
export function getIndexedDelta(index: number) {
  const previous = INDEX_LOG_ROUNDS[index + 1];

  if (!previous) {
    return undefined;
  }

  return INDEX_LOG_ROUNDS[index].indexed - previous.indexed;
}
