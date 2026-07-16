import Link from "next/link";
import {
  BASELINE_FROZEN_AT,
  BASELINE_SIZE,
  INDEX_LOG_ROUNDS,
  NEXT_MEASUREMENT_AT,
  getIndexedDelta,
  getIndexedRate,
  getLatestRound
} from "@/lib/indexLog";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "AI가 만든 콘텐츠를 구글은 색인하는가",
  description:
    "AI 파이프라인으로 만든 사이트가 구글에 실제로 얼마나 색인되는지 직접 측정해 회차별로 공개합니다. 2026-07-16 6일차 기준 사이트맵 81건 중 27건(33.3%) 색인. 다음 측정 2026-07-23.",
  pathname: "/lab/index-log"
});

// 최초·마지막 크롤 시각. GSC는 UTC로 보고하므로 KST 환산값과 원 수치를 함께 둔다 —
// 본문에서 날짜가 하루 달라 보이는 이유를 밝히려면 원 수치가 필요하다.
const FIRST_CRAWL_KST = "2026-07-11 08:03";
const FIRST_CRAWL_UTC = "2026-07-10T23:03";
const LAST_CRAWL_KST = "2026-07-15 12:17";
const LAST_CRAWL_UTC = "2026-07-15T03:17";
// 사이트맵 제출은 최초 크롤과 같은 날(2026-07-11)이라 시각만 쓴다. 최초 크롤 08:03과의 차이가 아래 "28분".
const SITEMAP_SUBMITTED_TIME_KST = "08:31";

// 이 기록의 조건. 색인률의 원인을 하나로 특정할 수 없다는 것을 보이는 표라, 항목을 빼지 마라.
const CONDITIONS: { label: string; value: string }[] = [
  { label: "콘텐츠 제작", value: "AI 파이프라인 (LLM 초안 → 형식 검사 → 발행. 사실관계 사람 검수 없음)" },
  { label: "사이트 공개", value: "2026-07-11 (KST)" },
  { label: "도메인", value: "*.vercel.app 공유 서브도메인 (커스텀 도메인 없음)" },
  { label: "외부 유입 링크", value: "사실상 0" },
  { label: "측정 표본", value: `사이트맵 ${BASELINE_SIZE}건 (${BASELINE_FROZEN_AT} 고정)` }
];

function formatRate(rate: number) {
  return `${rate.toFixed(1)}%`;
}

function formatDelta(delta: number | undefined) {
  if (delta === undefined) {
    return "—";
  }

  return delta > 0 ? `+${delta}` : String(delta);
}

