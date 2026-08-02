"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatTokens, MODELS, type ModelInfo, type ModelStrength } from "@/lib/models";

type UseCase = "coding" | "writing" | "reasoning" | "bulk";
type Budget = "min" | "balanced" | "quality";
type ContextNeed = "normal" | "long";

const USE_CASES: { key: UseCase; label: string; strength: ModelStrength }[] = [
  { key: "coding", label: "코딩·개발", strength: "coding" },
  { key: "writing", label: "글쓰기·요약", strength: "writing" },
  { key: "reasoning", label: "복잡한 분석·추론", strength: "reasoning" },
  { key: "bulk", label: "대량 처리·챗봇", strength: "budget" }
];

const BUDGETS: { key: Budget; label: string; description: string }[] = [
  { key: "min", label: "비용 최소", description: "품질보다 단가가 우선" },
  { key: "balanced", label: "균형", description: "적당한 품질을 합리적 단가로" },
  { key: "quality", label: "품질 우선", description: "비용보다 결과 품질이 우선" }
];

const CONTEXTS: { key: ContextNeed; label: string; description: string }[] = [
  { key: "normal", label: "일반 분량", description: "대화·문서 수십 페이지 이내" },
  { key: "long", label: "장문", description: "책 한 권·대규모 코드베이스 수준" }
];

function scoreModel(model: ModelInfo, useCase: UseCase, budget: Budget, context: ContextNeed): number {
  let score = 0;
  const strength = USE_CASES.find((u) => u.key === useCase)?.strength;

  if (strength && model.strengths.includes(strength)) {
    score += 3;
  }

  const combined = model.inputPer1M + model.outputPer1M;
  if (budget === "min") {
    score += combined <= 1 ? 3 : combined <= 5 ? 1 : -2;
  } else if (budget === "balanced") {
    score += combined <= 1 ? 1 : combined <= 15 ? 3 : 0;
  } else {
    // 품질 우선: 상위 모델(단가가 높은 축)에 가중 — 단가가 품질을 보장하진 않으므로 강점 태그와 함께만 작동
    score += combined >= 10 ? 2 : 0;
    score += model.strengths.includes("reasoning") ? 1 : 0;
  }

  if (context === "long") {
    score += model.contextWindow >= 1_000_000 ? 3 : model.contextWindow >= 400_000 ? 1 : -1;
  }

  return score;
}

function rationale(model: ModelInfo, useCase: UseCase, budget: Budget, context: ContextNeed): string {
  const parts: string[] = [];
  const strength = USE_CASES.find((u) => u.key === useCase)?.strength;
  if (strength && model.strengths.includes(strength)) {
    parts.push(`${USE_CASES.find((u) => u.key === useCase)?.label} 계열에서 자주 선택되는 모델`);
  }
  const combined = model.inputPer1M + model.outputPer1M;
  if (combined <= 1) {
    parts.push(`단가가 매우 낮음 (입력+출력 $${combined.toFixed(2)}/1M)`);
  } else if (combined <= 15) {
    parts.push(`단가 중간대 (입력+출력 $${combined.toFixed(2)}/1M)`);
  } else {
    parts.push(`상위 단가대 (입력+출력 $${combined.toFixed(2)}/1M)`);
  }
  if (context === "long" && model.contextWindow >= 1_000_000) {
    parts.push(`컨텍스트 ${formatTokens(model.contextWindow)}로 장문에 여유`);
  }
  return parts.join(" · ");
}

const optionClass = (active: boolean) =>
  `rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
    active ? "bg-accentDeep text-white" : "border border-line bg-panel text-muted hover:text-ink"
  }`;

export function ModelPickerWizard() {
  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [context, setContext] = useState<ContextNeed | null>(null);

  const ready = useCase && budget && context;

  const top3 = useMemo(() => {
    if (!ready) {
      return [];
    }
    return MODELS.map((model) => ({ model, score: scoreModel(model, useCase, budget, context) }))
      .sort((a, b) => b.score - a.score || a.model.inputPer1M + a.model.outputPer1M - (b.model.inputPer1M + b.model.outputPer1M))
      .slice(0, 3);
  }, [ready, useCase, budget, context]);

  return (
    <div>
      <div className="space-y-6">
        <fieldset>
          <legend className="text-sm font-bold text-ink">1. 주로 어떤 작업에 쓰나요?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {USE_CASES.map((option) => (
              <button key={option.key} type="button" onClick={() => setUseCase(option.key)} className={optionClass(useCase === option.key)}>
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-bold text-ink">2. 비용은 얼마나 중요한가요?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {BUDGETS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setBudget(option.key)}
                title={option.description}
                className={optionClass(budget === option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-bold text-ink">3. 한 번에 다루는 분량은?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {CONTEXTS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setContext(option.key)}
                title={option.description}
                className={optionClass(context === option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {ready ? (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-ink">추천 후보 3개</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {top3.map(({ model }, index) => (
              <div key={model.id} className={`rounded-xl border p-5 ${index === 0 ? "border-accent bg-accentDeep/10" : "border-line bg-panel"}`}>
                <p className="text-xs font-bold uppercase tracking-widest text-accentSoft">
                  {index === 0 ? "1순위" : `${index + 1}순위`}
                </p>
                <h3 className="mt-2 text-lg font-bold text-ink">{model.name}</h3>
                <p className="text-xs text-muted">{model.provider}</p>
                <p className="mt-3 text-sm leading-6 text-muted">{rationale(model, useCase, budget, context)}</p>
                <p className="mt-3 text-sm tabular-nums text-body">
                  입력 ${model.inputPer1M.toFixed(2)} · 출력 ${model.outputPer1M.toFixed(2)} /1M · 컨텍스트{" "}
                  {formatTokens(model.contextWindow)}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-muted">
            이 추천은 단가·컨텍스트(객관 수치)와 일반적 평판 기반의 강점 분류를 조합한 결과이며, 벤치마크
            측정이 아닙니다. 후보를 좁힌 뒤{" "}
            <Link href="/tools/llm-cost" className="font-medium text-ink hover:text-accent">
              요금 계산기
            </Link>
            로 월 비용을 확인하고, 실제 작업 샘플로 직접 비교해 보세요.
          </p>
        </div>
      ) : (
        <p className="mt-10 text-sm text-muted">세 질문에 모두 답하면 후보를 추천합니다.</p>
      )}
    </div>
  );
}
