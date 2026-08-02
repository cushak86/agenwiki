import Link from "next/link";
import { LlmCostCalculator } from "@/components/LlmCostCalculator";
import { MODELS_AS_OF, PROVIDER_PRICING_URLS } from "@/lib/models";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "LLM API 요금 계산기",
  description:
    "GPT·Claude·Gemini·DeepSeek 등 주요 LLM API의 월 비용을 사용량 기준으로 비교 계산합니다. 단가 직접 수정 가능, 원화 환산 지원.",
  pathname: "/tools/llm-cost"
});

export default function LlmCostPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm font-semibold text-accent">도구</p>
      <h1 className="mt-2 text-3xl font-bold text-ink">LLM API 요금 계산기</h1>
      <p className="mt-3 max-w-2xl leading-8 text-muted">
        월 요청 수와 요청당 토큰을 넣으면 주요 모델의 월 비용을 한 표에서 비교합니다. 값은 모두 브라우저
        안에서만 계산됩니다.
      </p>

      <aside className="mt-6 max-w-2xl rounded-lg border border-accent/40 bg-panel p-4 text-sm leading-6 text-muted">
        <strong className="font-semibold text-ink">단가 기준 시점: {MODELS_AS_OF}</strong> — API 단가는 자주
        바뀝니다. 결제 전에는 반드시 공식 요금 페이지를 확인하세요:{" "}
        {Object.entries(PROVIDER_PRICING_URLS).map(([provider, url], i, arr) => (
          <span key={provider}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="font-medium text-ink hover:text-accent">
              {provider}
            </a>
            {i < arr.length - 1 ? " · " : ""}
          </span>
        ))}
        . 표의 단가 칸은 직접 수정해 최신 값으로 계산할 수 있습니다.
      </aside>

      <div className="mt-8">
        <LlmCostCalculator />
      </div>

      <section className="mt-12 max-w-2xl rounded-lg border border-line bg-panel p-5">
        <h2 className="text-lg font-semibold text-ink">함께 보면 좋은 문서</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href="/glossary/token-cost" className="text-muted transition hover:text-accent">
              토큰 비용이란? — 입력·출력 단가가 다른 이유
            </Link>
          </li>
          <li>
            <Link href="/tools/model-compare" className="text-muted transition hover:text-accent">
              모델 스펙 비교표 — 컨텍스트 윈도우·단가 정렬 비교
            </Link>
          </li>
          <li>
            <Link href="/guides/open-source-llm-vs-api" className="text-muted transition hover:text-accent">
              오픈소스 LLM vs 상용 API, 언제 무엇을 써야 할까
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
