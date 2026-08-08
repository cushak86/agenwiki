import { MODELS, MODELS_AS_OF, PROVIDER_PRICING_URLS, formatTokens } from "@/lib/models";

/**
 * 비교 글 본문에 넣는 **수치표**. MDX 에서 `<ModelPriceTable ids={["gpt-5-6-sol", ...]} />` 로 쓴다.
 *
 * 왜 컴포넌트인가 (2026-08-09):
 *   비교 가이드들이 "알려져 있다 / 자주 꼽힌다 / 단정하지 않는다" 같은 헤지 표현만 18·13·12회씩
 *   반복하면서 **가격·컨텍스트 길이·점수는 한 개도 싣지 않고 있었다.** 비교 글을 찾아온 사람이
 *   알고 싶은 것이 정확히 그 숫자인데, 페이지에 그게 없으니 노출이 나도 클릭이 안 된다.
 *   그런데 숫자를 MDX 에 손으로 적으면 lib/models.ts 의 MODELS_AS_OF 갱신 규율과 이중 진실원이
 *   된다(그 파일 주석이 "갱신 시 숫자와 MODELS_AS_OF 를 함께 올릴 것"이라고 명시한다).
 *   그래서 데이터를 읽어 그리는 컴포넌트로 둔다 — 단가를 고치면 본문이 저절로 따라온다.
 *
 * 출처 표기 규칙: 이 표의 숫자는 lib/models.ts 헤더가 밝힌 교차 확인 결과다. 공급사 공식 요금
 * 페이지는 **"확인 경로"로만** 링크한다 — 우리가 그 페이지를 직접 인용한 것이 아니므로
 * 출처로 적으면 인용하지 않은 곳을 인용하는 셈이 된다(/about 출처 정책과 AiDisclosure 고지 참조).
 */
/**
 * ⚠️ MDX 에서는 **문자열 속성**으로 넘긴다: `<ModelPriceTable ids="a, b, c" />`
 *    표현식 속성(`ids={["a","b"]}`)은 이 파이프라인(next-mdx-remote/rsc + remark-gfm)에서
 *    컴포넌트까지 전달되지 않아 ids 가 undefined 로 들어온다(2026-08-09 실측: 표가 통째로
 *    렌더되지 않았다). 배열도 받도록 열어 뒀지만, 콘텐츠 파일에는 문자열 형태를 쓴다 —
 *    글 쓰는 쪽에서 JSX 문법을 신경 쓰지 않아도 되는 편이 낫다.
 */
export function ModelPriceTable({ ids }: { ids?: string[] | string }) {
  const list = Array.isArray(ids) ? ids : typeof ids === "string" ? ids.split(",").map((s) => s.trim()) : [];
  const rows = list.map((id) => MODELS.find((model) => model.id === id)).filter((model) => model !== undefined);

  if (rows.length === 0) {
    return null;
  }

  const providers = [...new Set(rows.map((model) => model.provider))];

  return (
    <figure className="my-8">
      <div className="overflow-x-auto rounded-lg border border-line bg-panel">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-medium text-muted">
              <th className="px-4 py-3">모델</th>
              <th className="px-4 py-3">입력 100만 토큰</th>
              <th className="px-4 py-3">출력 100만 토큰</th>
              <th className="px-4 py-3">컨텍스트</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((model) => (
              <tr key={model.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 align-top">
                  <span className="font-semibold text-ink">{model.name}</span>
                  <span className="ml-2 text-xs text-muted">{model.provider}</span>
                </td>
                <td className="px-4 py-3 align-top tabular-nums text-ink">${model.inputPer1M}</td>
                <td className="px-4 py-3 align-top tabular-nums text-ink">${model.outputPer1M}</td>
                <td className="px-4 py-3 align-top tabular-nums text-ink">
                  {formatTokens(model.contextWindow)}
                  {model.contextNote ? <span className="ml-1 text-xs text-muted">{model.contextNote}</span> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-2 text-xs leading-5 text-muted">
        단가 기준일 <strong className="font-semibold text-ink">{MODELS_AS_OF}</strong>. 모델 가격은 자주 바뀝니다 —
        도입 전에는 공급사 공식 요금 페이지에서 현재 값을 확인하세요:{" "}
        {providers.map((provider, index) => (
          <span key={provider}>
            {index > 0 ? " · " : ""}
            <a
              href={PROVIDER_PRICING_URLS[provider]}
              className="underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              {provider}
            </a>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
