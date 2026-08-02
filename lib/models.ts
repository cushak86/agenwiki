// 주요 LLM API 모델 스펙·단가 데이터 — /tools/llm-cost, /tools/model-compare, /tools/model-picker 공용.
//
// 단가 출처: 2026-08-02 기준 교차 확인 —
//   GPT-5.6 Luna/Terra/Sol: 자체 가이드 openai-gpt-5-6-family.mdx (Simon Willison 정리 기준)
//   Claude Fable 5/Opus 5/Sonnet 5/Haiku 4.5: benchlm.ai 2026-08-02 표 + 가격 비교 사이트 교차
//   나머지: tokencalculator.ai, aipricing.guru 교차 확인
// 단가는 빠르게 바뀐다 — MODELS_AS_OF 를 UI에 반드시 노출하고, 계산기에서는 사용자가
// 단가를 직접 고쳐 계산할 수 있게 한다. 갱신 시 이 파일의 숫자와 MODELS_AS_OF 를 함께 올릴 것.
// 확인 경로: PROVIDER_PRICING_URLS 의 공식 요금 페이지.

export const MODELS_AS_OF = "2026-08-02";

export type ModelStrength = "coding" | "writing" | "reasoning" | "budget" | "long-context";

export type ModelInfo = {
  id: string;
  provider: "OpenAI" | "Anthropic" | "Google" | "DeepSeek" | "xAI";
  name: string;
  /** USD per 1M input tokens */
  inputPer1M: number;
  /** USD per 1M output tokens */
  outputPer1M: number;
  /** tokens */
  contextWindow: number;
  contextNote?: string;
  /** 일반적 평판 기준의 강점 태그 — 위저드 추천 근거로만 쓰고 단정으로 서술하지 말 것 */
  strengths: ModelStrength[];
  note?: string;
};

export const PROVIDER_PRICING_URLS: Record<ModelInfo["provider"], string> = {
  OpenAI: "https://platform.openai.com/docs/pricing",
  Anthropic: "https://www.anthropic.com/pricing",
  Google: "https://ai.google.dev/pricing",
  DeepSeek: "https://api-docs.deepseek.com/quick_start/pricing",
  xAI: "https://docs.x.ai/docs/models"
};

