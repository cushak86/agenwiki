import Link from "next/link";
import { ModelCompareTable } from "@/components/ModelCompareTable";
import { MODELS_AS_OF, PROVIDER_PRICING_URLS } from "@/lib/models";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "LLM 모델 스펙 비교표",
  description:
    "GPT·Claude·Gemini·DeepSeek·Grok 주요 모델의 API 단가와 컨텍스트 윈도우를 한 표에서 정렬 비교합니다.",
  pathname: "/tools/model-compare"
});

export default function ModelComparePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm font-semibold text-accent">도구</p>
      <h1 className="mt-2 text-3xl font-bold text-ink">LLM 모델 스펙 비교표</h1>
      <p className="mt-3 max-w-2xl leading-8 text-muted">
        주요 모델의 단가와 컨텍스트 윈도우를 열 제목 클릭으로 정렬해 비교합니다. 개별 비교 가이드의
        수치도 이 표를 기준으로 관리합니다.
      </p>

      <aside className="mt-6 max-w-2xl rounded-lg border border-accent/40 bg-panel p-4 text-sm leading-6 text-muted">
        <strong className="font-semibold text-ink">기준 시점: {MODELS_AS_OF}</strong> — 단가·스펙은 자주
        바뀝니다. 확정 전 공식 문서 확인:{" "}
        {Object.entries(PROVIDER_PRICING_URLS).map(([provider, url], i, arr) => (
          <span key={provider}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="font-medium text-ink hover:text-accent">
              {provider}
            </a>
            {i < arr.length - 1 ? " · " : ""}
          </span>
        ))}
      </aside>

      <div className="mt-8">
        <ModelCompareTable />
      </div>

      <section className="mt-12 max-w-2xl rounded-lg border border-line bg-panel p-5">
        <h2 className="text-lg font-semibold text-ink">함께 보면 좋은 문서</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href="/tools/llm-cost" className="text-muted transition hover:text-accent">
              LLM API 요금 계산기 — 내 사용량 기준 월 비용
            </Link>
          </li>
          <li>
            <Link href="/tools/model-picker" className="text-muted transition hover:text-accent">
              모델 선택 위저드 — 질문 3개로 후보 좁히기
            </Link>
          </li>
          <li>
            <Link href="/guides/chatgpt-vs-gemini-vs-claude" className="text-muted transition hover:text-accent">
              챗GPT vs 제미나이 vs 클로드 비교 가이드
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
