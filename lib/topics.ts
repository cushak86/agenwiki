export const TOPICS = [
  { slug: "ai-agent-basics", name: "AI 에이전트 입문", description: "AI 에이전트의 기본 개념과 첫 워크플로우를 다루는 콘텐츠 모음" },
  { slug: "ai-agent-advanced", name: "AI 에이전트 실전·벤치마크", description: "멀티에이전트, 장기 실행, 메모리 등 에이전트 심화·연구 콘텐츠 모음" },
  { slug: "rag", name: "RAG(검색 증강 생성)", description: "RAG 개념부터 임베딩·벡터 검색까지" },
  { slug: "prompt-engineering", name: "프롬프트 엔지니어링", description: "프롬프트 설계 원칙과 기법" },
  { slug: "productivity-prompts", name: "업무 생산성 프롬프트", description: "코드 리뷰·문서 요약·회의록 등 실무 프롬프트 템플릿" },
  { slug: "fine-tuning-optimization", name: "파인튜닝·모델 경량화", description: "파인튜닝, 양자화, 저계수 정규화 등 모델 최적화" },
  { slug: "llm-fundamentals", name: "LLM 핵심 개념", description: "토큰, 환각 등 LLM을 이해하기 위한 기초 용어" },
  { slug: "ai-model-comparison", name: "AI 모델·서비스 비교", description: "ChatGPT, Claude, GPT-5.6 등 모델·서비스 비교" },
  { slug: "vision-multimodal-research", name: "비전·멀티모달 AI 연구", description: "영상·이미지 이해와 관련된 최신 연구" },
  { slug: "ai-research-insights", name: "AI 연구·데이터 분석 리포트", description: "벤치마크, 로그 분석 등 데이터 기반 AI 연구 리포트" }
] as const;

export function getTopicName(slug: string): string {
  return TOPICS.find((t) => t.slug === slug)?.name ?? `#${slug}`;
}

export function getTopicDescription(slug: string): string | undefined {
  return TOPICS.find((t) => t.slug === slug)?.description;
}
