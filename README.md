# agenwiki.online — 정부지원금 & 공공기관 혜택 가이드 위키 (v2)

AI 에이전트 위키(Next.js, v1)에서 **정부지원금·공공기관 혜택 신청 가이드 위키**로 전면 개편한 버전.
Astro 정적 사이트 + 프론트매터 스키마 검증 + 본문 규칙 검사. 서버·DB 없음.

## 구조

```
src/site.config.ts          도메인·카테고리·애드센스 ID (여기 한 곳만 수정)
src/content.config.ts       프론트매터 스키마 (summary·agency·sources·verifiedDate 필수) — 틀리면 빌드 실패
src/content/posts/*.md      글 20편
src/layouts/PostLayout.astro  한눈에 보기 박스, 목차, 근거 자료, FAQ 구조화 데이터(본문 5번 섹션에서 추출)
src/pages/about|contact|privacy|disclaimer.astro   애드센스 심사 필수 4대 페이지
docs/content-calendar.md    20편 캘린더 (카테고리·slug·키워드·검색의도)
docs/WRITING_GUIDE.md       글 작성 규약 (6섹션 구조, 사실 검증 규칙)
docs/factcheck/*.md         글별 수치 검증 기록 (수치 → 공식 출처)
scripts/validate.py         본문 규칙 검사 (6섹션·FAQ 4~5개·표 2개·내부링크·분량·금지어)
```

## 사용

```bash
npm ci
node node_modules/astro/bin/astro.mjs dev       # 로컬 미리보기 (npm run dev가 안 되는 PC용)
node node_modules/astro/bin/astro.mjs build     # 정적 빌드 (스키마 검증 포함)
python scripts/validate.py                       # 전체 글 본문 검사
```

## 새 글 추가

1. `docs/content-calendar.md` 표에 한 줄 추가 (slug 확정)
2. `docs/WRITING_GUIDE.md` 규약대로 `src/content/posts/{slug}.md` 작성 + `docs/factcheck/{slug}.md` 기록
3. `python scripts/validate.py src/content/posts/{slug}.md` 통과 → 빌드 → push

## 제도 변경 시 갱신

- 수치가 바뀌면 본문 수정 + 프론트매터 `verifiedDate` 갱신 + factcheck 기록 갱신
- 매년 1월(기준 중위소득·최저임금·급여 상한 변경), 7~8월(다음 해 기준 중위소득 의결) 전체 점검

## 애드센스

- `ADSENSE.client`에 `ca-pub-2614971319845150` 설정됨 (자동 광고 스크립트만 로드)
- `public/ads.txt` 반영됨
- 승인 후 `ADSENSE.slots`에 수동 광고 단위 ID 입력
- Vercel Hobby(무료) 플랜은 광고 게재 등 상업적 이용을 금지 → 광고 게재 시점에 Pro 전환 또는 Cloudflare Pages 이전
