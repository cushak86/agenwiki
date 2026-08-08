// 상품 단일 진실 소스 — 사이트 전역(홈·스토어·배너)이 여기만 읽는다.
// 가격·URL이 바뀌면 이 파일 하나만 고친다.

export type ProductLine = "chronicle" | "rankup" | "bundle";

export interface Product {
  id: string;
  line: ProductLine;
  name: string;
  tagline: string;
  description: string;
  price: number | null; // null = 무료
  /** true = 아직 판매 전. 결제 링크 대신 대기 신청으로 보내고 가격 자리에 "판매 예정"을 표시한다.
   *  (price 는 정식 오픈 예정가로 남겨 둔다 — null 로 비우면 "무료"로 표시되어 거짓이 된다) */
  comingSoon?: boolean;
  priceNote?: string;
  url: string; // 구매/수령/대기신청 링크 (래피드 또는 내부)
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
      "키워드 발굴부터 네이버·구글 등록, 색인 루틴까지. 순위는 보장하지 않습니다 — 대신 이 코스의 검색엔진 등록 단계(STEP 5·6)를 이 사이트에 먼저 적용한 색인 실측을 공개합니다.",
    price: 99000,
    comingSoon: true,
    priceNote: "정식 오픈 예정가 99,000원",
    url: "/rankup#pricing",
    cover: "/store/rankup-core.png",
    badge: "베타 1기 대기 신청",
    relatedGuides: []
  },
  {
    id: "rankup-free",
    line: "rankup",
    name: "랭크업 STEP 0-2",
    tagline: "검색되는 사이트의 첫 3단계",
    // PDF 배포 중단 중(2026-08-08) — 구판에 폐기된 성과 보증이 실려 있어 내용 갱신 전까지 링크를
    // 랜딩 안내로 돌린다. 래피드 무료 상품(products/eaqjY)은 외부라 관리자에서 별도로 내려야 한다.
    // 갱신 완료 시: description 원복 + url 을 다시 래피드(또는 새 배포 경로)로.
    description:
      "키워드 발굴 → 플랫폼 선택 → 도메인·세팅. 자료를 갱신하는 동안 배포를 잠시 멈췄습니다 — 키워드 판정 시트는 지금도 받으실 수 있습니다.",
    price: null,
    url: "/rankup#free-plan",
    cover: "/store/rankup-free.png",
    relatedGuides: []
  }
];

export const comboProduct: Product = {
  id: "combo",
  line: "bundle",
  name: "완전판 세트 — 실전기 + 스타터 키트 + 랭크업 코어",
  tagline: "만들고·굴리고·검색되게, 세 권을 하나로",
  description:
    "1인 AI 회사를 운영하며 남긴 세 결과물을 통합본 한 권으로. 랭크업 코어가 들어가는 구성이라, 코어가 정식 오픈할 때 함께 판매합니다.",
  price: 119000,
  comingSoon: true,
  priceNote: "정식 오픈 예정가 119,000원",
  url: "/rankup#pricing",
  cover: "/store/combo.png",
  badge: "완전판",
  relatedGuides: []
};

export const chronicleProducts = products.filter((p) => p.line === "chronicle");
export const rankupProducts = products.filter((p) => p.line === "rankup");

export function formatPrice(p: Product): string {
  if (p.comingSoon) {
    return "판매 예정";
  }
  return p.price === null ? "무료" : `${p.price.toLocaleString("ko-KR")}원`;
}
