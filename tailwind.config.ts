import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // 실록 라인 다크 팔레트 — 책·키트 커버(#12121f/#6246ea/#b9a7ff)와 같은 세계관
        paper: "#101019", // 페이지 배경
        panel: "#181826", // 카드·패널 표면
        panel2: "#20202f", // 한 단계 밝은 표면(코드·표 머리)
        line: "#2a2a3c", // 경계선
        ink: "#eceaf6", // 제목·강조 텍스트
        body: "#c9c6dc", // 본문 텍스트
        muted: "#9a97b0", // 보조 텍스트
        accent: "#9d8cff", // 링크·포인트 (다크 배경 대비 확보용 밝은 퍼플)
        accentDeep: "#6246ea", // 버튼 채움 (브랜드 원색)
        accentSoft: "#b9a7ff" // 커버와 동일한 라이트 퍼플
      },
      fontFamily: {
        sans: [
          "var(--font-pretendard)",
          "Pretendard",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "system-ui",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
};

export default config;
