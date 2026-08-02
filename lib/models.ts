// 주요 LLM API 모델 스펙·단가 데이터 — /tools/llm-cost, /tools/model-compare, /tools/model-picker 공용.
//
// 단가 출처: 2026-08-02 기준 공개 가격 비교 사이트 교차 확인(tokencalculator.ai, aipricing.guru 등).
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
    id: "gpt-5-2",
    provider: "OpenAI",
    name: "GPT-5.2",
    inputPer1M: 1.75,
    outputPer1M: 14.0,
    contextWindow: 400_000,
    strengths: ["reasoning", "coding"]
  },
  {
    id: "gpt-5",
    provider: "OpenAI",
    name: "GPT-5",
    inputPer1M: 1.25,
    outputPer1M: 10.0,
    contextWindow: 400_000,
    strengths: ["reasoning", "writing"]
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
    id: "claude-opus-4-5",
    provider: "Anthropic",
    name: "Claude Opus 4.5",
    inputPer1M: 5.0,
    outputPer1M: 25.0,
    contextWindow: 200_000,
    strengths: ["reasoning", "coding", "writing"]
  },
  {
    id: "claude-sonnet-5",
    provider: "Anthropic",
    name: "Claude Sonnet 5",
    inputPer1M: 2.0,
    outputPer1M: 10.0,
    contextWindow: 200_000,
    contextNote: "1M 베타",
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