export const MODELS: ModelInfo[] = [
  {
    id: "gpt-5-6-sol",
    provider: "OpenAI",
    name: "GPT-5.6 Sol",
    inputPer1M: 5.0,
    outputPer1M: 30.0,
    contextWindow: 1_000_000,
    strengths: ["reasoning", "coding"],
    note: "5.6 계열 최상위. 최대 출력 128K"
  },
  {
    id: "gpt-5-6-terra",
    provider: "OpenAI",
    name: "GPT-5.6 Terra",
    inputPer1M: 2.5,
    outputPer1M: 15.0,
    contextWindow: 1_000_000,
    strengths: ["reasoning", "writing"],
    note: "5.6 계열 중간 크기"
  },
  {
    id: "gpt-5-6-luna",
    provider: "OpenAI",
    name: "GPT-5.6 Luna",
    inputPer1M: 1.0,
    outputPer1M: 6.0,
    contextWindow: 1_000_000,
    strengths: ["budget", "writing", "long-context"],
    note: "5.6 계열 소형"
  },
  {
    id: "gpt-5-mini",
    provider: "OpenAI",
    name: "GPT-5 mini",
    inputPer1M: 0.25,
    outputPer1M: 2.0,
    contextWindow: 400_000,
    strengths: ["budget", "writing"]
  },
  {
    id: "gpt-5-nano",
    provider: "OpenAI",
    name: "GPT-5 nano",
    inputPer1M: 0.05,
    outputPer1M: 0.4,
    contextWindow: 400_000,
    strengths: ["budget"]
  },
  {
    id: "claude-fable-5",
    provider: "Anthropic",
    name: "Claude Fable 5",
    inputPer1M: 10.0,
    outputPer1M: 50.0,
    contextWindow: 1_000_000,
    strengths: ["reasoning", "coding", "writing"],
    note: "Opus 위 신설 티어 (2026-06 출시)"
  },
  {
    id: "claude-opus-5",
    provider: "Anthropic",
    name: "Claude Opus 5",
    inputPer1M: 5.0,
    outputPer1M: 25.0,
    contextWindow: 1_000_000,
    strengths: ["reasoning", "coding", "writing"],
    note: "2026-07-24 출시"
  },
  {
    id: "claude-sonnet-5",
    provider: "Anthropic",
    name: "Claude Sonnet 5",
    inputPer1M: 2.0,
    outputPer1M: 10.0,
    contextWindow: 1_000_000,
    strengths: ["coding", "writing"],
    note: "출시 가격. 2026-09-01부터 $3/$15 예정으로 안내됨"
  },
  {
    id: "claude-haiku-4-5",
    provider: "Anthropic",
    name: "Claude Haiku 4.5",
    inputPer1M: 1.0,
    outputPer1M: 5.0,
    contextWindow: 200_000,
    strengths: ["budget", "coding"]
  },
  {
    id: "gemini-3-pro",
    provider: "Google",
    name: "Gemini 3 Pro",
    inputPer1M: 2.0,
    outputPer1M: 12.0,
    contextWindow: 1_000_000,
    contextNote: "20만 토큰 초과 구간은 단가 상승",
    strengths: ["long-context", "reasoning"]
  },
  {
    id: "gemini-2-5-flash",
    provider: "Google",
    name: "Gemini 2.5 Flash",
    inputPer1M: 0.3,
    outputPer1M: 2.5,
    contextWindow: 1_000_000,
    strengths: ["budget", "long-context"]
  },
  {
    id: "deepseek-v3-2",
    provider: "DeepSeek",
    name: "DeepSeek-V3.2",
    inputPer1M: 0.28,
    outputPer1M: 0.42,
    contextWindow: 128_000,
    strengths: ["budget", "coding"]
  },
  {
    id: "grok-4-1-fast",
    provider: "xAI",
    name: "Grok 4.1 Fast",
    inputPer1M: 0.2,
    outputPer1M: 0.5,
    contextWindow: 2_000_000,
    strengths: ["budget", "long-context"]
  }
];

/**
 * 추론 강도(effort) 프리셋.
 * 추론(thinking/reasoning) 토큰은 응답에 보이지 않아도 출력 토큰으로 과금된다 —
 * 그래서 출력 토큰 배수로 근사한다. 실제 배수는 작업 난이도·모델에 따라 크게
 * 달라지므로 대략값이며, UI에서 사용자가 배수를 직접 고칠 수 있게 한다.
 */
export const EFFORT_PRESETS = [
  { key: "minimal", label: "최소", multiplier: 1, description: "추론 거의 없음 — 표시 출력만 과금" },
  { key: "low", label: "낮음", multiplier: 1.5, description: "가벼운 추론" },
  { key: "medium", label: "중간", multiplier: 3, description: "일반적 추론 작업" },
  { key: "high", label: "높음", multiplier: 6, description: "깊은 추론 — 복잡한 분석·코딩" }
] as const;

/**
 * 글자 수 기반 토큰 추정. 정확한 값은 토크나이저마다 다르다 —
 * 한글은 대략 1~1.5자당 1토큰, 영문은 대략 4자당 1토큰으로 잡는 관행적 추정치다.
 * "대략 추정"임을 UI에 반드시 표기할 것.
 */
export function estimateTokens(text: string): number {
  let hangul = 0;
  let other = 0;
  for (const ch of text) {
    if (/[가-힯ᄀ-ᇿ]/.test(ch)) {
      hangul += 1;
    } else if (!/\s/.test(ch)) {
      other += 1;
    }
  }
  return Math.round(hangul / 1.3 + other / 4);
}

export function formatTokens(n: number): string {
  if (n >= 1_000_000) {
    return `${n / 1_000_000}M`;
  }
  if (n >= 1_000) {
    return `${Math.round(n / 1_000)}K`;
  }
  return String(n);
}
