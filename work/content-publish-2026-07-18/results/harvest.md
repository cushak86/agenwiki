# Harvest — 2026-07-18

수집: fetch_arxiv(cs.AI 6·cs.CL 4) + fetch_rss(Simon Willison 4) → queue 12건.
기존 59건과 대조해 중복 제외. 소스 URL은 실 200 확인함.

## 기존 콘텐츠 갭 (판독)
- 보안·안전 영역 **0건**: 프롬프트 인젝션·데이터 포이즈닝·탈옥·가드레일 전무.
- glossary 흔한 용어 누락: few-shot·temperature·distillation·MoE·diffusion.
- 이미 두꺼운 영역(중복 회피): LLM 기초·에이전트 검색(WebSwarm·UniClawBench 등)·RAG·프롬프트·모델 비교·arxiv 논문 요약(paper-* 8건+).

## 선별 후보 (상위 3, 소스 실존·200 확인)

### 1. 프롬프트 인젝션이란 무엇인가  [evergreen · 최고 수요 · 신규영역]
- 형식: guide(입문) + 가능하면 glossary 용어 동반
- 소스: OWASP LLM Top 10 (200) · Simon Willison prompt-injection 태그 (200)
- 왜 지금: LLM 앱 대표 보안 취약점, 검색 수요 큼, 현재 0건. 시의성에 죽지 않는 evergreen.
- 비고: paper-* 패턴(단일 논문)과 달리 개념 설명글이라 category=입문이면 출처 게이트 면제 대상.

### 2. 데이터 포이즈닝 — 프리트레이닝 오염 공격  [신규영역 · 게이트 첫 실전]
- 형식: guide(AI 연구)
- 소스: arXiv:2607.15267 (200, 2026-07-16 공개, cs.AI/cs.CL)
- 왜 지금: 보안 콘텐츠 0건 + 갓 나온 논문. "AI 연구" 카테고리라 방금 만든 출처 블록 게이트를 처음으로 실전 통과시키는 것을 겸함.
- 리스크: 단일 최신 논문 기반 → 사실성 외부 자문 필요.

### 3. 자기일관성(Self-Consistency)  [추론기법 보완]
- 형식: glossary 또는 guide(AI 연구)
- 소스: arXiv:2607.15277 (200, cs.CL)
- 왜 지금: 기존 chain-of-thought 용어집 보완, 추론 기법 축 확장.
- 비고: 기존 사고의 연쇄 용어와 상호링크로 묶기 좋음.

## 추천
1번(프롬프트 인젝션) 우선 — evergreen·최고 검색 수요·완전 신규영역이라 SEO 투자 가치가 가장 크다.
paper-* 단일 논문 요약은 이미 8건+ 있으므로 개념형 신규 글이 포트폴리오 균형에 낫다.
