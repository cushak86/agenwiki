"""에이전위키 포스트 본문 검사. 프론트매터 스키마는 Astro(zod)가 빌드 때 잡으므로 여기선 본문 규칙 위주.

    python scripts/validate.py                # 전체 검사
    python scripts/validate.py path/to/a.md   # 개별 검사
    python scripts/validate.py --demo         # 자체 테스트
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POSTS = ROOT / "src" / "content" / "posts"
CALENDAR = ROOT / "docs" / "content-calendar.md"

BANNED = [
    "안녕하세요", "오늘은", "알아보겠습니다", "알아보도록", "도움이 되셨", "마무리하겠습니다",
    "포스팅을 마", "이번 시간에는", "여러분", "100%", "무조건",
]
PLACEHOLDERS = ["[📸", "TODO", "[입력", "(입력", "XXX", "lorem"]
SECTIONS = {1: None, 2: None, 3: None, 4: None, 5: "자주 묻는 질문", 6: None}
MIN_CHARS, MAX_CHARS = 1800, 4200


def split_frontmatter(text: str) -> tuple[str, str]:
    m = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n(.*)$", text, re.S)
    return (m.group(1), m.group(2)) if m else ("", text)


def known_slugs() -> set[str]:
    if not CALENDAR.exists():
        return set()
    return set(re.findall(r"^\|\s*\d+\s*\|[^|]*\|\s*([a-z0-9-]+)\s*\|", CALENDAR.read_text(encoding="utf-8"), re.M))


def visible_chars(body: str) -> int:
    t = re.sub(r"<!--.*?-->", "", body, flags=re.S)
    t = re.sub(r"\]\([^)]*\)", "]", t)          # 링크 URL 제외
    t = re.sub(r"^\s*\|?[\s:|-]+\|?\s*$", "", t, flags=re.M)  # 표 구분선
    t = re.sub(r"[#>*|`\[\]_-]", "", t)
    return len(re.sub(r"\s", "", t))


def check(text: str, slug: str | None = None) -> list[str]:
    fm, body = split_frontmatter(text)
    errors: list[str] = []
    if not fm:
        errors.append("프론트매터(---) 블록이 없음")
    for key in ("title:", "description:", "verifiedDate:", "summary:", "agency:", "sources:", "category:", "keyword:"):
        if fm and not re.search(rf"^{key}", fm, re.M):
            errors.append(f"프론트매터 필드 누락: {key[:-1]}")

    visible = re.sub(r"<!--.*?-->", "", body, flags=re.S)
    for word in BANNED:
        if word in visible:
            errors.append(f"금지 표현 포함: '{word}'")
    for ph in PLACEHOLDERS:
        if ph in visible:
            errors.append(f"노출된 플레이스홀더: '{ph}'")
    if re.search(r"^# ", body, re.M):
        errors.append("본문에 H1(# ) 사용 금지 — 제목은 레이아웃이 출력")
    if body.count("```") % 2:
        errors.append("코드 블록(```)이 닫히지 않음")

    h2 = re.findall(r"^## (.+)$", body, re.M)
    nums = []
    for h in h2:
        m = re.match(r"(\d)\.\s", h)
        if m:
            nums.append(int(m.group(1)))
    if nums != [1, 2, 3, 4, 5, 6]:
        errors.append(f"H2 번호 구조가 1~6 순서가 아님: {nums}")
    faq_h2 = [h for h in h2 if h.startswith("5.")]
    if faq_h2 and "자주 묻는 질문" not in faq_h2[0]:
        errors.append("5번 섹션 제목에 '자주 묻는 질문'이 없음")

    faq_block = re.search(r"^## 5\..*?$(.*?)(?=^## 6\.|\Z)", body, re.M | re.S)
    qs = re.findall(r"^### Q", faq_block.group(1), re.M) if faq_block else []
    if not 4 <= len(qs) <= 6:
        errors.append(f"FAQ 질문(### Q) {len(qs)}개 (4~5개 필요)")

    tables = len(re.findall(r"^\|?\s*:?-{3,}", body, re.M))
    if tables < 2:
        errors.append(f"표가 {tables}개 (최소 2개)")
    if "<!-- 📸 캡처 추천:" not in body:
        errors.append("스크린샷 추천 주석(<!-- 📸 캡처 추천: ... -->) 없음")

    internal = re.findall(r"\]\(/posts/([a-z0-9-]+)/?\)", body)
    if not internal:
        errors.append("내부 링크(/posts/slug/) 없음")
    slugs = known_slugs()
    for s in internal:
        if slugs and s not in slugs:
            errors.append(f"캘린더에 없는 내부 링크: /posts/{s}/")
        if slug and s == slug:
            errors.append("자기 자신으로 가는 내부 링크")
    if not re.search(r"\]\(https?://[^)]+\)", body):
        errors.append("본문에 공식 외부 링크 없음 (6번 섹션)")

    n = visible_chars(body)
    if n < MIN_CHARS:
        errors.append(f"본문이 짧음 (공백 제외 {n}자, 최소 {MIN_CHARS}자)")
    if n > MAX_CHARS:
        errors.append(f"본문이 너무 김 (공백 제외 {n}자, 최대 {MAX_CHARS}자)")
    return errors


def main(paths: list[str]) -> int:
    files = [Path(p) for p in paths] if paths else sorted(POSTS.glob("*.md"))
    if not files:
        print("검사할 포스트가 없습니다.")
        return 0
    failed = 0
    for f in files:
        text = f.read_text(encoding="utf-8")
        errors = check(text, f.stem)
        n = visible_chars(split_frontmatter(text)[1])
        if errors:
            failed += 1
            print(f"[FAIL] {f.name} ({n}자)")
            for e in errors:
                print(f"       - {e}")
        else:
            print(f"[ OK ] {f.name} ({n}자)")
    print(f"\n{len(files) - failed}/{len(files)} 통과")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main([a for a in sys.argv[1:] if not a.startswith("-")]))
