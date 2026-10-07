# 디자인 메모 (v2.1, KB Think 레퍼런스)

- 구조: 파스텔 밴드 + 흰 둥근 카드(30px), 카테고리별 색·도형 아이콘, 번호 큐레이션 리스트, 키워드 칩
- 카테고리 색: income #2F6BDE / finance #E2692A / business #1F8F55 / welfare #D6456A (site.config.ts)
- 글 페이지: 카테고리색 헤더 밴드 · 왼쪽 주제 내비 · 3줄 요약 · 공식 사이트 CTA · 접이식 목차 · 플로팅 도구(글자 크기/공유/맨 위)
- 홈 "마감이 다가오는 지원금": 프론트매터 `deadline`, `deadlineLabel` 기준, D-day는 브라우저에서 KST로 계산하고 지난 항목은 숨김
- 일러스트: 이미지 생성 → `public/images/posts/{slug}.webp`(640), `public/images/og/{slug}.jpg`(1200×630), `public/images/cat/{slug}.webp`

새 글 일러스트 프롬프트 (배경색만 카테고리에 맞춰 바꿈):

```
Soft 3D clay-render illustration in a friendly Korean fintech magazine style. Pastel solid background,
matte materials, rounded chunky shapes, gentle studio lighting with soft shadow, minimal composition with
generous empty space, centered subject. Absolutely no text, no letters, no numbers, no logos, no watermark.
Square format. Subject: {사물 묘사}. Background color: {income: soft sky blue (#DCE8FB) | finance: soft peach
orange (#FBE3D3) | business: soft mint green (#DDF0E2) | welfare: soft blush pink (#FADDE3)}.
```
