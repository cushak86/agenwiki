# 벡터DB 클러스터 강화 설계 (기획서)

- **작성**: 기획팀(agent-4) · 2026-07-23
- **트리거**: GSC 색인관제 4회차(2026-07-22) — 벡터DB 검색어군 신규 집중 노출 포착
- **저장소**: /opt/data/projects/agenwiki

---

## 0. 목표 · 대상 · 성공 기준 (측정 가능)

- **목표**: 벡터DB 검색어군(벡터 데이터베이스/벡터 DB/벡터db란/벡터데이터베이스/벡터 검색)에 대해 `guides/what-is-vector-database`가 **평균순위 97 → 30 이내(3페이지)**로 진입하도록 온페이지·내부링크로 권위를 집중한다.
- **대상 사용자**: "벡터 데이터베이스가 뭔지", "벡터 검색이 뭔지", "일반 DB와 뭐가 다른지" 정의를 찾는 입문 검색자(정보성 의도).
- **성공 기준(다음 회차 GSC 판정)**:
  - S1. `what-is-vector-database` 페이지 **평균순위 98.1 → 50 이내** (1차 목표, 다음 회차)
  - S2. 노출 쿼리 수 **1개 페이지에 벡터DB군 4~5개 쿼리 동시 매핑 유지**(파편화·자기잠식 없음)
  - S3. `벡터 검색` 쿼리가 **동일 페이지로 계속 매핑**(신규 페이지로 분산되지 않음)
  - S4. 노출 **7 → 20+**(잠재수요→실수요 전환 신호)
- **가정**: 위 순위 개선폭은 온페이지+내부링크만으로 달성 가능하다고 **가정**한다. 외부 신호(백링크) 부재 시 개선이 느릴 수 있음(§7 리스크).

---

## 1. 기존 커버리지 실측 요약 (각 파일 1줄)

| 파일 | 타입 | 무엇을 다루나 (실측) |
| --- | --- | --- |
| `content/guides/what-is-vector-database.mdx` | 가이드(입문) | 벡터DB 정의·일반DB 비교표·3단계 동작(임베딩→인덱싱→유사도검색)·도입 시점·FAQ 3개. **GSC 노출 집중 페이지.** |
| `content/glossary/vector-database.mdx` | 용어 | 벡터DB 개념·동작 3단계·쓰임새. aliases에 `벡터 DB`,`벡터DB` 포함. `related:[embedding, RAG]`. |
| `content/glossary/embedding.mdx` | 용어 | 임베딩 정의·"의미의 근접성=거리"·**의미 검색(semantic search) 언급**. `related` frontmatter **없음**. |
| `content/guides/what-is-rag.mdx` | 가이드(입문) | RAG 정의·3단계·언제 쓰나·한계·RAG vs 파인튜닝·FAQ. 본문서 벡터DB(glossary) 링크. |
| `content/glossary/retrieval-augmented-generation.mdx` | 용어 | RAG 개념·동기(최신성·환각)·검색 단계 설명. **본문에 임베딩/벡터DB 링크 전무**, `related` 없음. |

**핵심 관찰**: 벡터DB "정의" 의도는 이미 **가이드 1 + 용어 1 = 2개 노드**가 촘촘히 커버. "벡터 검색=의미 검색" 개념도 embedding 용어에 이미 부분 존재. → **정의 축의 커버리지는 충분**하다.

---

## 2. 검색의도 매핑

| 검색어 | GSC(4회차) | 검색의도 | 기존 커버 페이지 | 판정 |
| --- | --- | --- | --- | --- |
| `벡터db` | 노출1·순위100 | 벡터DB 정의(약어) | what-is-vector-database + 용어 aliases | 충분(동의어) |
| `벡터db란` | 노출2·순위96.5 | 벡터DB 정의(질문형) | 위 동일 | 충분(동의어) |
| `벡터데이터베이스` | 노출1·순위100 | 벡터DB 정의(붙여쓰기) | 위 동일 | 충분(alias 1건 보강 필요) |
| `벡터 검색` | 노출1·순위97 | **동작/기법(vector search=시맨틱 검색)** — "저장소"가 아니라 "행위" | 가이드 본문 2회 언급 + embedding 용어 partial | **부분 갭**(별도 하위의도) |
| (페이지) `what-is-vector-database` | 노출7·평균98.1 | 위 4개 쿼리의 실제 착지 페이지 | 자기 자신 | 랭킹 문제(커버리지 문제 아님) |

