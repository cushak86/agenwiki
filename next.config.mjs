/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // 호스트 정규화: vercel.app 별칭 접속을 정식 도메인으로 308 (2026-08-03 사장님 보고 — vercel.app이 200으로 유지되던 문제)
      // canonical 태그는 이미 agenwiki.online을 가리키지만, 호스트 단 리다이렉트가 정석(중복 호스트 색인 원천 차단)
      {
        source: "/:path*",
        has: [{ type: "host", value: "agenwiki.vercel.app" }],
        destination: "https://agenwiki.online/:path*",
        permanent: true
      },
      // 토픽 페이지 폐지(`*-prompts` 6개) — 2026-08-09. 프롬프트 허브가 정본이다.
      // 같은 태그에 대해 /topics/<tag>(카드 그리드 1,444자)와 /prompts/<tag>(전문 16,109자)가
      // 동시에 존재하면 자기잠식이다. 허브가 프롬프트 전문 + 같은 태그 가이드까지 담으므로
      // 토픽 페이지가 보여주던 것을 잃지 않는다.
      // ⚠️ 규칙은 "태그가 `-prompts` 로 끝나면 허브"다(lib/meta.ts topicHref). 태그를 새로 만들면
      //    여기에도 한 줄 추가해야 한다 — scripts/check-link-distribution.mjs 가 어긋나면 잡는다.
      { source: "/topics/productivity-prompts", destination: "/prompts/productivity-prompts", permanent: true },
      { source: "/topics/developer-prompts", destination: "/prompts/developer-prompts", permanent: true },
      { source: "/topics/marketing-prompts", destination: "/prompts/marketing-prompts", permanent: true },
      { source: "/topics/planning-prompts", destination: "/prompts/planning-prompts", permanent: true },
      { source: "/topics/data-analysis-prompts", destination: "/prompts/data-analysis-prompts", permanent: true },
      { source: "/topics/learning-prompts", destination: "/prompts/learning-prompts", permanent: true },
      // 프롬프트 개별 URL 폐지 — 2026-08-09. 태그별 허브의 앵커로 영구 리다이렉트.
      // 근거: 30편의 **렌더되는** 고유 글자 수가 중앙값 979자(본문 508 + promptText 406 + 메타)이고
      // 30편 전부 1,500자 미만이었으며, 30편 중 27편의 h2 구조가 글자 하나까지 같았다.
      // 979자짜리 근친 중복이 사이트맵의 20%를 차지하면 개별 색인의 한계효용이 없어
      // 「발견됨-미색인」에 쌓이고, 그 덩어리가 사이트 전체 품질 평가까지 끌어내린다.
      // 허브 7개로 묶으니 각 페이지가 2,000~8,800자가 된다. 판단 근거 전문은 lib/meta.ts 주석.
      { source: "/prompts/ad-copy-ab-prompt", destination: "/prompts/marketing-prompts#ad-copy-ab-prompt", permanent: true },
      { source: "/prompts/agent-workflow", destination: "/prompts/prompt-engineering#agent-workflow", permanent: true },
      { source: "/prompts/code-debugging-refactoring-prompt", destination: "/prompts/prompt-engineering#code-debugging-refactoring-prompt", permanent: true },
      { source: "/prompts/code-review-prompt", destination: "/prompts/productivity-prompts#code-review-prompt", permanent: true },
      { source: "/prompts/competitor-analysis-prompt", destination: "/prompts/planning-prompts#competitor-analysis-prompt", permanent: true },
      { source: "/prompts/concept-comparison-prompt", destination: "/prompts/learning-prompts#concept-comparison-prompt", permanent: true },
      { source: "/prompts/concept-learning-prompt", destination: "/prompts/productivity-prompts#concept-learning-prompt", permanent: true },
      { source: "/prompts/customer-persona-prompt", destination: "/prompts/marketing-prompts#customer-persona-prompt", permanent: true },
      { source: "/prompts/data-interpretation-prompt", destination: "/prompts/data-analysis-prompts#data-interpretation-prompt", permanent: true },
      { source: "/prompts/email-report-writing-prompt", destination: "/prompts/productivity-prompts#email-report-writing-prompt", permanent: true },
      { source: "/prompts/error-log-analysis-prompt", destination: "/prompts/developer-prompts#error-log-analysis-prompt", permanent: true },
      { source: "/prompts/korean-english-translation-prompt", destination: "/prompts/productivity-prompts#korean-english-translation-prompt", permanent: true },
      { source: "/prompts/long-document-summary-prompt", destination: "/prompts/productivity-prompts#long-document-summary-prompt", permanent: true },
      { source: "/prompts/meeting-agenda-prompt", destination: "/prompts/productivity-prompts#meeting-agenda-prompt", permanent: true },
      { source: "/prompts/meeting-notes-prompt", destination: "/prompts/productivity-prompts#meeting-notes-prompt", permanent: true },
      { source: "/prompts/mistake-note-prompt", destination: "/prompts/learning-prompts#mistake-note-prompt", permanent: true },
      { source: "/prompts/pr-description-prompt", destination: "/prompts/developer-prompts#pr-description-prompt", permanent: true },
      { source: "/prompts/prd-draft-prompt", destination: "/prompts/planning-prompts#prd-draft-prompt", permanent: true },
      { source: "/prompts/presentation-script-prompt", destination: "/prompts/productivity-prompts#presentation-script-prompt", permanent: true },
      { source: "/prompts/regex-builder-prompt", destination: "/prompts/developer-prompts#regex-builder-prompt", permanent: true },
      { source: "/prompts/release-notes-prompt", destination: "/prompts/developer-prompts#release-notes-prompt", permanent: true },
      { source: "/prompts/resume-improvement-prompt", destination: "/prompts/productivity-prompts#resume-improvement-prompt", permanent: true },
      { source: "/prompts/seo-outline-prompt", destination: "/prompts/marketing-prompts#seo-outline-prompt", permanent: true },
      { source: "/prompts/social-thread-prompt", destination: "/prompts/marketing-prompts#social-thread-prompt", permanent: true },
      { source: "/prompts/spreadsheet-formula-prompt", destination: "/prompts/data-analysis-prompts#spreadsheet-formula-prompt", permanent: true },
      { source: "/prompts/sql-query-writing-prompt", destination: "/prompts/data-analysis-prompts#sql-query-writing-prompt", permanent: true },
      { source: "/prompts/study-plan-prompt", destination: "/prompts/learning-prompts#study-plan-prompt", permanent: true },
      { source: "/prompts/survey-design-prompt", destination: "/prompts/planning-prompts#survey-design-prompt", permanent: true },
      { source: "/prompts/test-case-generation-prompt", destination: "/prompts/developer-prompts#test-case-generation-prompt", permanent: true },
      { source: "/prompts/user-interview-questions-prompt", destination: "/prompts/planning-prompts#user-interview-questions-prompt", permanent: true },
      // 가이드 통합 — 2026-08-08. chatgpt-vs-claude 와 chatgpt-vs-gemini-vs-claude 가
      // 소제목 7개 중 6개가 글자까지 동일한 near-duplicate 였다("두 서비스 모두…" → "세 서비스 모두…"
      // 치환이 본문 차이의 대부분). 같은 질의에 자기 URL 두 개가 붙으면 구글이 하나만 대표로 고르고
      // 나머지를 보류하므로, 자기잠식이 용어↔가이드에서 가이드↔가이드로 옮겨간 형태였다.
      // 3자 글이 2자 글의 상위집합이라 그쪽으로 통합했고, 2자 글의 고유분(비교표·RAG 링크·FAQ 2문항)은
      // 「ChatGPT와 Claude만 놓고 보면」 절로 옮겨 담아 손실을 0으로 만들었다.
      { source: "/guides/chatgpt-vs-claude", destination: "/guides/chatgpt-vs-gemini-vs-claude", permanent: true },
      // 태그/토픽 체계 재설계(docs/seo/2026-07-11-태그-토픽-체계-재설계.md) 3절 대응표 74건
      // ai-agent-basics
      { source: "/topics/ai-agent", destination: "/topics/ai-agent-basics", permanent: true },
      { source: "/topics/%EC%9B%8C%ED%81%AC%ED%94%8C%EB%A1%9C%EC%9A%B0", destination: "/topics/ai-agent-basics", permanent: true }, // 워크플로우
      // ai-agent-advanced
      { source: "/topics/%EC%97%90%EC%9D%B4%EC%A0%84%ED%8A%B8", destination: "/topics/ai-agent-advanced", permanent: true }, // 에이전트
      { source: "/topics/%EC%9E%A5%EA%B8%B0%20%EC%8B%A4%ED%96%89%20%EC%97%90%EC%9D%B4%EC%A0%84%ED%8A%B8", destination: "/topics/ai-agent-advanced", permanent: true }, // 장기 실행 에이전트
      { source: "/topics/%EB%A9%94%EB%AA%A8%EB%A6%AC", destination: "/topics/ai-agent-advanced", permanent: true }, // 메모리
      { source: "/topics/%EC%BB%A8%ED%85%8D%EC%8A%A4%ED%8A%B8%20%EA%B4%80%EB%A6%AC", destination: "/topics/ai-agent-advanced", permanent: true }, // 컨텍스트 관리
      { source: "/topics/%EC%9B%B9%20%EA%B2%80%EC%83%89%20%EC%97%90%EC%9D%B4%EC%A0%84%ED%8A%B8", destination: "/topics/ai-agent-advanced", permanent: true }, // 웹 검색 에이전트
      { source: "/topics/%EB%A9%80%ED%8B%B0%EC%97%90%EC%9D%B4%EC%A0%84%ED%8A%B8", destination: "/topics/ai-agent-advanced", permanent: true }, // 멀티에이전트
      { source: "/topics/%EC%A0%95%EB%B3%B4%20%ED%83%90%EC%83%89", destination: "/topics/ai-agent-advanced", permanent: true }, // 정보 탐색
      { source: "/topics/LLM%20%EC%9B%8C%ED%81%AC%ED%94%8C%EB%A1%9C", destination: "/topics/ai-agent-advanced", permanent: true }, // LLM 워크플로
      { source: "/topics/%EC%9D%98%EB%AF%B8%EC%A0%81%20%EC%98%81%EC%86%8D%EC%84%B1", destination: "/topics/ai-agent-advanced", permanent: true }, // 의미적 영속성
      { source: "/topics/%EC%A7%80%EC%8B%9D%20%ED%91%9C%ED%98%84", destination: "/topics/ai-agent-advanced", permanent: true }, // 지식 표현
      { source: "/topics/%EB%A9%80%ED%8B%B0%EB%AA%A8%EB%8B%AC", destination: "/topics/ai-agent-advanced", permanent: true }, // 멀티모달
      { source: "/topics/benchmark", destination: "/topics/ai-agent-advanced", permanent: true },
      // rag
      // 주의: "/topics/RAG" -> "/topics/rag" 리다이렉트는 넣지 않는다. 로컬 실측 결과 이 Next.js 버전의
      // redirects()는 source를 대소문자 구분 없이 매칭하여, RAG 리다이렉트 규칙이 실제 목적지인
      // /topics/rag(신규 토픽 페이지, 5편)까지 가로채 자기 자신으로 무한 308 루프를 일으켰다(실측, next start + curl -v로 확인).
      // "rag"는 신규 토픽 슬러그이므로 대소문자 무관 라우팅에 의해 별도 리다이렉트 없이도 /topics/RAG, /topics/Rag 등은
      // 동일한 정적 페이지로 서빙된다(아래 검증 로그 참고).
      { source: "/topics/%EA%B2%80%EC%83%89", destination: "/topics/rag", permanent: true }, // 검색
      { source: "/topics/%EC%A7%80%EC%8B%9D%EB%B2%A0%EC%9D%B4%EC%8A%A4", destination: "/topics/rag", permanent: true }, // 지식베이스
      { source: "/topics/%EC%9E%84%EB%B2%A0%EB%94%A9", destination: "/topics/rag", permanent: true }, // 임베딩
      { source: "/topics/%ED%91%9C%ED%98%84%ED%95%99%EC%8A%B5", destination: "/topics/rag", permanent: true }, // 표현학습
      { source: "/topics/%EB%B2%A1%ED%84%B0", destination: "/topics/rag", permanent: true }, // 벡터
      { source: "/topics/NLP", destination: "/topics/rag", permanent: true },
      // prompt-engineering
      { source: "/topics/%ED%94%84%EB%A1%AC%ED%94%84%ED%8A%B8", destination: "/topics/prompt-engineering", permanent: true }, // 프롬프트
      { source: "/topics/%EC%83%9D%EC%84%B1%ED%98%95AI", destination: "/topics/prompt-engineering", permanent: true }, // 생성형AI
      // productivity-prompts
      { source: "/topics/%EC%BD%94%EB%93%9C%EB%A6%AC%EB%B7%B0", destination: "/topics/productivity-prompts", permanent: true }, // 코드리뷰
      { source: "/topics/%EB%94%94%EB%B2%84%EA%B9%85", destination: "/topics/productivity-prompts", permanent: true }, // 디버깅
      { source: "/topics/%EB%B3%B4%EC%95%88", destination: "/topics/productivity-prompts", permanent: true }, // 보안
      { source: "/topics/%EB%A6%AC%ED%8C%A9%ED%84%B0%EB%A7%81", destination: "/topics/productivity-prompts", permanent: true }, // 리팩터링
      { source: "/topics/%EC%9A%94%EC%95%BD", destination: "/topics/productivity-prompts", permanent: true }, // 요약
      { source: "/topics/%EB%AC%B8%EC%84%9C%EC%B2%98%EB%A6%AC", destination: "/topics/productivity-prompts", permanent: true }, // 문서처리
      { source: "/topics/%EC%83%9D%EC%82%B0%EC%84%B1", destination: "/topics/productivity-prompts", permanent: true }, // 생산성
      { source: "/topics/%ED%9A%8C%EC%9D%98%EB%A1%9D", destination: "/topics/productivity-prompts", permanent: true }, // 회의록
      { source: "/topics/%EC%95%A1%EC%85%98%EC%95%84%EC%9D%B4%ED%85%9C", destination: "/topics/productivity-prompts", permanent: true }, // 액션아이템
      // fine-tuning-optimization
      { source: "/topics/%ED%95%99%EC%8A%B5", destination: "/topics/fine-tuning-optimization", permanent: true }, // 학습
      { source: "/topics/%EC%A0%84%EC%9D%B4%ED%95%99%EC%8A%B5", destination: "/topics/fine-tuning-optimization", permanent: true }, // 전이학습
      { source: "/topics/%EB%AA%A8%EB%8D%B8%EC%A0%81%EC%9D%91", destination: "/topics/fine-tuning-optimization", permanent: true }, // 모델적응
      { source: "/topics/%EC%96%91%EC%9E%90%ED%99%94", destination: "/topics/fine-tuning-optimization", permanent: true }, // 양자화
      { source: "/topics/%EC%96%B4%ED%85%90%EC%85%98", destination: "/topics/fine-tuning-optimization", permanent: true }, // 어텐션
      { source: "/topics/%EB%AA%A8%EB%8D%B8%20%EC%95%95%EC%B6%95", destination: "/topics/fine-tuning-optimization", permanent: true }, // 모델 압축
      { source: "/topics/%EC%A0%80%EA%B3%84%EC%88%98%20%EC%A0%95%EA%B7%9C%ED%99%94", destination: "/topics/fine-tuning-optimization", permanent: true }, // 저계수 정규화
      { source: "/topics/%EC%8B%A0%EA%B2%BD%EB%A7%9D%20%ED%95%99%EC%8A%B5", destination: "/topics/fine-tuning-optimization", permanent: true }, // 신경망 학습
      // llm-fundamentals
      { source: "/topics/%ED%86%A0%ED%81%B0%ED%99%94", destination: "/topics/llm-fundamentals", permanent: true }, // 토큰화
      { source: "/topics/%EC%BB%A8%ED%85%8D%EC%8A%A4%ED%8A%B8", destination: "/topics/llm-fundamentals", permanent: true }, // 컨텍스트
      { source: "/topics/%EC%9E%90%EC%97%B0%EC%96%B4%EC%B2%98%EB%A6%AC", destination: "/topics/llm-fundamentals", permanent: true }, // 자연어처리
      { source: "/topics/%EC%8B%A0%EB%A2%B0%EC%84%B1", destination: "/topics/llm-fundamentals", permanent: true }, // 신뢰성
      // ai-model-comparison
      { source: "/topics/%EB%B9%84%EA%B5%90", destination: "/topics/ai-model-comparison", permanent: true }, // 비교
      { source: "/topics/OpenAI", destination: "/topics/ai-model-comparison", permanent: true },
      { source: "/topics/GPT-5.6", destination: "/topics/ai-model-comparison", permanent: true },
      // vision-multimodal-research
      { source: "/topics/%EB%B9%84%EC%A0%84-%EC%96%B8%EC%96%B4%EB%AA%A8%EB%8D%B8", destination: "/topics/vision-multimodal-research", permanent: true }, // 비전-언어모델
      { source: "/topics/%EC%9E%90%EC%9C%A8%EC%A3%BC%ED%96%89", destination: "/topics/vision-multimodal-research", permanent: true }, // 자율주행
      { source: "/topics/%EC%8B%9C%EA%B0%81%EC%A7%88%EC%9D%98%EC%9D%91%EB%8B%B5", destination: "/topics/vision-multimodal-research", permanent: true }, // 시각질의응답
      { source: "/topics/%EB%8C%80%EC%8B%9C%EC%BA%A0", destination: "/topics/vision-multimodal-research", permanent: true }, // 대시캠
      { source: "/topics/%EC%98%81%EC%83%81%EC%83%9D%EC%84%B1", destination: "/topics/vision-multimodal-research", permanent: true }, // 영상생성
      { source: "/topics/%EC%B6%94%EB%A1%A0", destination: "/topics/vision-multimodal-research", permanent: true }, // 추론
      { source: "/topics/Chain-of-Frame", destination: "/topics/vision-multimodal-research", permanent: true },
      { source: "/topics/%EB%8D%B0%EC%9D%B4%ED%84%B0%EC%85%8B", destination: "/topics/vision-multimodal-research", permanent: true }, // 데이터셋
      // ai-research-insights
      { source: "/topics/%EC%95%84%EC%9D%B4%EB%94%94%EC%96%B4%20%EA%B3%84%EB%B3%B4", destination: "/topics/ai-research-insights", permanent: true }, // 아이디어 계보
      { source: "/topics/%EA%B3%BC%ED%95%99%20%EC%B6%94%EB%A1%A0", destination: "/topics/ai-research-insights", permanent: true }, // 과학 추론
      { source: "/topics/UMAP", destination: "/topics/ai-research-insights", permanent: true },
      { source: "/topics/%EC%B0%A8%EC%9B%90%20%EC%B6%95%EC%86%8C", destination: "/topics/ai-research-insights", permanent: true }, // 차원 축소
      { source: "/topics/%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC%20%EB%B6%84%EC%84%9D", destination: "/topics/ai-research-insights", permanent: true }, // 네트워크 분석
      { source: "/topics/kNN%20%EA%B7%B8%EB%9E%98%ED%94%84", destination: "/topics/ai-research-insights", permanent: true }, // kNN 그래프
      { source: "/topics/AI%20%ED%95%99%EC%8A%B5%20%EB%8F%84%EC%9A%B0%EB%AF%B8", destination: "/topics/ai-research-insights", permanent: true }, // AI 학습 도우미
      { source: "/topics/%EA%B5%90%EC%9C%A1%EC%9A%A9%20%EC%B1%97%EB%B4%87", destination: "/topics/ai-research-insights", permanent: true }, // 교육용 챗봇
      { source: "/topics/%EA%B3%A0%EB%93%B1%EA%B5%90%EC%9C%A1", destination: "/topics/ai-research-insights", permanent: true }, // 고등교육
      { source: "/topics/%EB%A1%9C%EA%B7%B8%20%EB%8D%B0%EC%9D%B4%ED%84%B0%20%EB%B6%84%EC%84%9D", destination: "/topics/ai-research-insights", permanent: true }, // 로그 데이터 분석
      { source: "/topics/research", destination: "/topics/ai-research-insights", permanent: true },
      { source: "/topics/evaluation", destination: "/topics/ai-research-insights", permanent: true },
      // newsletter 태그는 기존 /newsletter 인덱스로
      { source: "/topics/newsletter", destination: "/newsletter", permanent: true },
      // 여러 신규 토픽에 고르게 걸쳐 있어 단일 대상 지정이 부적절한 태그 -> /topics 인덱스
      { source: "/topics/LLM", destination: "/topics", permanent: true },
      { source: "/topics/llm", destination: "/topics", permanent: true },
      { source: "/topics/%EC%9E%85%EB%AC%B8", destination: "/topics", permanent: true }, // 입문
      { source: "/topics/%EB%B2%A4%EC%B9%98%EB%A7%88%ED%81%AC", destination: "/topics", permanent: true }, // 벤치마크
      { source: "/topics/LLM%20%ED%8F%89%EA%B0%80", destination: "/topics", permanent: true }, // LLM 평가
      { source: "/topics/%ED%8F%89%EA%B0%80", destination: "/topics", permanent: true } // 평가
    ];
  }
};

export default nextConfig;
