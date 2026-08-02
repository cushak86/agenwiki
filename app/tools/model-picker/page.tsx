import Link from "next/link";
import { ModelPickerWizard } from "@/components/ModelPickerWizard";
import { MODELS_AS_OF } from "@/lib/models";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "LLM 모델 선택 위저드",
  description: "용도·예산·분량 세 가지 질문에 답하면 조건에 맞는 LLM API 모델 후보 3개를 근거와 함께 추천합니다.",
  pathname: "/tools/model-picker"
});

export default function ModelPickerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm font-semibold text-accent">도구</p>
      <h1 className="mt-2 text-3xl font-bold text-ink">LLM 모델 선택 위저드</h1>
      <p className="mt-3 max-w-2xl leading-8 text-muted">
        모델이 너무 많아 고르기 어려울 때, 세 가지 질문으로 후보를 3개까지 좁힙니다. 기준 시점{" "}
        {MODELS_AS_OF}의 단가·스펙 데이터를 사용합니다.
      </p>

      <div className="mt-8">
        <ModelPickerWizard />
      </div>

      <section className="mt-12 max-w-2xl rounded-lg border border-line bg-panel p-5">
        <h2 className="text-lg font-semibold text-ink">함께 보면 좋은 문서</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href="/tools/model-compare" className="text-muted transition hover:text-accent">
              모델 스펙 비교표 — 전체 후보를 직접 정렬 비교
            </Link>
          </li>
          <li>
            <Link href="/guides/chatgpt-vs-claude" className="text-muted transition hover:text-accent">
              ChatGPT vs Claude 비교 가이드
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
