# 일일 발행 루틴 절차 (하루 2편)

저장소: `D:\orac-work\agenwiki-renew` (GitHub `cushak86/agenwiki`, `main`에 push하면 Vercel이 agenwiki.online에 자동 배포)

## 0. 준비
1. `git -C D:\orac-work\agenwiki-renew pull --ff-only` 로 최신화. 작업 트리가 깨끗하지 않으면 원인을 확인하고, 내 작업이 아닌 변경은 건드리지 말고 보고한다.
2. 오늘 날짜(KST)를 확인한다. `pubDate`와 `verifiedDate`는 오늘 날짜.
3. 오늘 이미 2편을 발행했다면(루틴 메모리 또는 `git log --since=today`로 확인) 중복 발행하지 않고 종료한다.

## 1. 주제 고르기
- `docs/topic-queue.md`에서 위에서부터 `[ ]` 항목 2개를 고른다. **두 편은 서로 다른 카테고리.**
- `src/content/posts/`와 `docs/content-calendar.md`에 같은 slug·같은 제도가 없는지 확인한다.
- 신청 기간이 임박한 주제가 아래쪽에 있으면 먼저 써도 된다.
- 조사해 보니 제도가 폐지됐거나 공식 자료로 핵심 수치를 확인할 수 없으면 `[-] (사유)`로 표시하고 다음 주제로 넘어간다.

## 2. 조사와 작성 (글마다)
- `docs/WRITING_GUIDE.md`를 처음부터 끝까지 읽고 그대로 따른다 (6섹션 구조, 프론트매터 스키마, 문체, 금지어, 분량, FAQ 4~5개, 표 2개 이상, 내부 링크 1~3개, 스크린샷 추천 HTML 주석).
- **YMYL 원칙:** 모든 숫자·날짜·전화번호·URL은 공식 자료(go.kr, or.kr, 정책브리핑 korea.kr)에서 확인한 것만 쓴다. 블로그·나무위키는 단서로만. 확인 못 한 수치는 쓰지 않는다. 확정 안 된 정부안은 "정부안"으로 표시.
- `docs/factcheck/{slug}.md`에 수치 검증 기록을 남긴다 (수치 → 근거 URL + 확인 문장, 출처 간 충돌은 "주의").
- 신청 마감일이 공고로 확정된 제도면 프론트매터에 `deadline: YYYY-MM-DD`와 `deadlineLabel: "..."`를 넣는다 (홈 "마감이 다가오는 지원금"에 자동 노출).
- `docs/content-calendar.md` 표 맨 아래에 새 행을 추가한다 (번호 이어서, 카테고리 한글명, slug, 제목, 메인 키워드, 검색 의도). **검수 스크립트가 이 표의 slug로 내부 링크를 검사하므로 작성 전에 추가.**
- 두 편은 서브에이전트 2개로 병렬 작성해도 된다 (각자 자기 글 파일과 factcheck 파일만 수정하게 한다).

## 3. 일러스트
REPL에서 `imagegen.generate({ prompt })`로 글마다 1장을 만든다. 프롬프트는 아래 고정 문구 + 글 내용을 상징하는 사물 묘사 + 카테고리 배경색.

```
Soft 3D clay-render illustration in a friendly Korean fintech magazine style. Pastel solid background,
matte materials, rounded chunky shapes, gentle studio lighting with soft shadow, minimal composition with
generous empty space, centered subject. Absolutely no text, no letters, no numbers, no logos, no watermark.
Square format. Subject: {사물 2~3개 묘사, 사람 얼굴 없이}. Background color: {배경색}.
```
배경색: income `soft sky blue (#DCE8FB)` · finance `soft peach orange (#FBE3D3)` · business `soft mint green (#DDF0E2)` · welfare `soft blush pink (#FADDE3)`

생성된 PNG를 임시 폴더에 저장한 뒤:
```
node scripts/make-images.cjs <png 경로> <slug>
```
→ `public/images/posts/{slug}.webp`, `public/images/og/{slug}.jpg` 생성. 결과 이미지를 한 번 열어 글씨·로고가 없는지 확인한다 (있으면 다시 생성).

## 4. 검수와 빌드
```
$env:PYTHONIOENCODING='utf-8'; python scripts/validate.py          # 전체 [ OK ] 여야 함
node node_modules/astro/bin/astro.mjs build                         # npm run build 대신 이 명령
```
- 실패하면 고쳐서 다시. 빌드가 통과하지 못하면 **push하지 않는다.**

## 5. 배포
```
git add -A
git -c user.name="cushak86" -c user.email="cushak@icloud.com" commit -m "새 글 2편: {slug1}, {slug2}"
git push origin main
```
- `docs/topic-queue.md`에서 두 주제를 `[x] (YYYY-MM-DD)`로 바꾼 것도 같은 커밋에 넣는다.
- `gh api "repos/cushak86/agenwiki/deployments?environment=Production&per_page=1"`로 방금 커밋의 배포가 `success`가 될 때까지 기다린다 (최대 약 3분).
- `https://agenwiki.online/posts/{slug}/` 두 주소가 200인지 확인한다.
- `node scripts/indexnow.mjs https://agenwiki.online/posts/{slug1}/ https://agenwiki.online/posts/{slug2}/`

## 6. 보고
- 발행한 글 제목과 주소, 각 글의 핵심 수치 3개(출처 포함), 사람이 다시 확인할 불확실한 점.
- 건너뛴 주제와 사유, 대기열에 남은 `[ ]` 개수 (10개 미만이면 새 주제 후보 10개를 대기열 맨 아래에 추가하고 보고).
