---
title: 새 콘텐츠 1건 발행 (harvest → draft → publish-gate)
status: paused
opened: 2026-07-18
paused: 2026-07-18 (사장 요청 — 재개 핸드오프는 RESUME.md)
owner: master(agent-4)
teams: [planner, writer, seo]
backend: claude
---

## 진행 요약 (상세: RESUME.md)
- harvest ✓ (results/harvest.md) → 사장이 '프롬프트 인젝션' 선택
- draft ✓ 미발행 (content/guides/what-is-prompt-injection.mdx — publish-gate 전, 커밋 금지)
- 곁가지: 애드센스 검토(results/adsense-readiness.md) + 색인관제 1회차(docs/seo/색인관제-로그.md)
- 다음 수 후보: A 내부링크+색인요청 / B 개인정보방침 / C 커스텀도메인 / D 발행 마저

# 목표
새 글 1건을 근거와 함께 수집→초안→발행 게이트까지 통과시켜 발행한다.
방금 만든 출처 블록 게이트(카테고리 기준, 23b9f5f)를 처음으로 실전 통과시키는 것을 겸한다.

# 단계
1. harvest — arxiv/RSS 또는 리서치로 소재 후보를 근거와 함께 선별(선택지 제시)
2. draft — 스타일가이드 준수·출처 URL 실 200 검증 초안. 방향 갈리면 4옵션 시안.
3. publish-gate — frontmatter 스키마·YMYL 고지·출처 200·상호링크 실존·빌드 페이지수·배포·라이브 200

# 검수
- 외부 자문(codex/gemini) 최소 1회 교차 — 소재 선정 또는 초안 사실성.
- 발행 전 publish-gate 전 체인 통과 증거를 results/에 남긴다.