export default function IndexLogPage() {
  const latest = getLatestRound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-accent">실측 기록</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">AI가 만든 콘텐츠를 구글은 색인하는가</h1>
        <p className="mt-4 text-lg font-medium text-muted">
          {latest.dayNumber}일차 실측 — 사이트맵 {BASELINE_SIZE}건 중 {latest.indexed}건(
          {formatRate(getIndexedRate(latest))})
        </p>
        <p className="mt-4 leading-8 text-muted">
          AI가 쓴 글을 구글이 색인하는지 궁금하다면, 남의 사례를 찾는 것보다 직접 재는 편이 빠릅니다. agenwiki는
          AI 파이프라인으로 만든 사이트입니다. 이 페이지는 그 사이트가 실제로 얼마나 색인되는지 주기적으로 재서
          남기는 기록입니다. 수치는 좋든 나쁘든 고치지 않습니다.
        </p>
        <p className="mt-3 leading-8 text-muted">
          먼저 밝혀 둡니다. 이건 <strong className="font-semibold text-ink">사이트 한 곳의 기록(n=1)</strong>입니다.
          &ldquo;AI 콘텐츠는 이렇다&rdquo;는 결론을 내릴 수 있는 데이터가 아닙니다.
        </p>
      </div>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-xl font-semibold text-ink">최신 측정</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-line bg-white p-4">
            <dt className="text-xs font-medium text-muted">색인 / 고정 표본</dt>
            <dd className="mt-1 text-2xl font-bold text-ink">
              {latest.indexed}
              <span className="text-base font-medium text-muted"> / {BASELINE_SIZE}</span>
            </dd>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-accent" style={{ width: formatRate(getIndexedRate(latest)) }} />
            </div>
            <p className="mt-2 text-xs text-muted">{formatRate(getIndexedRate(latest))}</p>
          </div>
          <div className="rounded-lg border border-line bg-white p-4">
            <dt className="text-xs font-medium text-muted">노출</dt>
            <dd className="mt-1 text-2xl font-bold text-ink">{latest.impressions}</dd>
          </div>
          <div className="rounded-lg border border-line bg-white p-4">
            <dt className="text-xs font-medium text-muted">클릭</dt>
            <dd className="mt-1 text-2xl font-bold text-ink">{latest.clicks}</dd>
          </div>
          <div className="rounded-lg border border-line bg-white p-4">
            <dt className="text-xs font-medium text-muted">다음 측정</dt>
            <dd className="mt-1 text-2xl font-bold text-ink">{NEXT_MEASUREMENT_AT}</dd>
          </div>
        </dl>
        {/* 분모 출처. 오늘 sitemap.xml을 열면 81보다 큰 수가 나오므로, 이 표본이 동결된 것임을
            밝히지 않으면 우리 숫자가 틀린 것처럼 보인다. */}
        <p className="mt-3 text-xs leading-5 text-muted">
          분모 {BASELINE_SIZE}건은 {BASELINE_FROZEN_AT} 사이트맵을 동결한 고정 표본입니다. 이후 추가된 URL은
          표본에 넣지 않고 따로 셉니다 — 분모가 회차마다 바뀌면 색인률을 비교할 수 없기 때문입니다.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">회차별 기록</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs font-medium text-muted">
                <th className="px-4 py-3">회차</th>
                <th className="px-4 py-3">측정일</th>
                <th className="px-4 py-3">경과</th>
                <th className="px-4 py-3">색인 / 고정 표본</th>
                <th className="px-4 py-3">색인률</th>
                <th className="px-4 py-3">증감</th>
                <th className="px-4 py-3">노출</th>
                <th className="px-4 py-3">클릭</th>
              </tr>
            </thead>
            <tbody>
              {INDEX_LOG_ROUNDS.map((round, index) => (
                <tr key={round.round} className="border-b border-line last:border-b-0 text-ink">
                  <td className="px-4 py-3 font-medium">{round.round}회차</td>
                  <td className="px-4 py-3 text-muted">{round.measuredAt}</td>
                  <td className="px-4 py-3 text-muted">{round.dayNumber}일차</td>
                  <td className="px-4 py-3">
                    {round.indexed} / {BASELINE_SIZE}
                  </td>
                  <td className="px-4 py-3">{formatRate(getIndexedRate(round))}</td>
                  <td className="px-4 py-3 text-muted">{formatDelta(getIndexedDelta(index))}</td>
                  <td className="px-4 py-3">{round.impressions}</td>
                  <td className="px-4 py-3">{round.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 노출·클릭은 색인과 출처도 집계 구간도 다르다 — 같은 표에 나란히 두는 이상 각주가 없으면 오독된다. */}
        <p className="mt-3 max-w-3xl text-xs leading-5 text-muted">
          노출·클릭은 GSC 4주 누적치로, 색인 측정일과 집계 구간이 다릅니다(
          {INDEX_LOG_ROUNDS.map((round) => `${round.round}회차: ${round.impressionsWindow}`).join(", ")}).
        </p>
        {INDEX_LOG_ROUNDS.some((round) => round.note) ? (
          <ul className="mt-4 max-w-3xl space-y-2">
            {INDEX_LOG_ROUNDS.filter((round) => round.note).map((round) => (
              <li key={round.round} className="text-sm leading-6 text-muted">
                <span className="font-medium text-ink">{round.round}회차</span> — {round.note}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-xl font-semibold text-ink">{formatRate(getIndexedRate(latest))}는 좋은 숫자인가</h2>
        <p className="mt-3 leading-8 text-muted">모릅니다.</p>
        <p className="mt-3 leading-8 text-muted">
          {latest.dayNumber}일은 판단하기에 짧은 기간입니다. 크롤과 색인은 다른 단계여서, 크롤된 페이지가 반드시
          색인되는 것은 아닙니다. 나머지 {BASELINE_SIZE - latest.indexed}건이{" "}
          <strong className="font-semibold text-ink">색인되지 않은 것</strong>인지{" "}
          <strong className="font-semibold text-ink">아직 처리되지 않은 것</strong>인지, {latest.dayNumber}일차
          데이터로는 구분되지 않습니다.
        </p>
        <p className="mt-3 leading-8 text-muted">
          확실한 것은 구글이 이 사이트를 일찍부터 봤다는 것뿐입니다. 최초 크롤은{" "}
          <strong className="font-semibold text-ink">{FIRST_CRAWL_KST}(KST)</strong>입니다. 같은 날{" "}
          {SITEMAP_SUBMITTED_TIME_KST}(KST)에 사이트맵을 제출했으니,{" "}
          <strong className="font-semibold text-ink">구글은 사이트맵을 받기 28분 전에 이미 이 사이트를 크롤했습니다.</strong>{" "}
          마지막 크롤은 <strong className="font-semibold text-ink">{LAST_CRAWL_KST}(KST)</strong>입니다. 구글이
          계속 보고 있다는 뜻이지만, 그 이상은 이 데이터로 말할 수 없습니다.
        </p>
        <p className="mt-3 leading-8 text-muted">
          (시각은 KST 기준입니다. Google Search Console은 UTC로 보고하므로, 원 수치인 UTC {FIRST_CRAWL_UTC}과 UTC{" "}
          {LAST_CRAWL_UTC}을 KST로 환산했습니다. 날짜가 하루 달라 보이는 것은 이 때문입니다.)
        </p>
        <p className="mt-3 leading-8 text-muted">
          그래서 이번 회차는 판단하지 않고 숫자만 남깁니다. 위기도 아니고 순조로운 것도 아니라, 아직 모릅니다.
        </p>
      </section>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-xl font-semibold text-ink">이 기록의 조건</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs font-medium text-muted">
                <th className="px-4 py-3">항목</th>
                <th className="px-4 py-3">값</th>
              </tr>
            </thead>
            <tbody>
              {CONDITIONS.map((item) => (
                <tr key={item.label} className="border-b border-line last:border-b-0 text-ink">
                  <td className="whitespace-nowrap px-4 py-3 font-medium">{item.label}</td>
                  <td className="px-4 py-3 text-muted">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 leading-8 text-muted">
          이 조건들이 한꺼번에 걸려 있습니다. 색인률 {formatRate(getIndexedRate(latest))}의 원인이 AI 콘텐츠
          때문인지, 외부 링크가 없어서인지, 공유 서브도메인이어서인지, 아니면 그냥 {latest.dayNumber}일밖에 안
          지나서인지 — <strong className="font-semibold text-ink">이 데이터로는 가릴 수 없습니다.</strong>
        </p>
      </section>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-xl font-semibold text-ink">측정 방법</h2>
        <p className="mt-3 leading-8 text-muted">
          <strong className="font-semibold text-ink">색인 여부</strong> — 사이트맵에 등록된 {BASELINE_SIZE}개 URL
          전수를 Google URL Inspection API로 조회해 색인된 URL 수를 셉니다. 샘플링이 아니라 전수입니다.
        </p>
        <p className="mt-3 leading-8 text-muted">
          <strong className="font-semibold text-ink">표본 고정</strong> — 표본은 {BASELINE_FROZEN_AT} 기준 사이트맵{" "}
          {BASELINE_SIZE}건으로 동결합니다. 회차 간 비교가 가능하도록, 이후 추가되는 페이지(이 페이지를 포함해)는{" "}
          {BASELINE_SIZE}건에 넣지 않습니다.
        </p>
        <p className="mt-3 leading-8 text-muted">
          <strong className="font-semibold text-ink">노출·클릭</strong> — Google Search Console 실적 보고서의 4주
          누적치입니다. {latest.round}회차 수치의 집계 구간은 {latest.impressionsWindow}으로, 색인 측정일(
          {latest.measuredAt})과 구간이 다릅니다.
        </p>
        <p className="mt-3 leading-8 text-muted">
          <strong className="font-semibold text-ink">측정 주기</strong> — 7일 간격. 다음 측정은{" "}
          {NEXT_MEASUREMENT_AT}입니다.
        </p>
        <p className="mt-3 leading-8 text-muted">
          이 수치로 <strong className="font-semibold text-ink">말할 수 없는 것</strong>도 적어 둡니다.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li className="leading-8 text-muted">
            <strong className="font-semibold text-ink">평균 순위는 지표로 쓰지 않습니다.</strong> 같은 기간 GSC
            평균 순위는 97~99로 잡히지만, 노출 {latest.impressions}건 위에서 계산된 값이라 통계적으로
            무의미합니다.
          </li>
          <li className="leading-8 text-muted">
            <strong className="font-semibold text-ink">색인률은 품질 점수가 아닙니다.</strong> 색인은 구글이
            페이지를 데이터베이스에 넣었다는 뜻일 뿐, 순위나 트래픽과 직접 이어지지 않습니다.
          </li>
          <li className="leading-8 text-muted">
            <strong className="font-semibold text-ink">이 기록으로 할 수 있는 말</strong>: &ldquo;이 사이트는{" "}
            {latest.dayNumber}일차에 {BASELINE_SIZE}건 중 {latest.indexed}건이 색인됐다.&rdquo;
          </li>
          <li className="leading-8 text-muted">
            <strong className="font-semibold text-ink">할 수 없는 말</strong>: &ldquo;AI가 만든 콘텐츠는 색인률이
            33%다.&rdquo; 표본이 사이트 하나이고 비교군이 없습니다. 같은 조건에서 AI 없이 만든 사이트를 나란히
            재고 있지 않기 때문에, 원인을 &ldquo;AI가 만들어서&rdquo;로 돌릴 근거가 이 데이터에는 없습니다.
          </li>
        </ul>
        <p className="mt-3 leading-8 text-muted">
          앞으로 어떻게 될지는 쓰지 않겠습니다. 다음 회차에 색인이 늘지 줄지 모릅니다. {NEXT_MEASUREMENT_AT}에
          다시 재서 그대로 적겠습니다.
        </p>
        {/* A안 유입 독자가 고지를 만나는 유일한 경로 — 지우지 마라. */}
        <p className="mt-6 leading-8 text-muted">
          이 사이트의 글이 어떻게 만들어지는지는{" "}
          <Link href="/about" className="font-medium text-ink hover:text-accent">
            소개
          </Link>
          에 적어 두었습니다.
        </p>
      </section>
    </div>
  );
}