**결론(의도 매핑)**:
- `벡터db`/`벡터db란`/`벡터데이터베이스` = **벡터 데이터베이스 정의의 완전 동의어**. 기존 페이지가 정확히 커버. 신규 정의글은 **자기잠식**.
- `벡터 검색`은 개념상 구분되는 하위의도(저장소 vs 동작)이나, **수요 1노출**로 독립 글을 정당화하기엔 근거가 얇다.

---

## 3. 갭 판정 결론 — **B안 채택 (기존 what-is-vector-database 보강)**

> **택1: B안 (기존 글 title/description·본문 확장). A안(신규 글 1편) 기각.**

### 근거 (증거 기반)
1. **데이터가 가리키는 것은 "커버리지 갭"이 아니라 "랭킹 결손"이다.** 벡터DB군 4개 쿼리가 **모두 이미 한 페이지(`what-is-vector-database`)로 매핑**되어 있고, 문제는 그 페이지가 **평균 97위**라는 점이다. 새 페이지를 파는 것은 노출을 이미 얻고 있는 페이지를 강화하는 것보다 기대값이 낮고, 같은 클러스터 내 **키워드 자기잠식**을 유발한다(원칙 3: 트래픽 영향 우선).
2. **정의 축은 이미 가이드+용어 2노드로 충분히 커버**(§1). 3번째 정의 페이지는 권위를 분산시킨다.
3. **`벡터 검색` 하위의도는 수요 1노출.** 원칙 3(수익/트래픽 영향 우선)상 1노출 쿼리를 위해 신규 가이드(제작·발행·검증 비용)를 투입하는 것은 효과 대비 비용이 나쁘다. 대신 **기존 랭킹 페이지 안에 H2 1개로 흡수**하면, 이미 노출을 얻는 페이지의 **쿼리 표면(query surface)을 확장**해 `벡터 데이터베이스`와 `벡터 검색`을 한 페이지가 함께 노릴 수 있다.

### B안 실행 상세 (콘텐츠팀 실행용)

**(1) frontmatter 수정 — `content/guides/what-is-vector-database.mdx`**
- `title` (현행) `"벡터 데이터베이스란 무엇인가: 임베딩 검색의 핵심"`
  → (제안) `"벡터 데이터베이스(벡터 DB)란 무엇인가: 벡터 검색의 원리"`
  - 근거: `벡터 DB`(약어)와 `벡터 검색` 쿼리 토큰을 title에 직접 노출. 멋보다 검색되는 제목(원칙 2).
- `description` (현행) → (제안) `"벡터 데이터베이스(벡터 DB)가 무엇이고 일반 DB와 어떻게 다른지, 벡터 검색(시맨틱 검색)은 어떻게 동작하는지, RAG에서 왜 필요한지 쉬운 말로 정리합니다."`
- `updatedAt`을 발행일로 갱신. **frontmatter 스키마 필드 추가·변경 금지**(lib/content.ts 준수) — 기존 필드값만 수정.

