// 상품 단일 진실 소스 — 사이트 전역(홈·스토어·배너)이 여기만 읽는다.
// 가격·URL이 바뀌면 이 파일 하나만 고친다.

export type ProductLine = "chronicle" | "rankup";

export interface Product {
  id: string;
  line: ProductLine;
  name: string;
  tagline: string;
  description: string;
  price: number | null; // null = 무료
  priceNote?: string;
  url: string; // 구매/수령 링크 (래피드 또는 내부)
  cover: string; // public/ 기준 경로
  badge?: string;
  /** 이 상품과 관련 깊은 가이드 슬러그 — 상호 연계용 */
  relatedGuides: string[];
}

export const products: Product[] = [
  {
    id: "book",
    line: "chronicle",
    name: "1인 AI 회사 실전기",
    tagline: "Claude Code 멀티에이전트로 회사를 굴린 428커밋의 기록",
    description:
      "이 사이트를 운영하는 회사의 실전 기록입니다. 각색 없이 운영 로그 원문 23건을 출처와 함께 인용했습니다.",
    price: 19900,
    url: "https://www.latpeed.com/products/1TaKZ",
    cover: "/store/book.png",
    relatedGuides: ["multi-agent-team-operation", "verify-ai-completion-report"]
  },
  {
    id: "kit",
    line: "chronicle",
    name: "멀티에이전트 스타터 키트",
    tagline: "428커밋 회사를 굴린 현역 파일 11개",
    description:
      "회사헌법 13조·부서정의·작업기억 3파일·지시서 양식·계측 양식·실제 사고 5건. 견본이 아니라 지금도 돌아가는 파일입니다.",
    price: 29900,
    url: "https://www.latpeed.com/products/61mCC",
    cover: "/store/kit.png",
    relatedGuides: ["agent-work-memory", "multi-agent-team-operation", "how-to-write-claude-md"]
  },
  {
    id: "minibook",
    line: "chronicle",
    name: "AI 직원 채용 체크리스트 10",
    tagline: "1인 AI 회사 428커밋의 실전 점검표",
    description:
      "항목마다 [실제 사고] → [실행법] → [체크박스]로 정리한 무료 미니북. 3개 이하로 체크된다면 지금 AI가 한 일을 검증하지 못하고 있는 겁니다.",
    price: null,
    url: "https://www.latpeed.com/products/z0eWl",
    cover: "/store/minibook.png",
    relatedGuides: ["verify-ai-completion-report", "filter-fabricated-sources", "getting-started-with-ai-agents"]
  },
  {
    id: "rankup-core",
    line: "rankup",
    name: "랭크업 — 12단계 딸깍 가이드",
    tagline: "따라만 하면 검색되는 사이트가 완성됩니다",
    description:
      "키워드 발굴부터 네이버·구글 등록, 색인 루틴까지. 순위는 보장하지 않습니다 — 대신 완주 후 지표 미달 시 전액 환급합니다.",
    price: 99000,
    priceNote: "정가 249,000원 · 베타 1기 20명",
    url: "https://www.latpeed.com/products/KfhhM",
    cover: "/store/rankup-core.png",
    badge: "베타 1기",
    relatedGuides: []
  },
  {
    id: "rankup-free",
    line: "rankup",
    name: "랭크업 STEP 0-2",
    tagline: "검색되는 사이트의 첫 3단계, 오늘 90분",
    description:
      "키워드 발굴 → 플랫폼 선택 → 도메인·세팅. 무료분만으로 사이트가 실제로 열립니다.",
    price: null,
    url: "https://www.latpeed.com/products/eaqjY",
    cover: "/store/rankup-free.png",
    relatedGuides: []
  }
];

export const chronicleProducts = products.filter((p) => p.line === "chronicle");
export const rankupProducts = products.filter((p) => p.line === "rankup");

export function formatPrice(p: Product): string {
  return p.price === null ? "무료" : `${p.price.toLocaleString("ko-KR")}원`;
}
