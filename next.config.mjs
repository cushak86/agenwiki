/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
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
