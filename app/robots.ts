import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/seo";

// AI 크롤러 접근 정책 — 명시적 "허용".
//
// 이 사이트의 유입 전략은 AI 검색(ChatGPT·Perplexity·Claude 등)에서 인용되는 것이다.
// 따라서 AI 봇은 차단이 아니라 허용을 명문화한다. 와일드카드(*)만 있어도 허용이지만,
// 봇 이름을 명시하면 (1) 정책이 의도임이 분명해지고 (2) 나중에 특정 봇만 차단할 때
// 그 봇 그룹만 골라 바꿀 수 있다.
//
// 그룹 구분:
//   검색·인용 봇 — 답변에 출처 링크를 달아 유입을 만든다. 핵심 허용 대상.
//   학습 수집 봇 — 모델 학습용 수집. 인용 링크는 없지만 모델이 사이트를 "아는 것" 자체가
//                  장기 인지도 자산이라 허용한다. 정책을 바꾸려면 이 그룹만 disallow로.
//
// Crawl-delay 는 넣지 않는다: Googlebot 은 이 지시어를 무시하고, 이 사이트는 Vercel CDN
// 정적 배포라 크롤 부하 관리가 필요 없으며, AI 봇을 지연시키는 것은 인용 전략과 반대다.
const AI_SEARCH_BOTS = [
  "OAI-SearchBot", // ChatGPT 검색 색인
  "ChatGPT-User", // ChatGPT 사용자 요청 시 실시간 열람
  "ClaudeBot", // Anthropic 크롤러
  "Claude-User", // Claude 사용자 요청 시 실시간 열람
  "Claude-SearchBot", // Claude 검색 색인
  "PerplexityBot", // Perplexity 색인
  "Perplexity-User" // Perplexity 사용자 요청 시 실시간 열람
];

const AI_TRAINING_BOTS = [
  "GPTBot", // OpenAI 학습 수집
  "anthropic-ai", // Anthropic 학습 수집(구 명칭 병기)
  "Google-Extended", // Gemini 학습·그라운딩 (일반 구글 검색 색인과 별개 토큰)
  "CCBot", // Common Crawl — 다수 모델의 학습 데이터 원천
  "Applebot-Extended", // Apple Intelligence 학습
  "Meta-ExternalAgent" // Meta AI 학습
];

// /search 는 클라이언트 상태로만 동작하는 페이지라 이미 meta noindex 로 색인 제외했다.
// robots 에서도 막아 크롤 예산이 목록·문서 페이지에 쓰이게 한다.
const DISALLOW_PATHS = ["/search"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW_PATHS
      },
      {
        userAgent: AI_SEARCH_BOTS,
        allow: "/",
        disallow: DISALLOW_PATHS
      },
      {
        userAgent: AI_TRAINING_BOTS,
        allow: "/",
        disallow: DISALLOW_PATHS
      }
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url
  };
}