**(2) 본문 H2 1개 신설 — "벡터 검색" 하위의도 흡수**
- 삽입 위치: 현행 `## 벡터 데이터베이스는 어떻게 동작하나?` **다음**.
- 신규 H2(질문형): `## 벡터 검색과 벡터 데이터베이스는 무엇이 다른가?`
- 내용 골자(정의·논리로 팩트밀도 확보, 수치 창작 금지):
  - **벡터 검색(vector search)** = 벡터 거리로 의미가 가까운 항목을 찾는 **동작/기법**(=시맨틱 검색). **벡터 데이터베이스** = 그 검색을 대규모로 빠르게 하도록 벡터를 저장·인덱싱하는 **저장소/인프라**.
  - 벡터 검색은 전용 DB 없이도 가능: 소규모는 메모리 내 직접 비교, 라이브러리(FAISS 등), 기존 DB의 벡터 확장(pgvector 등)으로도 수행. 규모가 커지면 전용 벡터 DB로 이동.
  - 2열 대비표(동작 vs 저장소) 1개 — **정성 구분만**(수치 아님).
  - [임베딩](/glossary/embedding)의 "의미 검색" 개념으로 연결.
- 이후 FAQ에 Q 1개 추가: `Q. 벡터 검색과 벡터 데이터베이스는 같은 말인가요?` / `A.` 동작 vs 저장소 구분.

**(3) glossary alias 1건 보강 — `content/glossary/vector-database.mdx`**
- `aliases`에 `"벡터데이터베이스"`(붙여쓰기) 추가 → 순위100 쿼리 exact 토큰 확보. (`벡터 검색`은 별개 개념이므로 vector-database alias로 넣지 않는다 — 개념 오염 방지.)

**(4) 카테고리·출처 정책**: 이 페이지 category=`"입문"` → **출처 블록 불요**(lib/content.ts는 `AI 연구`/`AI 소식`에만 강제). 입문·개념글은 §4대로 **정의·논리로 팩트밀도 확보**, 수치·가상인용 금지. 아래 출처는 **선택적 참고**로만, 사용 시 발행 게이트에서 200 검증(§6).

### A안을 기각하되, 재검토 트리거(조건부)
- **다음 2회차 이상 GSC에서 `벡터 검색`(+시맨틱 검색/벡터 유사도 등) 합산 노출이 회차당 20+로 지속**되거나, 해당 쿼리가 벡터DB 페이지와 **분리된 순위로 갈리면** → 그때 `guides/what-is-vector-search`(벡터 검색/시맨틱 검색이란) 독립 가이드를 재기획. 지금은 근거 부족으로 보류(가정 아닌 조건부 판단).

---

## 4. 내부링크 허브화 설계 (자연 지점만 · 억지 금지)

내부링크는 3층으로 작동(실측): ①본문 맥락 링크(SEO 핵심) ②glossary `related` frontmatter("관련 용어") ③태그기반 자동 `RelatedContent`("관련 글", `rag` 태그 공유로 이미 자동 연결됨). 아래는 **①·②의 결손을 메우는** 작업이다.

### 현재 결손(실측)
- `glossary/retrieval-augmented-generation` 본문이 **임베딩·벡터DB를 설명하면서도 두 페이지 어디에도 링크 없음** + `related` 비어 있음 → 클러스터 핵심 노드가 고립.
- `glossary/embedding`의 `related` frontmatter **없음** → 형제 용어(벡터DB·RAG)로 안 엮임.
- `guides/what-is-vector-database`가 **자기 용어 페이지(`glossary/vector-database`)로 링크 안 함**(가이드↔용어 비대칭; RAG쌍은 이미 상호 링크).

### 추가할 링크쌍 (우선순위순)

| # | 출발 파일 | → 도착 | 방식 | 자연 삽입 지점(근거) |
| --- | --- | --- | --- | --- |
| L1 | `glossary/retrieval-augmented-generation` | `glossary/embedding` | 본문 링크 | "임베딩 벡터로 바꿔 저장하고" 구절에 [임베딩] 링크 |
| L2 | `glossary/retrieval-augmented-generation` | `glossary/vector-database` | 본문 링크 | "문서 저장소나 지식베이스에서…검색" 부근에 [벡터 데이터베이스] 링크 |
| L3 | `glossary/retrieval-augmented-generation` | embedding, vector-database | `related` frontmatter 추가 | 현재 `related` 없음 → `[embedding, vector-database]` |
| L4 | `glossary/embedding` | vector-database, retrieval-augmented-generation | `related` frontmatter 추가 | 현재 없음 → `[vector-database, retrieval-augmented-generation]` |
| L5 | `guides/what-is-vector-database` | `glossary/vector-database` | 본문 링크 | 앤서캡슐 또는 정의 H2에서 "용어 정의는 [벡터 데이터베이스] 페이지" (RAG가이드↔RAG용어 패턴과 대칭) |
| L6 | `guides/what-is-rag` | `guides/what-is-vector-database` | 본문 링크 | 한계 섹션은 현재 용어페이지만 링크 → 검색 단계 심화로 **가이드**도 링크(중복 아님, 깊이 링크) |

