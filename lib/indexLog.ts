// 색인 실측 기록: 이 사이트가 검색엔진에 얼마나 색인됐는지 주기적으로 재서 남기는 공개 로그.
// 회차는 배열에 append 한다 — 새 측정 때 INDEX_LOG_ROUNDS 맨 앞에 항목을 추가하고
// NEXT_MEASUREMENT_AT 을 다음 예정일로 옮기면 페이지·표·추이가 자동으로 갱신된다.
//
// 수치 출처가 지표마다 다르다 — 한 줄로 뭉뚱그리지 마라:
//   - indexed              : Google URL Inspection API로 고정 표본 81건을 전수 조회한 값(샘플링 아님).
//                            measuredAt 시점의 스냅샷이다.
//   - impressions / clicks : Google Search Console 실적 보고서의 4주 누적치. 색인 측정일과 집계 구간이
//                            다르다(1회차: 2026-06-16~07-13). 같은 날짜의 값이 아니므로 표에 각주가 붙는다.

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
    round: 1,
    measuredAt: "2026-07-16",
    dayNumber: 6,
    indexed: 27,
    impressions: 3,
    clicks: 0,
    impressionsWindow: "2026-06-16~07-13",
    note: "사이트 공개 6일차 첫 측정. 사이트맵 81건 전수를 URL Inspection API로 확인했습니다. 6일은 색인 지연과 크롤 실패를 구분하기에 짧아, 33.3%가 정상인지 아닌지는 판단하지 않습니다."
  }
];

// 다음 측정 예정일. 회차를 추가할 때마다 함께 옮긴다.
export const NEXT_MEASUREMENT_AT = "2026-07-23";

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
