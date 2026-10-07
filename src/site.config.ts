// 사이트 전역 설정 — 도메인/애드센스 ID는 여기 한 곳만 고치면 됩니다.
export const SITE = {
  url: 'https://agenwiki.online',
  title: '에이전위키',                     // 글 제목 뒤에 붙는 짧은 브랜드명
  brand: 'AgenWiki',
  tagline: '정부지원금·공공기관 혜택 신청 가이드',
  description:
    '정부지원금, 공공기관(Agency) 혜택의 자격 요건·지급액·신청 절차를 공식 자료 기준으로 정리하는 신청 가이드 위키입니다.',
  author: '에이전위키 편집팀',
  locale: 'ko-KR',
  email: 'cushak@icloud.com',             // 문의 페이지에 공개되는 주소
  ogImage: '/images/og/default.jpg',
};

// 카테고리: 색(color) · 연한 배경(soft) · 일러스트 배경(art) · 아이콘 모양(icon) · 홈 히어로 큐레이션(featured)
export const CATEGORIES = [
  {
    slug: 'income', label: '취업·소득 지원', short: '취업·소득',
    desc: '실업급여, 국민취업지원제도, 근로장려금, 육아휴직급여 등 일자리와 소득을 받쳐 주는 제도',
    headline: '일자리를 잃었거나 찾고 있다면',
    color: '#2F6BDE', soft: '#EAF1FE', art: '#D7E8FD', icon: 'square',
    featured: ['unemployment-benefit', 'national-employment-support', 'earned-income-tax-credit'],
  },
  {
    slug: 'finance', label: '청년·서민 금융', short: '청년·서민금융',
    desc: '청년미래적금, 햇살론, 채무조정 등 청년과 서민을 위한 정책 금융 상품',
    headline: '목돈 모으기부터 급한 자금까지',
    color: '#E2692A', soft: '#FDF0E6', art: '#FCDEC4', icon: 'drop',
    featured: ['youth-future-savings', 'sunshine-loan', 'credit-recovery-debt-adjustment'],
  },
  {
    slug: 'business', label: '소상공인·자영업', short: '소상공인',
    desc: '정책자금, 폐업 지원, 노란우산, 사회보험료 지원 등 소상공인 지원 제도',
    headline: '가게를 지키고, 정리하고, 다시 시작할 때',
    color: '#1F8F55', soft: '#E8F6EE', art: '#D8EFDC', icon: 'hex',
    featured: ['semas-policy-fund', 'hope-return-package', 'yellow-umbrella'],
  },
  {
    slug: 'welfare', label: '주거·복지', short: '주거·복지',
    desc: '전세자금대출, 월세 지원, 기초연금, 에너지바우처 등 주거와 생활 복지',
    headline: '집과 생활비 부담을 덜고 싶다면',
    color: '#D6456A', soft: '#FDEEF2', art: '#FAD9DF', icon: 'heart',
    featured: ['basic-pension', 'energy-voucher', 'beotimmok-jeonse-loan'],
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];
export const catOf = (slug: string) => CATEGORIES.find((c) => c.slug === slug)!;
export const catStyle = (slug: string) => {
  const c = catOf(slug);
  return `--c:${c.color};--soft:${c.soft};--art:${c.art}`;
};

// 홈 "지금 챙겨야 할 글" 대표 글
export const HOME_PICK = 'youth-future-savings';

// 애드센스 설정
// - client만 채우면: <head>에 애드센스 스크립트만 로드됩니다. 사이트 확인과 자동 광고에 이것만 있으면 됩니다.
// - slots까지 채우면: 지정한 위치에 수동 광고 단위가 추가로 렌더링됩니다. 승인 후에 채우세요.
export const ADSENSE = {
  client: 'ca-pub-2614971319845150',
  slots: {
    top: '',
    bottom: '',
  },
};