- **이미 양호(수정 불요)**: `guides/what-is-vector-database`↔`glossary/embedding` 상호 링크 존재, `glossary/vector-database`→embedding/RAG/가이드 링크 존재. 억지로 더 넣지 않는다.
- L1~L6 완료 시 5개 노드가 **본문+frontmatter로 완전 연결(fully-connected)** 되고, RAG 용어의 고립이 해소된다.

---

## 5. 실존 출처 URL 후보 (선택 · 사용 시 발행 게이트에서 200 검증)

입문글이라 **출처 블록 불요**(§3-(4)). 아래는 §3-(2) 확장 내용의 사실 확인용 참고 후보이며, 본문에 인용으로 넣을 경우에만 실 200 검증한다. **가상 인용·창작 수치 금지.**
- Pinecone — What is a Vector Database?: https://www.pinecone.io/learn/vector-database/
- Weaviate — What is a Vector Database?: https://weaviate.io/blog/what-is-a-vector-database
- pgvector (기존 DB의 벡터 확장 예): https://github.com/pgvector/pgvector
- FAISS (라이브러리 예, Meta): https://github.com/facebookresearch/faiss
- HNSW(ANN 알고리즘) 논문: https://arxiv.org/abs/1603.09320

---

## 6. ⚠️ 미확인 / 리스크

- ⚠️ **수요가 극히 얇다**: 벡터DB군 합산 노출 5, `벡터 검색` 단 1, 전부 순위 96~100. 이는 **입증된 수요가 아니라 잠재(Google 테스트 노출)**다. B안은 저비용이라 실행 정당하나, 트래픽 상승폭은 **다음 회차 전까지 확인 불가(미확인)**.
- ⚠️ **순위 97의 원인이 온페이지가 아닐 수 있음**: 페이지 권위/외부 신호 부족이면 title·본문·내부링크만으로는 개선이 느릴 수 있다. B안은 필요조건이지 충분조건 아님.
- ⚠️ **클릭 데이터 미제공**: 4회차 스니펫에 클릭 없음 → 순위 97 특성상 **클릭 0 가정**. 실 클릭은 미확인.
- ⚠️ **라이브 재검증 미실시**: 본 기획은 4회차 수치를 그대로 사용. 발행 전 index-watch로 현재값 재확인 권장.
- ⚠️ **A안 재검토 트리거(§3)는 미래 조건부** — 지금 실행 대상 아님.

---

## 다음 팀에게 넘길 것

1. **콘텐츠팀(madev-content:draft)**: §3-(2) 본문 H2 신설 + §3-(1) title/description 수정 + §3-(3) alias 추가 초안. 입문글이므로 정의·논리로 팩트밀도 확보(수치 창작 금지).
2. **콘텐츠팀/개발**: §4 링크쌍 L1~L6 적용(본문 링크 4건 + `related` frontmatter 2건). 파일 5개만 최소 수정, 무관 파일 금지.
3. **SEO팀(madev-seo:publish-gate)**: 수정 후 발행 게이트 — frontmatter 스키마·상호링크 실존·(출처 인용 넣었으면)실 200·빌드 페이지수·라이브 200.
4. **SEO팀(madev-seo:index-watch)**: 발행 다음날부터 회차 로그에 벡터DB군 순위·노출 추적, §0 S1~S4 달성 여부 판정. 5회차에서 `벡터 검색` 노출 20+ 지속 시 A안(독립 가이드) 재기획 알림.
