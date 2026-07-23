# 컨텍스트

- 운영 저장소: /opt/data/projects/agenwiki (배포 소스, Vercel). 여기서만 작업.
- 콘텐츠 위치: content/guides/*.mdx, content/glossary/*.mdx. frontmatter draft:false여야 발행.
- 스타일 정본: docs 스타일가이드 + GEO 규칙(앤서캡슐·질문형H2·FAQ·팩트밀도 실증만, 가상인용 금지).
- 내부링크 컴포넌트: RelatedContent 존재(데이터만 채우면 됨).
- 발행 게이트: madev-seo:publish-gate (frontmatter 스키마·출처 200·상호링크 실존·빌드·라이브 200).
- GSC 실데이터 원천: 8-compay/ops/seo/색인관제-로그.md 4회차.
