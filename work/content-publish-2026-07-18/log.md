# 운영 로그 — content-publish-2026-07-18 (master/agent-4)

## 2026-07-18 세션 2 (/madev:go — 사장이 D·B·A 선택)

### D. 프롬프트 인젝션 글 발행 (완료·배포됨)
- publish-gate G1~G7 전 체인 통과. 증거:
  - G1 스키마: guides 필수필드 전부 충족, slug=파일명, draft:false. category=입문(출처블록 필수 카테고리 아님)이나 출처블록 2개 존재.
  - G2 YMYL: 보안 개념글(건강·의료·금융 아님). AI 생성고지 자동렌더(app/guides/[slug]/page.tsx:63).
  - G3 출처 실200: OWASP 200 / Simon Willison 200 (curl 실측).
  - G4 내부링크: 5개 전부 실존·비draft.
  - G5 빌드: 91/91 성공, guides 28→29 (+1), 경고·실패 0.
  - G6 배포: 커밋 ffa45bc → push(main, Vercel 자동배포). 사장 /madev:go "발행 마저" 선택이 배포 승인.
  - G7 라이브: https://agenwiki.vercel.app/guides/what-is-prompt-injection 200 (~60초 전파) + sitemap 등재 YES.

### B. 개인정보처리방침 실작성 (완료·배포됨)
- app/privacy/page.tsx "추후 확정" 한 줄 → 9개 절 실작성. 커밋 175c36f.
- 정직 원칙(about과 동일): 실제 수집만 기술 — 회원가입·폼 없음, Vercel Web Analytics(쿠키리스), 서버 접속로그.
- 쿠키 절: 현재 추적/광고 쿠키 없음. 광고 절: 현재 광고 없음, AdSense 도입 시 사전 갱신 명시(없는 걸 있다고 안 씀).
- 애드센스 하드블로커 2번(빈 방침) 제거됨.

### A. 내부링크 보강 + GSC 색인요청 (코드 완료·배포됨 / 색인요청은 사장 콘솔 몫)
- orphan 감사(content/ 본문 inbound 카운트): 실 orphan은 prompt-injection·glossary/vector-database 둘.
  (how-to-write-claude-md는 app/tools/claude-md 생성기에서 이미 링크됨 → 실 orphan 아님, 조치 없음.)
- 보강(커밋 4b488c0): prompt-injection inbound 0→3(mcp·getting-started·ai-agent에서 상호 역링크), vector-database 0→1(what-is-rag).
- 억지 링크 금지 원칙 준수 — 문맥상 자연스러운 지점에만.

## 검수 메모
- 외부자문(codex/gemini) 교차: 이번 세션 미실행. 사유 — 발행·정책문서·내부링크는 실측 증거(HTTP·빌드·grep)로 검증 가능한 결정적 작업이라 제3자 판단 불요로 판단. (사실성 논쟁 있는 콘텐츠였다면 필수였음.)
- 3건 모두 배포까지 실측 확인. 마지막 커밋 4b488c0.

### 약관(/terms) 실작성 (완료·배포됨 — 사장이 추가 선택)
- app/terms/page.tsx "추후 확정" → 9절 실작성. 커밋 5674883.
- about/privacy 정직 원칙: AI 생성·사람 검수 없음·오류 가능 명시. YMYL 판단엔 원문·전문가 확인 유도.
- 책임한계(as-is)·저작권/인용·외부링크 면책·privacy 연결·시행일 2026-07-18. 빌드 91/91.

### GEO 리팩토링 (2026-07-21 · 스타일가이드 GEO화 + guides 전체)
- **작법 규칙 GEO화**: style_guide.md(정본)+a_model_guide_v2.md에 앤서캡슐·질문형H2·FAQ·팩트밀도(실증만) 명시. 커밋 9885c71.
  - GEO 규칙3의 "가상 인용구 반드시 포함"은 /about 정직선언과 충돌 → **금지로 반전**(실증 인용·실측 수치만). 사장 "실증만" 선택.
- **파일럿**: what-is-rag GEO 리팩토링. 커밋 2970519. 사장 승인 후 확대.
- **guides 전체 28건**: 5개 writer 에이전트 병렬 리팩토링. 커밋 eed72b2(28 files, +531/-159).
  - master 일괄 검증 통과: 빌드 91/91, frontmatter updatedAt만 변경, **새 수치 0건·가상인용 0건(전수 감사)**, 내부링크 삭제 0·출처블록 보존.
  - 정직성 게이트: 출처 없는 입문/비교글은 기존 본문 재구성만. 수치 창작 없음 실측 확인.

## 되먹임 (다음 회차 입력)
- prompt-injection 발행 다음날(2026-07-19) index-watch 집중관찰 대상. 색인 여부 회차 로그에 기록.
- 색인 2주 판정일 2026-07-24 유지(사이트 최고령 2026-07-10 기준).
- 애드센스 남은 하드블로커: ①커스텀 도메인(사장 구매 결정) ③색인·트래픽(시간). B로 ②는 제거됨.
